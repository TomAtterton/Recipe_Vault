import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const supportAppAmount = [
  {
    name: 'Buy me a coffee',
    amount: 0.99,
  },
  {
    name: 'Buy me a novel',
    amount: 2.99,
  },
  {
    name: 'Buy me a gourmet pizza',
    amount: 4.99,
  },
  {
    name: 'Contribute to my new laptop fund',
    amount: 9.99,
  },
].sort((a, b) => a.amount - b.amount);

const SupportApp = () => {
  const [selectedOption, setSelectedOption] = useState<{ name: string; amount: number } | null>(
    null
  );

  const handlePress = (option: { name: string; amount: number }) => {
    setSelectedOption(option);
  };

  return (
    <View style={styles.container}>
      {selectedOption ? (
        <Text style={styles.thankYouText}>Thank you for your support!</Text>
      ) : (
        supportAppAmount.map((option, index) => (
          <TouchableOpacity key={index} style={styles.button} onPress={() => handlePress(option)}>
            <Text style={styles.buttonText}>
              {option.name} - ${option.amount}
            </Text>
          </TouchableOpacity>
        ))
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    backgroundColor: '#4B0082',
    padding: 10,
    margin: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
  thankYouText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4B0082',
  },
});

export default SupportApp;
