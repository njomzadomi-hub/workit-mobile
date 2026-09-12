import { Platform } from 'react-native';
import Constants from 'expo-constants';
import * as Notifications from 'expo-notifications';
import { registerPushDevice } from './api';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export async function registerForPushNotifications() {
  try {
    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('workit-default', {
        name: 'WORKIT',
        importance: Notifications.AndroidImportance.HIGH,
        vibrationPattern: [0, 200, 150, 200],
      });
    }

    const existing = await Notifications.getPermissionsAsync();
    let status = existing.status;
    if (status !== 'granted') {
      const requested = await Notifications.requestPermissionsAsync();
      status = requested.status;
    }
    if (status !== 'granted') return null;

    const projectId =
      Constants.expoConfig?.extra?.eas?.projectId ??
      Constants.easConfig?.projectId ??
      process.env.EXPO_PUBLIC_EAS_PROJECT_ID;
    if (!projectId) return null;

    const token = (await Notifications.getExpoPushTokenAsync({ projectId })).data;
    await registerPushDevice(token, Platform.OS);
    return token;
  } catch {
    return null;
  }
}
