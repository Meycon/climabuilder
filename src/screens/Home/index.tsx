/* eslint-disable no-nested-ternary */
import React, { useState, useEffect, useMemo } from 'react';
import { Animated, Linking } from 'react-native';

import { useNavigation } from '@react-navigation/native';
import LottieView from 'lottie-react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';

import { Day, Night } from '~/assets/images';
import { ContainerScroll } from '~/components';
import { usePosition } from '~/hooks/getPosition';
import { convertStates } from '~/utils/convertStates';
import { formatDate } from '~/utils/format';
import weatherDescription from '~/utils/getWeatherDescription';
import weatherIcon from '~/utils/getWeatherIcon';

import {
  Container,
  LocationContainer,
  LocationDateConteiner,
  City,
  UpdateWeather,
  CurrentDate,
  WeatherContainer,
  WeatherWrapper,
  WeatherTemp,
  WeatherDescription,
  TempFeelsLike,
  WeatherDetailsCard,
  WeatherDetailsTitle,
  WeatherDetailsDescription,
  WeatherDetailsHolder,
} from './styles';

import Today from './Today';

const Home: React.FC = () => {
  const { address, weatherData, hasLocationPermission } = usePosition();
  const [opacity] = useState(new Animated.Value(0));
  const [currentHour] = useState(new Date().getHours());

  const currentDetails = useMemo(
    () => [
      {
        id: 1,
        question: 'Vento',
        answer: `${(weatherData?.current?.wind_speed * (60 * 60)) / 1000} km/h`,
      },
      {
        id: 2,
        question: 'Umidade',
        answer: `${weatherData?.current?.humidity}%`,
      },
      {
        id: 3,
        question: 'Visibilidade',
        answer: `${weatherData?.current?.visibility / 1000} km`,
      },
    ],
    [weatherData],
  );

  const weatherDetailsMemo = useMemo(
    () =>
      currentDetails.map(item => (
        <WeatherDetailsHolder key={item.id}>
          <WeatherDetailsTitle>{item.question}</WeatherDetailsTitle>

          <WeatherDetailsDescription>{item.answer}</WeatherDetailsDescription>
        </WeatherDetailsHolder>
      )),
    [currentDetails],
  );

  useEffect(() => {
    Animated.timing(opacity, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, [opacity, address]);

  return (
    <Animated.View
      style={{
        flex: 1,
        opacity,
      }}
    >
      <Container>
        <ContainerScroll>
          <LocationContainer>
            <LocationDateConteiner>
              <City>
                {address?.address?.city ?? 'São Paulo'},{' '}
                {convertStates(address?.address?.state) ?? 'SP'} -{' '}
                {formatDate(weatherData?.current?.dt)}
              </City>
            </LocationDateConteiner>

            <UpdateWeather onPress={() => hasLocationPermission()}>
              <AntDesign name="sync" size={25} color="black" />
            </UpdateWeather>
          </LocationContainer>

          <WeatherContainer source={Night}>
            <WeatherWrapper>
              <LottieView
                style={{ height: 100 }}
                source={weatherIcon[weatherData?.current?.weather[0].main]}
                autoPlay
                loop
              />

              <WeatherDescription>
                {weatherDescription[weatherData?.current?.weather[0].main]}
              </WeatherDescription>

              <CurrentDate>
                {currentHour < 12
                  ? 'Manhã'
                  : currentHour < 18
                  ? 'Tarde'
                  : 'Noite'}
              </CurrentDate>
            </WeatherWrapper>

            <WeatherWrapper>
              <WeatherTemp>{weatherData.current.temp.toFixed(0)}°</WeatherTemp>

              <TempFeelsLike>
                Sensação de {weatherData.current.feels_like.toFixed(0)}°
              </TempFeelsLike>
            </WeatherWrapper>
          </WeatherContainer>

          <WeatherDetailsCard>{weatherDetailsMemo}</WeatherDetailsCard>

          <Today data={weatherData.hourly} />
        </ContainerScroll>
      </Container>
    </Animated.View>
  );
};

export default Home;
