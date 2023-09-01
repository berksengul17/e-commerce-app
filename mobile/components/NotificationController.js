import messaging from "@react-native-firebase/messaging";
import { useContext, useEffect } from "react";
import { PermissionsAndroid, Platform } from "react-native";
import PushNotification from "react-native-push-notification";
import { saveToken } from "../api/tokenService";
import { UserContext } from "../context/UserProvider";

// Register background handler
messaging().setBackgroundMessageHandler(async (remoteMessage) => {
  console.log("Message handled in the background!", remoteMessage);
});

function NotificationController() {
  const { user, setToken } = useContext(UserContext);

  useEffect(() => {
    async function requestUserPermission() {
      // IOS permission
      if (Platform.OS === "ios") {
        const authStatus = await messaging().requestPermission();
        const enabled =
          authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
          authStatus === messaging.AuthorizationStatus.PROVISIONAL;

        if (enabled) {
          console.log("Authorization status:", authStatus);
        }
      }

      // Android permission
      if (Platform.OS === "android") {
        PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS
        );
      }
    }

    if (requestUserPermission()) {
      if (user) {
        messaging()
          .getToken()
          .then((token) => {
            setToken(token);
            saveToken(user.id, token);
          });
      }
    }

    const unsubscribe = messaging().onMessage(async (remoteMessage) => {
      PushNotification.localNotification({
        channelId: "default",
        message: remoteMessage.notification.body,
        title: remoteMessage.notification.title,
      });
    });

    return unsubscribe;
  }, [user]);

  return null;
}

export default NotificationController;
