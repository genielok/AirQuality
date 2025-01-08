import { View, Text, StyleSheet, Modal, TouchableWithoutFeedback, Image } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import moment from 'moment'
import * as Location from 'expo-location';
import { fetchLocations, fetchSenorsByLocationID, Sensor } from '@/scripts/api';
import { calculateOverallAQI } from '@/scripts/function';
import AQIDisplay from './AQIDisplay';
import PollutionInfo from './PollutionInfo';
import { AntDesign } from '@expo/vector-icons';
import { captureRef } from 'react-native-view-shot';
import * as MediaLibrary from 'expo-media-library';

const HomePage = () => {
  const [locationText, setLocationText] = useState<string>();
  const [AQI, setAQI] = useState<number>(0);
  const [sensors, setSensors] = useState<Sensor[]>([]);

  const getLocation = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync(); // Request permission
    if (status !== 'granted') {
      alert('Location permission is required to access location.');
      return;
    }

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
      let sensors2: Sensor[] = []

      if (res[1].id) {
        sensors2 = await fetchSenorsByLocationID(res[1].id)
        sensors2 = sensors2.filter(sensor2 => !sensors.some(sensor1 => sensor1.parameter.id === sensor2.parameter.id));
      }
      setSensors([...sensors, ...sensors2]);

      const AQIValue = calculateOverallAQI(sensors)
      setAQI(AQIValue);
    } catch (error) {
      console.log('getAQI', error)
    }

  }

  const [status, requestPermission] = MediaLibrary.usePermissions();
  const [shareModal, setShareModal] = useState(false)
  const imageRef = useRef<View>(null);
  const [imgUri, setImgUri] = useState<string>()
  const handleShare = async () => {
    try {
      const localUri = await captureRef(imageRef, {
        height: 440,
        quality: 1,
      });
      setImgUri(localUri); // 保存图片路径
      setShareModal(true);
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    getLocation()
  }, [])

  const handleDownload = async () => {
    if (!status?.granted) {
      const permissionResponse = await requestPermission();
      if (!permissionResponse.granted) {
        alert('Permission to access media library is required!');
        return;
      }
    }
    if (status?.granted && imgUri) {
      try {
        await MediaLibrary.saveToLibraryAsync(imgUri);
        alert('Image downloaded successfully!');
        setShareModal(false)
      } catch (error) {
        console.log('Error saving image:', error);
        setShareModal(false)
      }
    }
  }

  return (
    <>
      <View ref={imageRef} collapsable={false}>
        <View style={styles.container}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
            <View style={{ flex: 1 }}>
              <Text style={styles.locationText}>
                {locationText}
              </Text>
            </View>
            <TouchableWithoutFeedback onPress={handleShare} >
              <AntDesign style={{ marginRight: 16 }} name="sharealt" size={20} color="black" />
            </TouchableWithoutFeedback>
          </View>
          <View style={styles.date}><Text style={styles.dateText}>{moment().format('dd, DD, MMMM')}</Text></View>
          <AQIDisplay AQI={AQI} />
          <PollutionInfo sensors={sensors} />
        </View>
      </View>
      <View>
        <Modal visible={shareModal} transparent={true} animationType="fade">
          <View style={styles.modalBackground}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Do you want to download this image?</Text>
              {imgUri ? (
                <Image source={{ uri: imgUri }} style={styles.previewImage} />
              ) : (
                <Text>Loading image...</Text>
              )}
              <View style={styles.buttonContainer}>
                <TouchableWithoutFeedback onPress={handleDownload}>
                  <View style={styles.downloadButton}>
                    <AntDesign name="download" size={20} color="#fff" />
                    <Text style={styles.buttonText}>Download</Text>
                  </View>
                </TouchableWithoutFeedback>
                <TouchableWithoutFeedback onPress={() => setShareModal(false)}>
                  <View style={styles.closeButton}>
                    <Text style={styles.buttonText}>Close</Text>
                  </View>
                </TouchableWithoutFeedback>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    </>
  )
}

export default React.memo(HomePage);


const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // 半透明背景
  },
  modalContent: {
    width: '80%',
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    alignItems: 'center', // 内容居中
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  downloadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4CAF50',
    padding: 10,
    borderRadius: 8,
    marginRight: 10,
  },
  closeButton: {
    backgroundColor: '#F44336',
    padding: 10,
    borderRadius: 8,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20, // Space below the title
    textAlign: 'center',
    color: '#333',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    marginLeft: 5,
  },
  previewImage: {
    width: 200, // 图片宽度
    height: 300, // 图片高度
    marginBottom: 20, // 图片下方留白
    borderRadius: 10, // 圆角
  },
  container: {
    paddingHorizontal: 25,
    paddingTop: 20,
    backgroundColor: '#F7F7f7',
    height: '100%'
  },
  locationText: {
    fontSize: 18,
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
