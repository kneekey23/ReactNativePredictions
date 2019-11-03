import React from 'react';
import { Text, View, TouchableOpacity } from 'react-native';
import * as Permissions from 'expo-permissions';
import { Camera } from 'expo-camera';
import { Predictions } from 'aws-amplify'


export default class IdentifyScreen extends React.Component {
  state = {
    hasCameraPermission: null,
    type: Camera.Constants.Type.back,
    image: null
  };

  identify = async() => {
    const blob = await new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest()
      xhr.onload = function() {
        resolve(xhr.response)
      }
      xhr.onerror = function(e) {
        console.log(e)
        reject(new TypeError('Network request failed'))
      }
      xhr.responseType = 'blob'
      xhr.open('GET', this.state.image.uri, true)
      xhr.send(null)
    })
    Predictions.identify({
      labels: {
        source: {
          file: blob
        },
        type: "ALL"
      }
    }).then(result => {
      console.log('result: ', result)
    })
      .catch(err => {
        console.log('error: ', err)
      })
  }

  async componentDidMount() {
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    this.setState({ hasCameraPermission: status === 'granted' });
  }

  snap = async () => {
    if (this.camera) {
      let photo = await this.camera.takePictureAsync();
      console.log('photo: ', photo)
      this.setState({ image: photo })
      await this.identify()
    }
  };

  render() {
    const { hasCameraPermission } = this.state;
    if (hasCameraPermission === null) {
      return <View />;
    } else if (hasCameraPermission === false) {
      return <Text>No access to camera</Text>;
    } else {
      return (
        <View style={{ flex: 1 }}>
          <Button onPress={this.snap}></Button>
        </View>
      );
    }
  }
}

IdentifyScreen.navigationOptions = {
  title: 'Identify',
};

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     paddingTop: 15,
//     backgroundColor: '#fff',
//   },
// });
