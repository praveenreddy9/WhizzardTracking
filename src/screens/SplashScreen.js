import React, {Component} from 'react';
import {Image, Text, View} from 'react-native';
import MapmyIndiaIntouch from 'mapmyindia-intouch-react-native-sdk';

class SplashScreen extends Component {
  componentDidMount() {
    this.timer = setTimeout(async () => {
      const status = await MapmyIndiaIntouch.isInitialized();
      if (status) {
        this.props.navigation.replace('track');
      } else {
        this.props.navigation.replace('input');
      }
    }, 1000);
  }

  componentWillUnmount() {
    clearTimeout(this.timer);
  }

  render() {
    return (
      <View style={{flex: 1}}>
        <Image
          style={{flex: 1, height: '100%', width: '100%'}}
          // source={require('../assets/splash.jpg')}
          source={require('../assets/splash_screen.png')}
        />
      </View>
    );
  }
  l̥;
}

export default SplashScreen;
