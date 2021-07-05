import React from 'react';
import { View } from 'react-native';

import LottieView from 'lottie-react-native';

import { GpsLoading } from '~/assets/animations';
import { usePosition } from '~/hooks/getPosition';

import AppRoutes from './app.routes';

const Routes: React.FC = () => {
  const { loading } = usePosition();

  if (loading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: '#FFFFFF',
        }}
      >
        <LottieView
          source={GpsLoading}
          style={{ width: '40%' }}
          autoPlay
          loop
        />
      </View>
    );
  }

  return <AppRoutes />;
};

export default Routes;
