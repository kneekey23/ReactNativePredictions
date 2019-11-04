import React from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  Button,
  SafeAreaView,
  Dimensions,
  TouchableOpacity
} from 'react-native';
import { Predictions } from 'aws-amplify';


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
      this.setState({ resultMessage: "Text analyzed!" })
      this.setState({ resultSentiment: result.textInterpretation.sentiment.predominant });
    })
      .catch(err => console.log(JSON.stringify(err, null, 2)))
  }
  render() {
    return (
      <SafeAreaView style={styles.container}>
        <View style={{ padding: 10 }}>
          <TextInput
            style={styles.textContainer}
            placeholder="Type here for sentiment"
            onChangeText={(text) => this.setState({ text })}
            value={this.state.text}
          />
          <TouchableOpacity
            style={styles.interpretButton}
            underlayColor='#fff'
            onPress={this.sentimentAnalysis}>
            <Text style={styles.buttonText}>Get Sentiment</Text>
          </TouchableOpacity>
          <View style={styles.sentimentTextView}>
            <Text style={styles.sentimentText}>
              {this.state.resultMessage}
            </Text>
            <Text style={styles.sentimentText}>
              {this.state.resultSentiment}
            </Text>
          </View>
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
    backgroundColor: '#FAE5F1'

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
  interpretButton: {
    marginTop: 10,
    paddingTop: 10,
    paddingBottom: 10,
    backgroundColor: '#3bddbd',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#3bddbd',
    opacity: 1
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    paddingLeft: 10,
    paddingRight: 10,
    fontSize: 25
  },
  sentimentTextView: {
    alignItems: "center",
    justifyContent: "center",
    padding: 10
  },
  sentimentText: {
    color: "white",
    fontSize: 30
  }
});