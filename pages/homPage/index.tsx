import { View, Text, StyleSheet } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import moment from 'moment'
import * as Location from 'expo-location';
import { fetchLocations, fetchSenorsByLocationID, Sensor } from '@/scripts/api';
import { calculateOverallAQI } from '@/scripts/function';
import AQIDisplay from './AQIDisplay';
import PollutionInfo from './PollutionInfo';


const HomePage = () => {
  const [locationText, setLocationText] = useState<string>();
  const [AQI, setAQI] = useState<number>(0);
  const [sensors, setSensors] = useState<Sensor[]>([]);

  const getLocation = async () => {
    try {
      const currentLocation = await Location.getCurrentPositionAsync({});

      const [geocode] = await Location.reverseGeocodeAsync({
        latitude: currentLocation.coords.latitude,
        longitude: currentLocation.coords.longitude,
      });

      setLocationText(`${geocode.city}, ${geocode.region},${geocode.country}`)

      await getAQI(currentLocation)
    } catch (error) {
      console.log(error)
    }

  }


  const getAQI = async (location: { coords: { latitude: number; longitude: number } }) => {
    try {
      const params = {
        coordinates: `${location.coords.latitude.toFixed(3)},${location.coords.longitude.toFixed(3)}`,
        radius: 25000,
        limit: 10,
      }
      const res = await fetchLocations(params)
      const sensors = await fetchSenorsByLocationID(res[0].id)
      setSensors(sensors);

      const AQIValue = calculateOverallAQI(sensors)
      setAQI(AQIValue);
    } catch (error) {
      console.log('getAQI', error)
    }

  }

  useEffect(() => {
    getLocation()
  }, [])

  return (
    <View style={styles.container}>
      <View>
        <Text style={styles.locationText}>
          {locationText}
        </Text>
      </View>
      <View style={styles.date}><Text style={styles.dateText}>{moment().format('dd, DD, MMMM')}</Text></View>
      <AQIDisplay AQI={AQI} />
      <PollutionInfo sensors={sensors} />
    </View>
  )
}

export default React.memo(HomePage);


const styles = StyleSheet.create({
  container: {
    marginHorizontal: 25,
    marginTop: 20,
  },
  locationText: {
    fontSize: 22,
    fontWeight: 600,
    color: '#333333'
  },
  date: {
    marginVertical: 8
  },
  dateText: {
    fontSize: 13,
    color: '#A6A6A6'
  },
  aqi: {
    marginTop: 40,
    display: 'flex',
    alignItems: 'center'
  },
  textAQI: {
    color: '#959595',
    textAlign: 'center'
  },
  AQINumber: {
    color: '#333333',
    fontSize: 40,
    textAlign: 'center',
    marginBottom: 8
  }
});
