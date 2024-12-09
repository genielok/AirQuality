import { View, StyleSheet } from 'react-native';
import HeatMapPage from '@/pages/heatMapPage';

export default function HeatMap() {
  return (
    <View style={styles.container}>
      <HeatMapPage />
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
