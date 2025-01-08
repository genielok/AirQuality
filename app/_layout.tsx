import { Ionicons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';

import HomeScreen from './index';
import Map from './heatMap';
import Detail from './detail'; // 新页面

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();


const Tabs = () => (
  <Tab.Navigator>
    <Tab.Screen
      name="index"
      component={HomeScreen} options={{
        title: 'Home', tabBarIcon: ({ color, focused }) => (
          <Ionicons name={focused ? 'home-sharp' : 'home-outline'} color={color} size={24} />
        )
      }}
    />
    <Tab.Screen
      name="heatMap"
      component={Map}
      options={{
        title: 'Explore Data', tabBarIcon: ({ color, focused }) => (
          <Ionicons name={focused ? 'map-sharp' : 'map-outline'} color={color} size={24} />
        )
      }}
    />
  </Tab.Navigator>
);
export default function TabLayout() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Tabs" component={Tabs} />
      {/* @ts-ignore */}
      <Stack.Screen name="detail" component={Detail} />
    </Stack.Navigator>
  )
}
