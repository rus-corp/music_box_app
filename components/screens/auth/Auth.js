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
  const [userData, setUserData] = React.useState({
    username: '',
    password: ''
  })
  const { height, width } = Dimensions.get('window')
  
  const handleChangeEmail = (text) => {
    setUserData({...userData, username: text})
  }

  const handleChangePassword = (text) => {
    setUserData({...userData, password: text})
  }

  const handleSubmit = () => {
    console.log(userData)
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
                    <TextInput keyboardType='email-address' style={styles.inputField} onChangeText={handleChangeEmail}></TextInput>
                  </View>
                  <Text style={styles.inputLabel}>Password</Text>
                  <View style={styles.inputWrapper}>
                    <TextInput style={styles.inputField} onChangeText={handleChangePassword}></TextInput>
                  </View>
                  <View style={styles.btnWrapper}>
                    <AuthButton handleLogin={handleSubmit}/>
                  </View>
                </View>
              </View>
            </ScrollView>
          </LinearGradient>
      </View>
    </KeyboardAvoidingView>
  );
}