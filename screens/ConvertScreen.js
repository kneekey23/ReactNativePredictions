import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  TextInput,
  Button
} from 'react-native';
import { Predictions } from 'aws-amplify';

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
            style={{ height: 40 }}
            placeholder="Type here to translate text from english to spanish!"
            onChangeText={(text) => this.setState({ text })}
            value={this.state.text}
          />
          <Button title="Translate Text" onPress={this.translateText}></Button>
          <Text style={{ padding: 10, fontSize: 42 }}>
            {this.state.resultMessage}
          </Text>
          <Text style={{ padding: 10, fontSize: 42 }}>
            {this.state.resultTranslation}
          </Text>
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

  },
  title: {
    textAlign: 'center',
    marginVertical: 8,
  },
  fixToText: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  separator: {
    marginVertical: 8,
    borderBottomColor: '#737373',
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
});
