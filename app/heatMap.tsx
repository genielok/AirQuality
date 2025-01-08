import { Country, fetchLocations } from '@/scripts/api';
import { useEffect, useState } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import MapView, { Callout, Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import { router } from 'expo-router';
import { daysAgo } from '@/scripts/function';


export default function HeatMap() {
  const [geoArr, setGeoArr] = useState<Country[]>([])
  const [curGeo, setCurGeo] = useState<{
    coordinates: {
      latitude: number,
      longitude: number
    }
  }>()
  const getLocations = async () => {
    try {
      const location = await Location.getCurrentPositionAsync({});
      const res = await fetchLocations({ limit: 100, coordinates: `${location.coords.latitude.toFixed(3)},${location.coords.longitude.toFixed(3)}`, radius: 25000 })

      const geoArr = res.filter(item => daysAgo(item.datetimeLast.utc) <= 1)
      setCurGeo({ coordinates: location.coords, })
      setGeoArr(geoArr)
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    getLocations()
  }, [])

  const toDetail = (detail: Country) => {
    const value: string = JSON.stringify(detail)
    router.push({ pathname: '/detail', params: { detailInfo: value } })
  }

  return (
    <View style={styles.container}>
      {
        curGeo && <MapView
          style={styles.map}
          initialRegion={{
            ...curGeo.coordinates,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
        >
          {
            geoArr.map((item, index) => <Marker
              key={index}
              coordinate={item.coordinates}
              title={item.name}
              id={String(item.id)}

            >
              <Callout tooltip={true} key={index} onPress={() => toDetail(item)}>
                <View style={styles.callout}>
                  <Text>{item.name}</Text>
                  <View style={styles.gotoDetailBtn}>
                    <Text style={styles.gotoDetailText}>Show details</Text>
                  </View>
                </View>
              </Callout>
            </Marker>)
          }

        </MapView>
      }

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  map: {
    width: '100%',
    height: '100%',
  },
  callout: {
    width: 200,
    padding: 10,
    borderRadius: 30,
    flexDirection: 'column',
    alignItems: 'center',
    borderWidth: 5,
    backgroundColor: '#fff',
    borderColor: '#e6f8f8'
  },
  gotoDetailBtn: {
    backgroundColor: '#33a3a1',
    paddingVertical: 6,
    paddingHorizontal: 10,
    marginTop: 4,
    borderRadius: 100
  },
  gotoDetailText: {
    color: '#fff',
    fontWeight: 600,
    fontSize: 12
  }
});
