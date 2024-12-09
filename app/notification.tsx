import { View, StyleSheet } from 'react-native';
import NotificationPage from '@/pages/notificationPage';

export default function Notification() {
  return (
    <View style={styles.container}>
      <NotificationPage />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
