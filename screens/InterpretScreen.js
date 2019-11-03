import React from 'react';
import { 
  StyleSheet,
  Text, 
  TextInput, 
  View, 
  Button, 
  SafeAreaView
 } from 'react-native';
import {Predictions } from 'aws-amplify';


export default class InterpretScreen extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
        text: '',
        resultSentiment: '',
        resultMessage: ''
    }
}

sentimentAnalysis = () => {
  let textToInterpret = this.state.text
  Predictions.interpret({
      text: {
        source: {
          text: textToInterpret,
          language: "en"
        },
      type: "SENTIMENT"
      }
    }).then(result => {
      console.log(result);
      this.setState({resultMessage: "Text analyzed!"})
      this.setState({resultSentiment: result.textInterpretation.sentiment.predominant});
    })
      .catch(err => console.log(JSON.stringify(err, null, 2)))
}
  render() {
    return (
      <SafeAreaView style={styles.container}>
      <View style={{padding: 10}}>
        <TextInput
          style={{height: 40}}
          placeholder="Type here to run sentiment analysis on this text"
          onChangeText={(text) => this.setState({text})}
          value={this.state.text}
        />
     
        <Button title="Get Sentiment" onPress={this.sentimentAnalysis}></Button>
        <Text style={{padding: 10, fontSize: 42}}>
          {this.state.resultMessage}
        </Text>
        <Text style={{padding: 10, fontSize: 42}}>
          {this.state.resultSentiment}
        </Text>
      </View>
      </SafeAreaView>
    )
  }

}

InterpretScreen.navigationOptions = {
  title: 'Interpret',
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