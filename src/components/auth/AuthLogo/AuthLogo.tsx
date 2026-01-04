import { memo } from 'react';
import { Image } from 'react-native';
import { styles } from './styles';

export const AuthLogo = memo(function AuthLogo() {
  return (
    <Image
      source={require('../..//../../assets/logo.png')}
      style={styles.logo}
      resizeMode="contain"
    />
  );
});
