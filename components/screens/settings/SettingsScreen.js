import React from 'react';
import { View, Text, Button } from 'react-native';
import { styles } from './styles'
import Header from '../../ui/header/Header';
import { LinearGradient } from 'expo-linear-gradient';
import { sendTrackLogs, sendAppLogs, appLogFileUri, trackLogFileUri } from '../../../api';
import { clearApp, removeLogFile } from '../../shared/helpers';
import { readLogs } from '../../shared/helpers/track_logs';
import * as FileSystem from 'expo-file-system';



export default function SettingsScreen() {
  const handleSendLogs = async () => {
    const handleAppLogs = await sendAppLogs()
    console.log('handleAppLogs RESPONSE', handleAppLogs)
    if (handleAppLogs.status === 201) {
      await removeLogFile(appLogFileUri)
    } else {
      console.log('ошибка отправки логов')
    }
    const handleTrackLogs = await sendTrackLogs()
    console.log('handleTrackLogs RESPONSE', handleTrackLogs)
    if (handleTrackLogs.status === 201) {
      await removeLogFile(trackLogFileUri)
    } else {
      console.log('ошибка отправки логов')
    }
  }
  const handleClearApp = async() => {
    await clearApp()
    console.log('очистить приложение')
  }
  const handleReadLogs = async() => {
    const folders = await FileSystem.readDirectoryAsync(FileSystem.documentDirectory)
    console.log('folders', folders)
    return true
    // await readLogs(appLogFileUri)
    // console.log('appLogs', appLogs)
    // await readLogs(trackLogFileUri)
    // console.log('trackLogs', trackLogs)
  }

  return(
    <View style={styles.mainContainer}>
      <Header />
      <LinearGradient
      style={styles.mainContent}
      colors={['rgba(120, 135, 251, 0.312)', 'rgba(204, 102, 198, 0.1508)', 'rgba(255, 255, 255, 0.52)']}
      >
        <View style={styles.blockContent}>
          <Button title='отправить логи' onPress={handleSendLogs}/>
          <Button title='Очитсить приложение' onPress={handleClearApp}/>
          <Button title='Прочитать логи' onPress={handleReadLogs}/>
        </View>
      </LinearGradient>
    </View>
  );
}