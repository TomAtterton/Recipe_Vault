import { SafeAreaView, View } from 'react-native';
import { useStyles } from 'react-native-unistyles';
import * as React from 'react';
import NavBarButton from '@/components/buttons/NavBarButton';
import { useNavigation } from '@react-navigation/native';
import { stylesheet } from './settingsContainer.style';
import Typography from '@/components/Typography';

interface Props {
  title: string;
  children: React.ReactNode;
}

const SettingsContainer = ({ title, children }: Props) => {
  const { styles } = useStyles(stylesheet);
  const { goBack } = useNavigation();

  return (
    <SafeAreaView style={styles.container}>
      <NavBarButton style={styles.backButton} iconSource={'arrow-left'} onPress={goBack} />
      <View style={styles.contentContainer}>
        <Typography variant={'titleItalicLarge'}>{title}</Typography>
        {children}
      </View>
    </SafeAreaView>
  );
};

export default SettingsContainer;
