import React, { useEffect, useState } from 'react';
import { View, TouchableOpacity } from 'react-native';
import { fetchProducts } from '@/utils/purchaseUtils';
import { createStyleSheet, useStyles } from 'react-native-unistyles';
import Typography from '@/components/Typography';
import { Image } from 'expo-image';

const supportAppAmount = [
  {
    name: '☕ Fuel my caffeine addiction',
    amount: 0.99,
  },
  {
    name: "📚 Help me buy a book I'll never finish",
    amount: 1.99,
  },
  {
    name: '🍕 Treat me to a slice of fancy pizza',
    amount: 3.99,
  },
  {
    name: '💻 Chip in for my dream laptop',
    amount: 9.99,
  },
];

const SupportApp = () => {
  const [selectedOption, setSelectedOption] = useState<{ name: string; amount: number } | null>(
    null
  );

  const { styles } = useStyles(stylesheet);

  useEffect(() => {
    fetchProducts();
  }, []);
  const handlePress = (option: { name: string; amount: number }) => {
    setSelectedOption(option);
  };

  return (
    <View style={styles.container}>
      {selectedOption ? (
        <View>
          <Typography variant={'titleLarge'} style={styles.thankYouText}>
            Thank you for your support!
          </Typography>
          <Image style={styles.thankYouGif} source={require('../../../assets/gif/thankyou.gif')} />
        </View>
      ) : (
        supportAppAmount.map((option, index) => (
          <TouchableOpacity key={index} style={styles.button} onPress={() => handlePress(option)}>
            <Typography
              variant={'bodyMediumItalic'}
              style={{
                flex: 1,
              }}
            >
              {option.name}
            </Typography>
            <Typography variant={'bodyLarge'}>€{option.amount}</Typography>
          </TouchableOpacity>
        ))
      )}
    </View>
  );
};

const stylesheet = createStyleSheet(() => ({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    gap: 8,
    justifyContent: 'center',
  },

  button: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    paddingHorizontal: 8,
    borderRadius: 10,
  },
  thankYouText: {
    textAlign: 'center',
  },
  thankYouGif: {
    width: 200,
    height: 200,
    alignSelf: 'center',
    marginTop: 10,
    borderRadius: 10,
  },
}));

export default SupportApp;
