import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  Dimensions
} from 'react-native';
import { Predictions } from 'aws-amplify';
import { Constants } from 'expo-camera';
import ExpoConstants from 'expo-constants';

export default class ConvertScreen extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      text: '',
      resultMessage: '',
      resultTranslation: ''
    }
  }

  translateText = () => {
    console.log('run translate predictions')
    console.log(this.state.text)
    let textToTranslate = this.state.text
    Predictions.convert({
      translateText: {
        source: {
          text: textToTranslate
        }
      }
    }).then(result => {
      console.log(result);
      this.setState({ resultTranslation: result.text });
      this.setState({ resultMessage: "Text translation successful!" })
    })
      .catch(err => {
        this.setState({ resultMessage: err.message });
      })
  }
  render() {
    return (
      <SafeAreaView style={styles.container}>
        <View style={{ padding: 10 }}>
          <TextInput
            style={styles.textContainer}
            placeholder="Translate from english to portuguese"
            onChangeText={(text) => this.setState({ text })}
            value={this.state.text}
            multiline= {true}
          />
          <TouchableOpacity 
          style={styles.translateButton} 
          underlayColor='#fff' 
          onPress={this.translateText}>
            <Text style={styles.buttonText}>Translate Text</Text>
          </TouchableOpacity>
          <View style={styles.translationTextView}>
          <Text style={styles.translationText}>
            {this.state.resultMessage}
          </Text>
          <Text style={styles.translationText}>
            {this.state.resultTranslation}
          </Text>
          </View>
        </View>
      </SafeAreaView>
    );
  }
}

ConvertScreen.navigationOptions = {
  title: 'Convert',
};



const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#00aca857"

  },
  textContainer: {
    backgroundColor: "white",
    height: 50,
    width: Dimensions.get('window').width - 20,
    borderRadius: 10,
    textAlign: 'center',
    paddingTop: 15,
    fontSize: 20
  },
  translateButton:{
    marginRight:40,
    marginLeft:40,
   marginTop:10,
    paddingTop:15,
    paddingBottom:15,
    backgroundColor:'#d0037a82',
    borderRadius:10,
    borderWidth: 1,
    borderColor: '#d0037a82'
  },
  buttonText:{
      color:'#fff',
      textAlign:'center',
      paddingLeft : 10,
      paddingRight : 10,
      fontSize: 20
  },
  translationTextView: {
    alignItems: "center",
    justifyContent: "center",
    padding: 10
  },
  translationText: {
    color: "white",
    fontSize: 30
  }
});
