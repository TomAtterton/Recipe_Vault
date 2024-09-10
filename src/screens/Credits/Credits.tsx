import React from 'react';
import { Linking, ScrollView, View } from 'react-native';
import { createStyleSheet, useStyles } from 'react-native-unistyles';
import Typography from '@/components/Typography';
import BackButton from '@/components/BackButton';

const creditsData = [
  {
    description: 'Icons provided by',
    name: 'Mingcute',
    url: 'https://www.mingcute.com',
  },
  {
    description: 'Assets provided by',
    name: 'Freepik',
    url: 'https://www.freepik.com',
  },
  {
    description:
      'Special thanks to all contributors and open-source projects that made this app possible.',
    name: '',
    url: '',
  },
];

const Credits = () => {
  const { styles } = useStyles(stylesheet);

  return (
    <View style={styles.container}>
      <ScrollView style={styles.contentContainer}>
        <Typography variant={'titleItalicLarge'} style={styles.title}>
          Credits.
        </Typography>
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
      <BackButton />
    </View>
  );
};

const stylesheet = createStyleSheet((theme, miniRuntime) => ({
  container: {
    flex: 1,
    paddingTop: miniRuntime.insets.top + 60,
  },
  contentContainer: {
    flex: 1,
    paddingTop: 20,
    paddingHorizontal: 20,
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
