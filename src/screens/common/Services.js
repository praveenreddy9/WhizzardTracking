import React from 'react';
import axios from 'axios';
import AsyncStorage from "@react-native-community/async-storage";
import {PermissionsAndroid,StyleSheet
} from "react-native";
import {CText, LoadImages, LoadSVG, Styles} from "../common";
import Utils from "../common/Utils";

var Services = function () {
};

//LOCATIONS RETURN
Services.prototype.returnLocationForHeaders = async (returnLocation) => {
    try {
        const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            Geolocation.getCurrentPosition(
                async (position) => {
                    const currentLocation = position.coords;
                    // console.log('Services location', position);
                    returnLocation(currentLocation)
                },
                (error) => {
                    // console.log('SERVICES HEADERS Location error', error);
                    Utils.dialogBox(error.message, '');
                    returnLocation(null)
                }
            );
        } else {
            // Utils.dialogBox('Location permission denied', '');
            returnLocation(null)
            Services.prototype.deniedLocationAlert()
        }
    } catch (err) {
        Utils.dialogBox(err, '')
        returnLocation(null)
    }
};

//HTTP request for Auth API's
Services.prototype.AuthHTTPRequest = function (URL, method, body, successCallback, errorCallback) {
    // let locationsData = {latitude : null,longitude:null}
    AsyncStorage.getItem('Whizzard:token').then((token) => {
        AsyncStorage.getItem('Whizzard:DEVICE_ID').then((DEVICE_ID) => {
            // console.log('From Services', URL, method, body,data)
            // console.log('AndroidId at AuthHttp',DeviceInfo.getDeviceId())
            const start = new Date().getTime();
            Services.prototype.returnLocationForHeaders((returnLocation)=>{
                let latitude = null;
                let longitude=null;
                if (returnLocation){
                    latitude = returnLocation.latitude;
                    longitude = returnLocation.longitude
                }
            // console.log('AUTH locations ',locations);
               axios(URL, {
                   method: method,
                   headers: {
                       Accept: "application/json",
                       "Content-Type": "application/json",
                       "Authorization": token,
                       "DEVICEID": DEVICE_ID,
                       "AndroidId":DeviceInfo.getDeviceId(),
                       'latitude':latitude,
                       'longitude':longitude
                       // 'latitude':25.441030,
                       // 'longitude':85.3987686
                   },
                   data: body
               }).then(function (response) {
                   if (response) {
                       successCallback(response);
                       // console.log('AUTH success response',response);
                       const end = new Date().getTime();
                       const timeTaken= Math.abs(end-start);
                       console.log(URL,'timeTaken==>',timeTaken/1000);
                   }
               }).catch(function (error) {
                   // console.log('services error',error.response,error.message)
                   errorCallback(error);
               })
            });
        });
    });
};

//HTTP request for No Auth API's
Services.prototype.NoAuthHTTPRequest = function (URL, method, body, successCallback, errorCallback) {
    AsyncStorage.getItem('Whizzard:DEVICE_ID').then((DEVICE_ID) => {
        // console.log('Login DEVICE_ID',DEVICE_ID);
        // console.log('AndroidId at NoAuthHttp',DeviceInfo.getDeviceId())
        // const start = new Date().getTime();
        Services.prototype.returnLocationForHeaders((returnLocation)=>{
            let latitude = null;
            let longitude=null;
            if (returnLocation){
                latitude = returnLocation.latitude;
                longitude = returnLocation.longitude
            }
        axios(URL, {
            method: method,
            // timeout: 1000*10,
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                "AndroidId":DeviceInfo.getDeviceId(),
                'latitude':latitude,
                'longitude':longitude,
                "DEVICEID": DEVICE_ID
                // "DEVICEID": null
            },
            data: body,
        }).then(function (response) {
            // console.log('NoAuthHTTPRequest response', response)
            if (response) {
                successCallback(response);
                // const end = new Date().getTime();
                // const timeTaken= Math.abs(end-start);
                // console.log(URL,'No AUTH timeTaken==>',timeTaken/1000);
            }
        }).catch(function (error) {
            // console.log('NoAuthHTTPRequest error', error, error.response)
            errorCallback(error)
        })
    });
    });
};

