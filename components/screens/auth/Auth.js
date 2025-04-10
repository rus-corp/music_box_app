import { View,
  Text,
  TextInput,
  Image,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Dimensions } from 'react-native';



import querystring from 'querystring'
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';

import { styles } from './styles'
import { AuthButton } from '../../ui/button/AuthButton';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AppContext } from '../../../hooks/AppContext';
import { appLogToFile } from '../../shared/helpers';
import { authPost } from '../../../api';



export default function Auth() {
  const { user } = React.useContext(AppContext)
  const [responseData, setResponseData] = React.useState('')
  const [userData, setUserData] = React.useState({
    username: '',
    password: ''
  })
  const { height, width } = Dimensions.get('window')
  const navigation = useNavigation()
  const { setUser } = React.useContext(AppContext)
  
  const handleChangeEmail = (text) => {
    setUserData({...userData, username: text})
  }

  const handleChangePassword = (text) => {
    setUserData({...userData, password: text})
  }

  const storeData = async(item, value) => {
    try {
      await AsyncStorage.setItem(item, value)
    } catch (error) {
      console.log(error)
    }
  }

  const handleSubmit = async() => {
    const log = await appLogToFile(`user login : ${userData.username}/${userData.password}`)
    const params = querystring.stringify(userData)
    const response = await authPost(params)
    if (response.status === 201 && response.data.access_token) {
      const log = await appLogToFile(`this user login resStatus`)
      await storeData('access_token', response.data.access_token)
      await storeData('refresh_token', response.data.refresh_token)
      setUser(response.data.access_token)
      navigate.navigate('PlayList')
    } else {
      setResponseData(response.data.detail)
    }
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
                  <Image style={styles.image} source={require('../../../assets/main/Group.png')}/>
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
                  <View style={styles.error}>
                    {responseData.length > 0 && <Text style={styles.errorText}>{responseData}</Text>}
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