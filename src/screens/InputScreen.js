import {ProgressBar} from '@react-native-community/progress-bar-android';
import React, {Component} from 'react';
import {Button, Image, StyleSheet, Text, TextInput, View} from 'react-native';
import MapmyIndiaIntouch from 'mapmyindia-intouch-react-native-sdk';

const clientId =
  '33OkryzDZsK0fYf2MDsn4dsRAMnP_Frs97Id2dZwPuO1lbqjYp5NrP4DFHweovpoCKAtH1NCpneuRsKIx3v77cZA1g1i95tA';
const clientSecret =
  'lrFxI-iSEg-W7xCWVBmndqZ8-KUvG7Ft1ai_NokzHDe6DWmG9-1cTSOx4h1gRXZ5PEjIzbDfWPYziK49z4LWVZ0JvPTBppZNTVjWCuMQkHc=';

class InputScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      inputValue: '',
      showProgressbar: false,
      error: '',
    };
  }

  onPress = () => {
    if (this.state.inputValue != '') {
      this.setState({
        error: '',
        showProgressbar: true,
      });

      MapmyIndiaIntouch.initialize(
        this.state.inputValue,
        clientId,
        clientSecret,
        result => {
          if (result === 'success') {
            this.props.navigation.replace('track');
          } else {
            this.setState({
              error: result,
              showProgressbar: false,
            });
          }
        },
      );
    } else {
      this.setState({
        error: 'Please provide device name',
      });
    }
  };

  render() {
    const butttons = !this.state.showProgressbar ? (
      <View style={styles.button}>
        <Button title="Initialize" onPress={this.onPress} />
      </View>
    ) : (
      <View style={{marginTop: 10}}>
        <ProgressBar color="orange" />
        <Text style={{marginTop: 10}}>Please wait..</Text>
      </View>
    );

    const error =
      this.state.error != '' ? (
        <Text style={styles.error}>{this.state.error}</Text>
      ) : null;

    return (
      <View style={styles.root}>
        <Image
          source={require('../assets/in_touch_logo.png')}
          style={styles.logo}
        />

        <TextInput
          style={styles.input}
          onChangeText={text => this.setState({inputValue: text})}
          value={this.state.inputValue}
          placeholder="Device Name"
        />
        {error}
        {butttons}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    padding: 20,
  },
  logo: {
    width: 200,
    height: 50,
    marginTop: 40,
  },
  input: {
    width: '100%',
    borderColor: 'gray',
    borderRadius: 10,
    borderWidth: 1,
    marginTop: 40,
    padding: 10,
    fontSize: 20,
  },
  button: {
    marginTop: 30,
    width: '100%',
  },
  error: {
    color: 'red',
    fontSize: 15,
    width: '100%',
    marginLeft: 10,
  },
});

export default InputScreen;
