import 'react-native-gesture-handler';

import React, { useEffect, useState } from 'react';
import { StatusBar } from 'react-native';

import { NavigationContainer } from '@react-navigation/native';
import FlashMessage from 'react-native-flash-message';
import SplashScreen from 'react-native-splash-screen';
import { ThemeProvider } from 'styled-components';

import light from './styles/themes/light';

import { PositionProvider } from './hooks/getPosition';
import Routes from './routes';

const App: React.FC = () => {
  const [theme] = useState(light);

  useEffect(() => {
    SplashScreen.hide();
  }, []);

  return (
    <NavigationContainer>
      <PositionProvider>
        <ThemeProvider theme={theme}>
          <StatusBar hidden />
          <Routes />
          <FlashMessage position="top" />
        </ThemeProvider>
      </PositionProvider>
    </NavigationContainer>
  );
};

export default App;
