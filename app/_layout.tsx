import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';

export default function TabLayout() {
  return (
    <Tabs>
      <Tabs.Screen name="index" options={{
        title: 'Home', tabBarIcon: ({ color, focused }) => (
          <Ionicons name={focused ? 'home-sharp' : 'home-outline'} color={color} size={24} />
        )
      }} />
      <Tabs.Screen name="heatMap" options={{
        title: 'HeatMap', tabBarIcon: ({ color, focused }) => (
          <Ionicons name={focused ? 'map-sharp' : 'map-outline'} color={color} size={24} />
        )
      }} />
    </Tabs>
  );
}
