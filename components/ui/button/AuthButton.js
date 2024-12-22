import React from 'react';
import { View, Pressable, Text, StyleSheet } from 'react-native';




export function AuthButton() {
  const [press, setPress] = React.useState(false)

  return(
    <Pressable
    onPressIn={() => setPress(true)}
    onPressOut={() => setPress(false)}
    style={({ pressed }) => [
      styles.btn,
      pressed || press ? styles.btnPressed : null 
    ]}
    >
        <Text style={styles.btnText}>Войти</Text>
    </Pressable>
  );
}




const styles = StyleSheet.create({
  btn: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 150,
    padding: '2%',
    backgroundColor: 'rgba(255, 255, 255, 1)',
    borderRadius: 24
  },
  btnText: {
    color: 'rgba(90, 97, 108, 1)'
  },
  btnPressed: {
    transform: [{ scale: 0.95 }]
  },
})