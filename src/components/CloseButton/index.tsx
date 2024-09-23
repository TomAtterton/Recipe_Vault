import NavBarButton from '@/components/buttons/NavBarButton';
import { useNavigation } from '@react-navigation/native';
import { NavBarProps } from '@/components/buttons/NavBarButton/NavBarButton';
import { createStyleSheet, useStyles } from 'react-native-unistyles';

interface Props extends Omit<NavBarProps, 'iconSource'> {
  onBack?: () => void;
}

const CloseButton = ({ onBack, ...props }: Props) => {
  const { goBack } = useNavigation();
  const handleOnBack = () => {
    if (onBack) {
      onBack();
    } else {
      goBack();
    }
  };

  const { styles } = useStyles(stylesheet);

  return (
    <NavBarButton style={styles.container} {...props} onPress={handleOnBack} iconSource={'close'} />
  );
};

const stylesheet = createStyleSheet((theme, miniRuntime) => ({
  container: {
    position: 'absolute',
    top: miniRuntime.insets.top,
    right: 0,
  },
}));

export default CloseButton;
