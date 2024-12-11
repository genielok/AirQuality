import { View, StyleSheet } from 'react-native';
import HomePage from '@/pages/homPage';

export default function Index() {
  return (
    <View style={styles.container}>
      <HomePage />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    backgroundColor: '#F7F7f7'
  },
});
