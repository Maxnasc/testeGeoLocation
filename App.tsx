import { View } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import {
  requestForegroundPermissionsAsync,
  getCurrentPositionAsync,
  LocationObject,
  LocationAccuracy,
  watchPositionAsync
} from 'expo-location';
import { styles } from './Styles';
import { useEffect, useState } from 'react';

export default function App() {
  const [location, setLocation] = useState<LocationObject | null>(null);

  async function requestLocationPermission() {
    const { granted } = await requestForegroundPermissionsAsync();

    if (granted) {
      const currentPosition = await getCurrentPositionAsync();
      setLocation(currentPosition);
    }
  }

  useEffect(() => { requestLocationPermission(); }, []);
  useEffect(() => {
    watchPositionAsync({
      accuracy: LocationAccuracy.Highest, timeInterval: 1000,
      distanceInterval: 1
    }, (response) => {
      //console.log('Nova Localização', response);
      setLocation(response);
      
    })
  }, []);

  return (
    <View style={styles.container}>
      {
        <MapView
          style={styles.map}
          initialRegion={{
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
            latitudeDelta: 0.005,
            longitudeDelta: 0.005
          }}
        >
          <Marker
            coordinate={{
              latitude: location.coords.latitude,
              longitude: location.coords.longitude,
            }}
          />
        </MapView>
      }
    </View>
  );
}