//HTTP request for Auth API's
Services.prototype.AuthProfileHTTPRequest = function (URL, method, body, successCallback, errorCallback) {
    AsyncStorage.getItem('Whizzard:token').then((token) => {
        AsyncStorage.getItem('Whizzard:DEVICE_ID').then((DEVICE_ID) => {
            // console.log('From Services', URL, method, body,data)
            const start = new Date().getTime();
            Services.prototype.returnLocationForHeaders((returnLocation)=>{
                let latitude = null;
                let longitude=null;
                if (returnLocation){
                    latitude = returnLocation.latitude;
                    longitude = returnLocation.longitude
                }
            axios(URL, {
                method: method,
                headers: {
                    Accept: "application/json",
                    'Content-Type': 'multipart/form-data;',
                    "Authorization": token,
                    "DEVICEID": DEVICE_ID,
                    "AndroidId":DeviceInfo.getDeviceId(),
                    'latitude':latitude,
                    'longitude':longitude
                },
                data: body
            }).then(function (response) {
                if (response) {
                    successCallback(response);
                    const end = new Date().getTime();
                    const timeTaken= Math.abs(end-start);
                    console.log(URL,'Profile auth timeTaken==>',timeTaken/1000);
                }
            }).catch(function (error) {
                // console.log('services error',error.response,error.message)
                errorCallback(error);
            })
        });
    });
    });
};

//HTTP request for Auth API's
Services.prototype.AuthDeleteImageHTTPRequest = function (URL, method, body, successCallback, errorCallback) {
    AsyncStorage.getItem('Whizzard:token').then((token) => {
        AsyncStorage.getItem('Whizzard:DEVICE_ID').then((DEVICE_ID) => {
            // console.log('From Services', URL, method, body,data)
            const start = new Date().getTime();
            Services.prototype.returnLocationForHeaders((returnLocation)=>{
                let latitude = null;
                let longitude=null;
                if (returnLocation){
                    latitude = returnLocation.latitude;
                    longitude = returnLocation.longitude
                }
            axios(URL, {
                method: method,
                headers: {
                    Accept: "application/json",
                    // 'Content-Type': 'multipart/form-data;',
                    "Authorization": token,
                    "DEVICEID": DEVICE_ID,
                    "AndroidId":DeviceInfo.getDeviceId(),
                    'latitude':latitude,
                    'longitude':longitude
                },
                data: body
            }).then(function (response) {
                if (response) {
                    successCallback(response);
                    const end = new Date().getTime();
                    const timeTaken= Math.abs(end-start);
                    console.log(URL,'Delete Image timeTaken==>',timeTaken/1000);
                }
            }).catch(function (error) {
                // console.log('services error',error.response,error.message)
                errorCallback(error);
            })
        });
    });
    });
};

//HTTP request for Auth Signature API's
Services.prototype.AuthSignatureHTTPRequest = function (URL, method, body, successCallback, errorCallback) {
    AsyncStorage.getItem('Whizzard:token').then((token) => {
        AsyncStorage.getItem('Whizzard:DEVICE_ID').then((DEVICE_ID) => {
            // console.log('From Services', URL, method, body,data)
            // const start = new Date().getTime();
            Services.prototype.returnLocationForHeaders((returnLocation)=>{
                let latitude = null;
                let longitude=null;
                if (returnLocation){
                    latitude = returnLocation.latitude;
                    longitude = returnLocation.longitude
                }
            axios(URL, {
                method: method,
                headers: {
                    Accept: "application/json",
                    // 'Content-Type': 'multipart/form-data;',
                    "Authorization": token,
                    "DEVICEID": DEVICE_ID,
                    "AndroidId":DeviceInfo.getDeviceId(),
                    'latitude':latitude,
                    'longitude':longitude
                },
                data: body
            }).then(function (response) {
                if (response) {
                    successCallback(response);
                    // const end = new Date().getTime();
                    // const timeTaken= Math.abs(end-start);
                    // console.log(URL,'Signature timeTaken==>',timeTaken/1000);
                }
            }).catch(function (error) {
                // console.log('services error',error.response,error.message)
                errorCallback(error);
            })
        });
    });
    });
};

//to check camera access permission
Services.prototype.requestCameraPermission = async () => {
    try {
        const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.CAMERA
        );
        // If CAMERA Permission is granted
        return granted === PermissionsAndroid.RESULTS.GRANTED;
    } catch (err) {
        Utils.dialogBox('Camera Permissions Denied','');
        return false;
    }
};

