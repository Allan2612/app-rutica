import { memo } from 'react';
import { Image } from 'expo-image';
import { styles } from './styles';

export const AuthLogo = memo(function AuthLogo() {
  return (
    <Image
      source={require('../../../../assets/logo.png')}
      style={styles.logo}
      contentFit="contain"
      transition={200}
      cachePolicy="memory-disk"
    />
  );
});
