import React, {Component} from 'react';
import {StyleSheet, Text, View, Button} from 'react-native';
import firebase from 'react-native-firebase';

export default class App extends Component {

  componentDidMount() {

    const channel = new firebase.notifications.Android.Channel('test-channel', 'Test Channel', firebase.notifications.Android.Importance.Max)
    .setDescription('My apps test channel');
  
    firebase.notifications().android.createChannel(channel);

    firebase.messaging().subscribeToTopic("firstTopic");
    
    firebase.messaging().getToken()
      .then(fcmToken => {
      if(fcmToken) {
        fetch('https://gcm-http.googleapis.com/gcm/send', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'key=AAAAFvcPpzw:APA91bEcq6BZtHmAVRzgfg6RIfSOsRYNZdcDQGGEAzeePLYReh0Sz-MKiN7WCsYhmQ78NGA6VghrkMNMCgsIJj0u48PohKqN55qnNZ3q8TtM2sdY4Xl3aEbJ2JFSRMLEWpqPnSiIlE60',
          },
          body: JSON.stringify({
            'to': fcmToken,
            'notification': {
              'body': 'Test',
              'title': 'Test'
            }
          })
        });
        alert(fcmToken);
      }
      alert("Testing");
    })

    this.onTokenRefreshListener = firebase.messaging().onTokenRefresh(fcmToken => {
      alert(fcmToken);
    });

    firebase.messaging().hasPermission()
      .then(enabled => {
      if (enabled) {
        alert("Permission Enabled");
      } else {
        askForPermission();
      } 
    });

    this.notificationDisplayedListener = firebase.notifications().onNotificationDisplayed((notification) => {
        alert("Notification Displayed");
    });
    this.notificationListener = firebase.notifications().onNotification((notification) => {
        alert("Notification");
        alert(notification.title);
        alert(notification.body);
        const localNotification = new firebase.notifications.Notification({
          sound: 'default',
          show_in_foreground: true,
        })
        .setNotificationId(notification.notificationId)
        .setTitle(notification.title)
        .setSubtitle(notification.subtitle)
        .setBody(notification.body)
        .setData(notification.data)
        .android.setChannelId('test-channel')
        .android.setColor('#000000')
        .android.setPriority(firebase.notifications.Android.Priority.High);

      firebase.notifications().displayNotification(localNotification);
    });

    this.messageListener = firebase.messaging().onMessage((message) => {
        alert("Message");
    });

  }

  askForPermission() {
    firebase.messaging().requestPermission()
    .then(() => {
    })
    .catch(error => {
    });
  }

  sendFirebaseMessage() {
    
    fetch('https://gcm-http.googleapis.com/gcm/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'key=AAAAFvcPpzw:APA91bEcq6BZtHmAVRzgfg6RIfSOsRYNZdcDQGGEAzeePLYReh0Sz-MKiN7WCsYhmQ78NGA6VghrkMNMCgsIJj0u48PohKqN55qnNZ3q8TtM2sdY4Xl3aEbJ2JFSRMLEWpqPnSiIlE60',
      },
      body: JSON.stringify({
        'to': firebase.messaging().getToken(),
        'notification': {
          'body': 'Test',
          'title': 'Test'
        }
      })
    });
    
    
    /*const message = new firebase.messaging.RemoteMessage()
      .setTo('98634278716@gcm.googleapis.com')
      .setData({
        message: 'Testing',
        title: 'Test',
      });
  
    firebase.messaging().sendMessage(message)
    .then((response) => {
      alert("Success");
    })
    .catch((error) => {
      alert("Fail");
    });*/

   /* var message = {
      data: {
        title: 'Testing',
        message: 'Testing 123',
      },
      topic: 'firstTopic'
    };

    admin.messaging().send(message)
      .then((response) => {
        alert("Success");
      })
      .catch((error) => {
        alert("Fail");
      })*/
  }
      
  componentWillUnmount() {
    this.onTokenRefreshListener();
    this.notificationDisplayedListener();
    this.notificationListener();
    this.messageListener();
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>React Native Firebase Push Notifications POC</Text>
        <Button title="Send Message" onPress={this.sendFirebaseMessage} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
});
