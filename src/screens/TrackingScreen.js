import React, {Component} from 'react';
import {
  Image,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Linking,
  Platform,
  Button,
} from 'react-native';
import MapmyIndiaIntouch from 'mapmyindia-intouch-react-native-sdk';
import play from '../assets/play_arrow_24_px.png';
import stop from '../assets/stop_24_px.png';
import Toast from 'react-native-simple-toast';
import {Picker} from '@react-native-picker/picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import Utils from '../screens/common/Utils';

const clientId =
    '33OkryzDZsK0fYf2MDsn4dsRAMnP_Frs97Id2dZwPuO1lbqjYp5NrP4DFHweovpoCKAtH1NCpneuRsKIx3v77cZA1g1i95tA';
const clientSecret =
    'lrFxI-iSEg-W7xCWVBmndqZ8-KUvG7Ft1ai_NokzHDe6DWmG9-1cTSOx4h1gRXZ5PEjIzbDfWPYziK49z4LWVZ0JvPTBppZNTVjWCuMQkHc=';

const restKey = '171f30d6adb70b80b0b0feb9a7b74575'

const accessToken = 'Bearer aca909be-e8ac-49fa-95de-26f94d176d71'

class TrackingScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      icon: play,
      text: 'Start Tracking',
      currentSpeed: MapmyIndiaIntouch.BEACON_PRIORITY_FAST,
      dropDownEnabled: true,
      pickerBackground: '#CCFF0000',
      isTrackingRunning: false,
    };
  }

  async componentDidMount() {
    MapmyIndiaIntouch.addTrackingStateListener(event => {
      Toast.show(event);
      console.log(event);
      if (event === 'onTrackingStart') {
        this.setIconsAndLabel(true);
      } else {
        this.setIconsAndLabel(false);
      }
    });
    this.getData();
    const status = await MapmyIndiaIntouch.isRunning();
    this.setState({
      isTrackingRunning: status,
    });
    this.setIconsAndLabel(status);
  }

  componentWillUnmount() {
    MapmyIndiaIntouch.removeTrackingStateListener();
  }

  storeData = async value => {
    try {
      await AsyncStorage.setItem('@storage_Key', JSON.stringify(value));
    } catch (e) {
      // saving error
    }
  };

  getData = async () => {
    try {
      const value = await AsyncStorage.getItem('@storage_Key');
      if (value !== null) {
        this.setState({
          currentSpeed: parseInt(value),
        });
      }
    } catch (e) {
      // error reading value
    }
  };

  storeToken = async value => {
    try {
      await AsyncStorage.setItem('@token_key', JSON.stringify(value));
      // console.log('store ',value,typeof(value))
    } catch (e) {
      console.log('store error')
    }
  };

  getToken = async () => {

    // AsyncStorage.getItem('Whizzard:DEVICE_ID').then((DEVICE_ID) => {
    //
    // });


    try {
      const value = await AsyncStorage.getItem('@token_key');
      // console.log('get token ',value,typeof(value))
      if (value !== null) {
        this.setState({
          currentSpeed: parseInt(value),
        });
      }
    } catch (e) {
      // error reading value
    }
  };

  trackButtonPress = async () => {
    //console.log(status);
    if (this.state.isTrackingRunning) {
      this.setState({
        isTrackingRunning: false,
      });
      MapmyIndiaIntouch.stopTracking();
    } else {
      this.setState({
        isTrackingRunning: true,
      });
      MapmyIndiaIntouch.startTracking(this.state.currentSpeed);
      //MapmyIndiaIntouch.startTrackingWithCustomConfig(5,5);
    }
  };

  redirectButtonPress = () => {
    Linking.openURL('https://intouch.mapmyindia.com');
  };

  setIconsAndLabel = status => {
    if (status) {
      this.setState({
        icon: stop,
        text: 'Stop tracking',
        dropDownEnabled: false,
        pickerBackground: 'rgba(52, 52, 52, 0.3)',
      });
    } else {
      this.setState({
        icon: play,
        text: 'Start tracking',
        dropDownEnabled: true,
        pickerBackground: 'rgba(255, 140, 0, 0.3)',
      });
    }
  };

  //only for ios platform
  chooseLabel(value) {
    switch (value) {
      case 0:
        return 'FAST';
      case 1:
        return 'SLOW';
      case 2:
        return 'OPTIMAL';
      default:
        return 'FAST';
    }
  }

  async tokenGeneration() {
    var axios = require('axios');
    var FormData = require('form-data');
    var data = new FormData();
    data.append('grant_type', 'client_credentials');
    data.append('client_id', clientId);                 //CICS
    data.append('client_secret', clientSecret);

    var config = {
      method: 'post',
      url: 'https://outpost.mapmyindia.com/api/security/oauth/token',
      headers: {
            'accept': 'application/json',
             'content-type': 'application/x-www-form-urlencoded',
          },
      data : data
    };

    axios(config)
        .then(function (response) {
          // console.log('token resp200',response.data);
          let value = 'Bearer '+response.data.access_token
          Utils.setToken('token', value, function () {
          });
        })
        .catch(function (error) {
          console.log('token error',error,error.response);
        });
  };


  getDeviceLocations() {
    AsyncStorage.getItem('WhizzardTracking:token').then((token) => {
      var axios = require('axios');
      var config = {
        method: 'get',
        url: 'https://intouch.mapmyindia.com/iot/api/devices',
        headers: {
          'accept': 'application/json',
          'Authorization': token
        }
      };
      axios(config)
          .then(function (response) {
            console.log('devices resp200',response.data);
          })
          .catch(function (error) {
            // console.log('devices error==>',error,error.response);
            Utils.dialogBox(error.response.data.error,'')
          });
    })
  };

  getDeviceGeofence() {
    AsyncStorage.getItem('WhizzardTracking:token').then((token) => {
      var axios = require('axios');
      var config = {
        method: 'get',
        url: 'https://intouch.mapmyindia.com/iot/api/geofences',
        headers: {
          'accept': 'application/json',
          'Authorization': token
        }
      };
      axios(config)
          .then(function (response) {
            console.log('geofence resp200',response.data);
          })
          .catch(function (error) {
            // console.log('geofence error==>',error,error.response);
            Utils.dialogBox(error.response.data.error,'')
          });
    })
  };

  getDriveDetails() {
    AsyncStorage.getItem('WhizzardTracking:token').then((token) => {
      var axios = require('axios');
      var config = {
        method: 'get',
        // url: 'https://intouch.mapmyindia.com/iot/api/devices/drives?deviceId=990309&startTime=1645014698&endTime=1645014699', //test
        // url: 'https://intouch.mapmyindia.com/iot/api/devices/drives?deviceId=993957&startTime=1645097400000&endTime=1645102875900',  //pallavi
        url: 'https://intouch.mapmyindia.com/iot/api/devices/drives?deviceId=993957&startTime=1645103248&endTime=1645103214',  //pallavi
        headers: {
          'accept': 'application/json',
          'Authorization': token
        }
      };
      axios(config)
          .then(function (response) {
            console.log('drive resp200',response.data);
          })
          .catch(function (error) {
            console.log('drive error==>',error,error.response);
            Utils.dialogBox(error.response.data.error,'')
          });
    })
  };

  getEventDetails() {
    AsyncStorage.getItem('WhizzardTracking:token').then((token) => {
      var axios = require('axios');
      var config = {
        method: 'get',
        url: 'https://intouch.mapmyindia.com/iot/api/devices/990309/events?startTime=1645014698&endTime=1645014698&skipPeriod=2',
        headers: {
          'accept': 'application/json',
          'Authorization': token
        }
      };
      axios(config)
          .then(function (response) {
            console.log('events resp200',response.data);
          })
          .catch(function (error) {
            // console.log('events error==>',error,error.response);
            Utils.dialogBox(error.response.data.error,'')
          });
    })
  };

  getDistanceMatrix() {
    AsyncStorage.getItem('WhizzardTracking:token').then((token) => {
      var axios = require('axios');
      var config = {
        method: 'get',
        url: 'https://apis.mapmyindia.com/advancedmaps/v1/'+restKey+'/distance_matrix/driving/mmi000%3B77.983936%2C28.255904?sources=0&destinations=1&region=IND',
        headers: {
          'accept': 'application/json',
          'Authorization': token
        }
      };
      console.log('matrix console',config);
      axios(config)
          .then(function (response) {
            console.log('matrix resp200',response.data);
          })
          .catch(function (error) {
            // console.log('matrix error==>',error,error.response);
            Utils.dialogBox(error.response.data.error,'')
          });
    })
  };

  render() {
    //only for ios platform
    const iosPicker = this.state.dropDownEnabled ? (
      <Picker
        enabled={this.state.dropDownEnabled}
        selectedValue={this.state.currentSpeed}
        style={{height: 50, width: 140, marginBottom: 150}}
        onValueChange={(itemValue, itemIndex) => {
          console.log(itemValue);
          this.storeData(itemValue);
          this.setState({currentSpeed: itemValue});
        }}>
        <Picker.Item
          label="FAST"
          value={MapmyIndiaIntouch.BEACON_PRIORITY_FAST}
        />
        <Picker.Item
          label="SLOW"
          value={MapmyIndiaIntouch.BEACON_PRIORITY_SLOW}
        />
        <Picker.Item
          label="OPTIMAL"
          value={MapmyIndiaIntouch.BEACON_PRIORITY_OPTIMAL}
        />
      </Picker>
    ) : (
      <Text>{this.chooseLabel(this.state.currentSpeed)}</Text>
    );

    const picker =
      Platform.OS === 'android' ? (
        <View
          style={{
            ...styles.picker,
            backgroundColor: this.state.pickerBackground,
            borderColor: this.state.pickerBackground,
          }}>
          <Picker
            enabled={this.state.dropDownEnabled}
            selectedValue={this.state.currentSpeed}
            style={{height: 50, width: 140}}
            onValueChange={(itemValue, itemIndex) => {
              this.storeData(itemValue);
              this.setState({currentSpeed: itemValue});
            }}>
            <Picker.Item
              label="FAST"
              value={MapmyIndiaIntouch.BEACON_PRIORITY_FAST}
            />
            <Picker.Item
              label="SLOW"
              value={MapmyIndiaIntouch.BEACON_PRIORITY_SLOW}
            />
            <Picker.Item
              label="OPTIMAL"
              value={MapmyIndiaIntouch.BEACON_PRIORITY_OPTIMAL}
            />
          </Picker>
        </View>
      ) : (
        iosPicker
      );

    return (
      <View style={styles.root}>
        {/*<Image*/}
        {/*  source={require('../assets/in_touch_logo.png')}*/}
        {/*  style={styles.logo}*/}
        {/*/>*/}
        <Text style={styles.label}>LOCATION TRACKING</Text>

        <TouchableOpacity onPress={this.tokenGeneration}>
          <View style={styles.trackButton}>
            {/*<Image source={this.state.icon} style={{height: 30, width: 30}} />*/}
            <Text style={{fontWeight: 'bold'}}>TOKEN GENERATION</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity onPress={this.getDeviceLocations}>
          <View style={styles.trackButton}>
            {/*<Image source={this.state.icon} style={{height: 30, width: 30}} />*/}
            <Text style={{fontWeight: 'bold'}}>GET DEVICES</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity onPress={this.getDeviceGeofence}>
          <View style={styles.trackButton}>
            {/*<Image source={this.state.icon} style={{height: 30, width: 30}} />*/}
            <Text style={{fontWeight: 'bold'}}>DEVICE GEOFENCE</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity onPress={this.getDriveDetails}>
          <View style={styles.trackButton}>
            <Text style={{fontWeight: 'bold'}}>DRIVE DETIALS</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity onPress={this.getEventDetails}>
          <View style={styles.trackButton}>
            <Text style={{fontWeight: 'bold'}}>EVENT DETIALS</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity onPress={this.getDistanceMatrix}>
          <View style={styles.trackButton}>
            {/*<Image source={this.state.icon} style={{height: 30, width: 30}} />*/}
            <Text style={{fontWeight: 'bold'}}>DISTANCE MATRIX</Text>
          </View>
        </TouchableOpacity>

        <View style={{flex: 2, justifyContent: 'center', alignItems: 'center'}}>
          <Text style={{fontWeight: 'bold', color: 'grey'}}>Choose Speed</Text>
          {picker}
          <TouchableOpacity onPress={this.trackButtonPress}>
            <View style={styles.trackButton}>
              <Image source={this.state.icon} style={{height: 30, width: 30}} />
              <Text style={{fontWeight: 'bold'}}>{this.state.text}</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={this.redirectButtonPress}
            style={{marginTop: 10}}>
            <View style={{flexDirection: 'row', marginTop: 40}}>
              <Image
                source={require('../assets/open_in_new_24_px.png')}
                style={{height: 20, width: 20}}
              />
              <Text style={{fontWeight: 'bold', color: '#33B3FF'}}>
                Redirect to InTouch
              </Text>
            </View>
          </TouchableOpacity>
          <View style={{margin: 20}}>
            <Button
              title="Get current Location"
              onPress={async () => {
                try {
                  const res =
                    await MapmyIndiaIntouch.getCurrentLocationUpdate();
                  Toast.show(
                    `Longitute: ${res.longitude},Latitute: ${res.latitude}`,
                  );
                  console.log(res);
                } catch (e) {
                  console.log(e);
                }
              }}
            />
          </View>
        </View>
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
    width: 140,
    height: 35,
    marginTop: 40,
  },
  label: {
    color: 'grey',
  },
  trackButton: {
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: 'grey',
    borderWidth: 1,
    paddingTop: 5,
    paddingBottom: 5,
    paddingRight: 10,
    width: 130,
    borderRadius: 10,
    marginTop:10
  },
  picker: {
    marginBottom: 20,
    borderWidth: 1,
    borderRadius: 5,
  },
});

export default TrackingScreen;
