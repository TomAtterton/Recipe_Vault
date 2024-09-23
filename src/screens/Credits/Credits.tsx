import React from 'react';
import { Linking, ScrollView } from 'react-native';
import { createStyleSheet, useStyles } from 'react-native-unistyles';
import Typography from '@/components/Typography';
import { translate } from '@/core';
import SettingsContainer from '@/components/SettingsContainer';

const creditsData = [
  {
    description: translate('credits.mingcute'),
    name: 'Mingcute',
    url: 'https://www.mingcute.com',
  },
  {
    description: translate('credits.freepik'),
    name: 'Freepik',
    url: 'https://www.freepik.com',
  },
  {
    description: translate('credits.special_thanks'),
    name: '',
    url: '',
  },
];

const Credits = () => {
  const { styles } = useStyles(stylesheet);

  return (
    <SettingsContainer title={translate('credits.title')}>
      <ScrollView style={styles.contentContainer}>
        {creditsData.map((credit, index) => (
          <Typography key={index} variant={'bodyMediumItalic'} style={styles.creditText}>
            {`${credit.description} `}
            {credit.name && (
              <>
                <Typography
                  style={styles.link}
                  onPress={() => credit.url && Linking.openURL(credit.url)}
                >
                  {credit.name}
                </Typography>
              </>
            )}
          </Typography>
        ))}
      </ScrollView>
    </SettingsContainer>
  );
};

const stylesheet = createStyleSheet((theme) => ({
  contentContainer: {
    flex: 1,
    paddingTop: 20,
  },
  title: {
    marginBottom: 20,
  },
  creditText: {
    marginBottom: 10,
  },
  link: {
    color: theme.colors.primary,
    textDecorationLine: 'underline',
  },
}));

export default Credits;
