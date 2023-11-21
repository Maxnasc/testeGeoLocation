import { View } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import {
  requestForegroundPermissionsAsync,
  requestBackgroundPermissionsAsync,
  getCurrentPositionAsync,
  LocationObject,
  LocationAccuracy,
  watchPositionAsync
} from 'expo-location';
import { styles } from './Styles';
import { useEffect, useState, useRef } from 'react';

export default function App() {
  const [location, setLocation] = useState<LocationObject | null>(null);
  const mapRef = useRef<MapView>(null);

  async function requestLocationPermission() {
    const { granted } = await requestForegroundPermissionsAsync();

    if (granted) {
      const currentPosition = await getCurrentPositionAsync();
      setLocation(currentPosition);
    } else {
      console.log('Permissão de localização em primeiro plano negada');
    }

    const { granted: backgroundGranted } = await requestBackgroundPermissionsAsync();

    if (!backgroundGranted) {
      console.log('Permissão de localização em segundo plano negada');
    }
  }

  useEffect(() => {
    requestLocationPermission();
  }, []);

  useEffect(() => {
    watchPositionAsync(
      {
        accuracy: LocationAccuracy.Highest,
        timeInterval: 1000,
        distanceInterval: 1
      },
      (response) => {
        setLocation(response);
        console.log('Localização atualizada: ' + response.coords.latitude + ' | ' + response.coords.longitude);
        mapRef.current?.animateCamera({ center: response.coords });
      }
    );
  }, []);

  return (
    <View style={styles.container}>
      {location && ( // Renderiza condicionalmente apenas quando location não é null
        <MapView
          ref={mapRef}
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
              longitude: location.coords.longitude
            }}
          />
        </MapView>
      )}
    </View>
  );
}
