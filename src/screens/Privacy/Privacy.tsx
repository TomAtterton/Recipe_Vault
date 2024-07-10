import { ScrollView, View } from 'react-native';
import * as React from 'react';
import NavBarButton from '@/components/buttons/NavBarButton';
import { useNavigation } from '@react-navigation/native';
import { useStyles } from 'react-native-unistyles';
import { stylesheet } from './privacy.style';
import Markdown from 'react-native-markdown-display';
import { useEffect, useState } from 'react';

const Privacy = () => {
  const { goBack } = useNavigation();
  const {
    styles,
    theme: { colors },
  } = useStyles(stylesheet);

  const [data, setData] = useState<string | null>(null);

  useEffect(() => {
    fetch(
      'https://gist.githubusercontent.com/TomAtterton/04e81636357761d62d0ad328b94dc046/raw/7830bbead7548b374416f6514c3451fd9f4891fe/recipe-vault-privacy-policy.md'
    )
      .then((response) => {
        return response.text();
      })
      .then((text) => {
        setData(text);
      });
  }, []);

  return (
    <View style={styles.container}>
      <NavBarButton style={styles.backButton} iconSource={'arrow-left'} onPress={goBack} />
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {!!data && (
          <Markdown
            style={{
              heading2: {
                fontFamily: 'DMMono-MediumItalic',
                fontSize: 22,
                lineHeight: 28,
                letterSpacing: 0,
                color: colors.onBackground,
                paddingBottom: 20,
              },

              link: {
                color: colors.primary,
              },
              body: {
                color: colors.onBackground,
                fontFamily: 'DMMono-MediumItalic',
                fontSize: 12,
                lineHeight: 16,
                letterSpacing: 0,
              },
            }}
          >
            {data ?? ''}
          </Markdown>
        )}
      </ScrollView>
    </View>
  );
};

export default Privacy;
