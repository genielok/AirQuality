import { View, Text, StyleSheet } from 'react-native'
import React, { useEffect, useState } from 'react'
import { AnimatedCircularProgress } from 'react-native-circular-progress'
import moment from 'moment'
import * as Location from 'expo-location';
import { fetchCountries } from '@/scripts/api';

const HomePage = () => {
  const [geocode, setGeocoden] = useState<Location.LocationGeocodedAddress>();
  const [errorMsg, setErrorMsg] = useState<string>();
  const [locationText, setLocationText] = useState<string>();

  const getLocation = async () => {
    try {

      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }
      // 获取当前位置
      const currentLocation = await Location.getCurrentPositionAsync({});

      // 反向地理编码获取国家和地区
      const [geocode] = await Location.reverseGeocodeAsync({
        latitude: currentLocation.coords.latitude,
        longitude: currentLocation.coords.longitude,
      });

      setGeocoden(geocode);
      setLocationText(`${geocode.city}, ${geocode.region},${geocode.country}`)

    } catch (error) {
      console.log(error)
    }

  }

  const getAQI = async () => {
    try {
      const data = await fetchCountries()
      console.log('getAQI', data[0])
    } catch (error) {
      console.log('getAQI', error)
    }
  }




  useEffect(() => {
    getLocation()
    getAQI()
  }, [])

  return (
    <View style={styles.container}>
      <View>
        <Text>
          {locationText}
        </Text>
      </View>
      <View>{moment().format('dd, DD, MMMM')}</View>
      <View>
        <AnimatedCircularProgress
          size={230}
          width={15}
          fill={80}
          tintColor="#00e0ff"
          onAnimationComplete={() => console.log('onAnimationComplete')}
          backgroundColor="#3d5875"
          arcSweepAngle={250}
          rotation={235}
          lineCap='round'
        >{
            (fill) => (
              <View>
                <Text>{'AQI'}</Text>
                <Text>{80}</Text>
              </View>
            )
          }</AnimatedCircularProgress>
      </View>
    </View>
  )
}

export default HomePage

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    // alignItems: 'center',
    // justifyContent: 'center',
  },
});
