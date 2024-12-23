import { View,
  Text,
  TextInput,
  Image,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';

import { styles } from './styles'
import { AuthButton } from '../../ui/button/AuthButton';



export default function Auth() {
  const [email, setEmail] = React.useState('')
  const [password, setPassword] = React.useState('')
  const { height, width } = Dimensions.get('window')
  
  const handleChangeEmail = (text) => {
    setEmail(text)
  }

  const handleChangePassword = (text) => {

  }


  return(
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <View style={styles.container}>
          <LinearGradient style={styles.authContainer} colors={['rgba(115, 148, 243, 1)', 'rgba(228, 87, 184, 1)']}>
            <ScrollView contentContainerStyle={{
              minHeight: height,
              minWidth: width,
              justifyContent: 'center',
              alignItems: 'center'
            }}>
              <View style={styles.authContent}>
                <View style={styles.imageContent}>
                  <Image source={require('../../../assets/main/Group.png')}/>
                </View>
                <View style={styles.formData}>
                  <Text style={styles.inputLabel}>Email</Text>
                  <View style={styles.inputWrapper}>
                    <TextInput keyboardType='email-address' style={styles.inputField}></TextInput>
                  </View>
                  <Text style={styles.inputLabel}>Password</Text>
                  <View style={styles.inputWrapper}>
                    <TextInput style={styles.inputField}></TextInput>
                  </View>
                  <AuthButton />
                </View>
              </View>
            </ScrollView>
          </LinearGradient>
      </View>
    </KeyboardAvoidingView>
  );
}