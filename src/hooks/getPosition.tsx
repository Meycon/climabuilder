import React, {
  createContext,
  useState,
  useContext,
  useCallback,
  useEffect,
} from 'react';
import { Platform, Linking } from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { showMessage } from 'react-native-flash-message';
import Geolocation, { PositionError } from 'react-native-geolocation-service';
import { check, PERMISSIONS, RESULTS, request } from 'react-native-permissions';

import { Weather, Address } from '~/models';
import { getCity } from '~/services/getCity';
import { getWeather } from '~/services/getWeather';

const isAndroid = Platform.OS === 'android';

interface PositionContextData {
  loading: boolean;
  hasPosition: boolean;
  address: Address;
  weatherData: Weather;
  hasLocationPermission(): Promise<void>;
}
interface PositionProps {
  latitude: number;
  longitude: number;
}

const PositionContext = createContext<PositionContextData>(
  {} as PositionContextData,
);

export const PositionProvider: React.FC = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [address, setAddress] = useState<Address>({} as Address);
  const [hasPosition, setHasPosition] = useState(false);
  const [locationDenied, setLocationDenied] = useState(false);
  const [currentLocation, setCurrentLocation] = useState<PositionProps>(
    {} as PositionProps,
  );

  const [weatherData, setWeatherData] = useState<Weather>({} as Weather);

  const getCurrentPosition = async () => {
    setLoading(true);
    Geolocation.getCurrentPosition(
      async location => {
        setCurrentLocation({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        });

        if (location !== null) {
          setLocationDenied(false);

          const pos = {
            lat: location.coords.latitude,
            lng: location.coords.longitude,
          };

          const newWeatherData = await getWeather(pos.lat, pos.lng);
          if (newWeatherData) setWeatherData(newWeatherData);

          const userAddress = await getCity(pos.lat, pos.lng);
          if (userAddress) setAddress(userAddress);

          await AsyncStorage.multiSet([
            ['@ClimaBuilder: latitude', pos.lat.toString()],
            ['@ClimaBuilder: longitude', pos.lng.toString()],
            ['@ClimaBuilder: address', JSON.stringify(userAddress)],
          ]);
        }

        setLoading(false);
      },
      error => {
        if (error.code === PositionError.PERMISSION_DENIED) {
          setLocationDenied(true);
          showMessage({
            message: 'Ops!',
            description:
              'Verifique se seu dispositivo está com o serviço de localização ativo e se sua conexão com a internet está funcionando.',
            onPress: () => Linking.openSettings(),
          });
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 1000,
        forceRequestLocation: true,
        showLocationDialog: true,
      },
    );
  };

  const hasLocationPermission = useCallback(async () => {
    if (isAndroid && Platform.Version < 23) {
      getCurrentPosition();
      return;
    }

    const permissionExists = await check(
      isAndroid
        ? PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION
        : PERMISSIONS.IOS.LOCATION_WHEN_IN_USE,
    );

    if (permissionExists === RESULTS.GRANTED) {
      getCurrentPosition();
      return;
    }

    const status = await request(
      isAndroid
        ? PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION
        : PERMISSIONS.IOS.LOCATION_WHEN_IN_USE,
    );

    if (status === RESULTS.GRANTED) {
      getCurrentPosition();
      return;
    }
    showMessage({
      message: 'Ops!',
      description:
        'Verifique se seu dispositivo está com o serviço de localização ativo e se sua conexão com a internet está funcionando.',
      onPress: () => Linking.openSettings(),
    });

    const newWeatherData = await getWeather(-23.5563697, -46.6653668);

    const [storagedLat, storagedLng, storagedAddress] =
      await AsyncStorage.multiGet([
        '@ClimaBuilder: latitude',
        '@ClimaBuilder: longitude',
        '@ClimaBuilder: address',
      ]);

    if (storagedLat[1] && storagedLng[1] && storagedAddress[1]) {
      const weatherDataWithStoragedLatLng = await getWeather(
        Number(storagedLat[1]),
        Number(storagedLng[1]),
      );

      setWeatherData(weatherDataWithStoragedLatLng);
      setAddress(JSON.parse(storagedAddress[1]));
      setHasPosition(true);
      setLoading(false);

      return;
    }

    setWeatherData(newWeatherData);
    setHasPosition(false);
    setLoading(false);
  }, []);

  useEffect(() => {
    hasLocationPermission();
  }, [hasLocationPermission]);

  return (
    <PositionContext.Provider
      value={{
        loading,
        hasPosition,
        weatherData,
        address,
        hasLocationPermission,
      }}
    >
      {children}
    </PositionContext.Provider>
  );
};

export function usePosition(): PositionContextData {
  const context = useContext(PositionContext);

  return context;
}
