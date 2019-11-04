import React from 'react';
import {
  Text,
  View,
  SafeAreaView,
  Image,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  FlatList
} from 'react-native';
import * as Permissions from 'expo-permissions';
import { Camera } from 'expo-camera';
import { Predictions, Storage } from 'aws-amplify'
import Constants from 'expo-constants';
import * as ImagePicker from 'expo-image-picker';


export default class IdentifyScreen extends React.Component {
  state = {
    hasCameraPermission: null,
    type: Camera.Constants.Type.back,
    image: null,
    resultLabels: [],
    // resultMessage: ''
  };

  identify = async (fileName) => {
    let file = fileName.split('ImagePicker/').pop();
    console.log(file)
    const blob = await new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest()
      xhr.onload = function () {
        resolve(xhr.response)
      }
      xhr.onerror = function (e) {
        console.log(e)
        reject(new TypeError('Network request failed'))
      }
      xhr.responseType = 'blob'
      xhr.open('GET', this.state.image, true)
      xhr.send(null)
    })

    Storage.put(file, blob)
      .then(result => {
        console.log(result)

        //call to predictions if file was put in S3 successfully
        Predictions.identify({
          labels: {
            source: {
              key: file
            },
            type: "ALL"
          }
        }).then(result => {
          console.log('result: ', result)
          const { labels } = result;

          this.setState({ resultLabels: labels });
          this.setState({ resultMessage: "Classification successful!" })
        })
          .catch(err => {
            console.log('error: ', err)
          })

      })
      .catch(err => {
        console.log(err)
      });


  }

  async componentDidMount() {
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    this.setState({ hasCameraPermission: status === 'granted' });
    this.getPermissionAsync();
  }

  snap = async () => {
    if (this.camera) {
      let photo = await this.camera.takePictureAsync();
      console.log('photo: ', photo)
      this.setState({ image: photo })
      await this.identify(photo)
    }
  };

  getPermissionAsync = async () => {
    if (Constants.platform.ios) {
      const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
      if (status !== 'granted') {
        alert('Sorry, we need camera roll permissions to make this work!');
      }
    }
  }

  _pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
    });

    console.log(result);

    if (!result.cancelled) {
      this.setState({ image: result.uri });
      await this.identify(result.uri)
    }
  };

  renderSeparator = () => {
    return (
      <View
        style={{
          height: 1,
          width: '100%',
          backgroundColor: '#CED0CE',
          // marginLeft: '14%',
        }}
      />
    );
  };

  render() {
    const { hasCameraPermission, image } = this.state;
    if (hasCameraPermission === null) {
      return <SafeAreaView />;
    } else if (hasCameraPermission === false) {
      return <Text>No access to camera</Text>;
    } else {
      return (
        <SafeAreaView style={styles.container}>
          <View style={{ padding: 10 }}>
            {image &&
              <View style={styles.photoContainer}>
                <Image source={{ uri: image }} style={styles.imageStyle} />
              </View>
            }
            <TouchableOpacity
              style={styles.photoButton}
              underlayColor='#fff'
              onPress={this._pickImage}>
              <Text style={styles.buttonText}>Pick a Photo</Text>
            </TouchableOpacity>
            <View style={styles.photoContainer}>
              <Text style={styles.resultText}>{this.state.resultMessage}</Text>
            </View>
          </View>

          <FlatList
            data={this.state.resultLabels}
            keyExtractor={item => item.name}
            ItemSeparatorComponent={this.renderSeparator}
            renderItem={({ item }) => (
              <View style={styles.itemRow}>
                <View style={styles.itemNameView}>
                  <Text style={styles.resultText}>{item.name}</Text>
                </View>
                <View style={styles.itemConfidenceView}>
                  <Text style={styles.resultText}>{Math.round(item.metadata.confidence * 100) / 100}</Text>
                </View>
              </View>)}
          />

        </SafeAreaView>
      );
    }
  }
}

IdentifyScreen.navigationOptions = {
  title: 'Identify',
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  photoButton: {
    marginTop: 10,
    paddingTop: 10,
    paddingBottom: 10,
    backgroundColor: '#BD3BDD',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#BD3BDD',
    opacity: 1,
    width: Dimensions.get('window').width - 20,
    justifyContent: 'center',
    alignItems: 'center'
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    paddingLeft: 10,
    paddingRight: 10,
    fontSize: 25
  },
  imageStyle: {
    width: 100,
    height: 100,
    paddingTop: 15
  },
  photoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  resultText: {
    fontSize: 25
  },
  itemRow: {
    padding: 10,
    height: 50,
    flexDirection: 'row',  // main axis
    justifyContent: 'flex-start', // main axis
    alignItems: 'center', // cross axis
    paddingTop: 10,
    paddingBottom: 10,
    paddingLeft: 18,
    paddingRight: 16,
    marginLeft: 14,
    marginRight: 14,
    marginTop: 0,
    marginBottom: 6,
  },
  itemNameView: {
    flex: 1,
    flexDirection: 'column',
    fontSize: 25,
    textAlignVertical: 'center'
  },
  itemConfidenceView: {
    flex: 0,
    paddingLeft: 16,
    fontSize: 25
  }
});