//to check library access permissions
Services.prototype.requestExternalWritePermission = async () => {
    try {
        const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE
        );
        // If WRITE_EXTERNAL_STORAGE Permission is granted
        return granted === PermissionsAndroid.RESULTS.GRANTED;
    } catch (err) {
        Utils.dialogBox('External Permissions Denied','');
        return false;
    }
};

//checks permissions and on uploadType will direct to function
Services.prototype.checkImageUploadPermissions = async (uploadType,successCallback) => {
    // uploadType === LIBRARY //CAMERA
    let isCameraPermitted = await Services.prototype.requestCameraPermission();
    let isStoragePermitted = await Services.prototype.requestExternalWritePermission();
    if (isCameraPermitted && isStoragePermitted) {
        if (uploadType === 'LIBRARY'){ //CAMERA
            Services.prototype.chooseFileFromLibrary(uploadType,successCallback)
        }else {
            Services.prototype.captureImage(uploadType,successCallback)
        }
    }else {
        Utils.dialogBox(isCameraPermitted ? 'External Permissions Denied' : 'Camera Permissions Denied','');
    }
};

//to upload from library with crop
Services.prototype.chooseFileFromLibrary = function (uploadType,successCallback) {
    const options = {
        title: 'Select Avatar',
        storageOptions: {
            skipBackup: true,
            path: 'images',
        },
        maxWidth: 1200, maxHeight: 800,
        saveToPhotos: true
    };

    launchImageLibrary(options, (response)=> {
            // console.log('Services pic resposne', response)
            if (response.didCancel) {
                console.log('User cancelled image picker');
            } else if (response.error) {
                console.log('ImagePicker Error: ', response.error);
            } else if (response.customButton) {
                console.log('User tapped custom button: ', response.customButton);
            } else if (response.fileSize > 2000000) {
                console.log('pic resposne 2000000', response.fileSize);
                Utils.dialogBox('Image Size should be less than 2 MB', '');
            } else {
                ImageCropPicker.openCropper({
                    freeStyleCropEnabled: true,
                    // path: response.uri,
                    path: response.assets[0].uri,
                }).then(image => {
                    // console.log('Services crop image respose', image);
                    // let fileName = response.uri.split('/').pop();
                    let tempImageData = {}
                    let formData = new FormData();
                    formData.append('files', {
                                    uri: image.path,
                                    type: image.mime,
                                    name: image.path
                                });
                    tempImageData.image = image;
                    tempImageData.formData = formData;
                    successCallback(tempImageData);
                }).catch(error => {
                    console.log('Services crop image error', error);
                });
            }
        },(error)=>{
        console.log('device image error',error);
        })
};

//to upload by camera with crop
Services.prototype.captureImage = function (uploadType,successCallback) {
    const options = {
        title: 'Select Avatar',
        storageOptions: {
            skipBackup: true,
            path: 'images',
        },
        maxWidth: 1200, maxHeight: 800,
        saveToPhotos: true
    };

    launchCamera(options, (response)=> {
        // console.log('Services pic resposne', response)
        if (response.didCancel) {
            console.log('User cancelled image picker');
        } else if (response.error) {
            console.log('ImagePicker Error: ', response.error);
        } else if (response.customButton) {
            console.log('User tapped custom button: ', response.customButton);
        } else if (response.fileSize > 2000000) {
            console.log('pic resposne 2000000', response.fileSize);
            Utils.dialogBox('Image Size should be less than 2 MB', '');
        } else {
            ImageCropPicker.openCropper({
                freeStyleCropEnabled: true,
                // path: response.uri,
                path: response.assets[0].uri,
            }).then(image => {
                // console.log('Services crop image respose', image);
                // let fileName = response.uri.split('/').pop();
                let tempImageData = {}
                let formData = new FormData();
                formData.append('files', {
                    uri: image.path,
                    type: image.mime,
                    name: image.path
                });
                tempImageData.image = image;
                tempImageData.formData = formData;
                successCallback(tempImageData);
            }).catch(error => {
                console.log('Services crop image error', error);
            });
        }
    },(error)=>{
        console.log('device image error',error);
    })
};


const styles = StyleSheet.create({
    shadow: {
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.20,
        shadowRadius: 1.41,
        elevation: 2,
        marginLeft: 5,
        marginRight: 5
    },
});

export default new Services();


