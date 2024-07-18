import React from 'react';
import { View, SafeAreaView } from 'react-native';
import Typography from '@/components/Typography';
import { createStyleSheet, useStyles } from 'react-native-unistyles';
import PrimaryButton from '@/components/buttons/PrimaryButton';
import Icon from '@/components/Icon';
import { useNavigation } from '@react-navigation/native';
import LabelButton from '@/components/buttons/LabelButton';
import { handleProPlanPurchase } from '@/services/purchase';
import { Routes } from '@/navigation/Routes';

const PurchaseScreen = () => {
  const { navigate, goBack } = useNavigation();

  const handlePurchase = async () => {
    const onContactCustomerSupport = () => {
      goBack();
      navigate(Routes.Help);
    };
    await handleProPlanPurchase(onContactCustomerSupport);
  };

  const { styles, theme } = useStyles(stylesheet);
  return (
    <SafeAreaView style={styles.container}>
      <Icon
        style={{
          alignSelf: 'center',
        }}
        name={'cloud'}
        size={80}
        color={theme.colors.onBackground}
      />
      <Typography variant={'displaySmall'} style={styles.title}>
        Cloud Vault Pro
      </Typography>
      <Typography variant={'bodyMedium'} style={styles.subTitle}>
        Upgrade your cloud vault to pro with a one time purchase to unlock the following features:
      </Typography>
      <View style={styles.contentContainer}>
        <View style={styles.itemContainer}>
          <Icon name={'cloud'} size={32} color={theme.colors.onBackground} />
          <Typography variant={'bodyMediumItalic'} style={styles.itemText}>
            Add unlimited recipes and sync them to the cloud.
          </Typography>
        </View>
        <View style={styles.itemContainer}>
          <Icon name={'people'} size={32} color={theme.colors.onBackground} />
          <Typography variant={'bodyMediumItalic'} style={styles.itemText}>
            Share your pro vault with up to 3 friends and family.
          </Typography>
        </View>
        <View style={styles.itemContainer}>
          <Icon name={'ufo-flying'} size={32} color={theme.colors.onBackground} />
          <Typography variant={'bodyMediumItalic'} style={styles.itemText}>
            Help support the development of Recipe Vault.
          </Typography>
        </View>
      </View>
      <View style={styles.footerContainer}>
        <PrimaryButton title={'Upgrade to Pro'} onPress={handlePurchase} />
        <LabelButton title={'Continue with free version'} onPress={goBack} />
      </View>
    </SafeAreaView>
  );
};

const stylesheet = createStyleSheet((theme) => ({
  container: {
    flex: 1,
    marginHorizontal: 20,
  },
  title: {
    marginBottom: 16,
    textAlign: 'center',
  },
  subTitle: {
    color: theme.colors.primary,
    marginBottom: 8,
  },
  contentContainer: {
    flex: 1,
    gap: 16,
    paddingTop: 20,
  },
  itemContainer: {
    flexDirection: 'row',
    gap: 16,
  },
  itemText: {
    flex: 1,
  },
  footerContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingBottom: 20,
  },
  footerText: {
    marginBottom: 16,
    color: theme.colors.primary,
  },
}));

export default PurchaseScreen;
