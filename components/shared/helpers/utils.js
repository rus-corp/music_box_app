import AsyncStorage from '@react-native-async-storage/async-storage'
import * as FileSystem from 'expo-file-system'
import { Platform } from 'react-native'

export const checkFolder = async (folderName) => {
  const folderUri = `${FileSystem.documentDirectory}${folderName}/`
  const folderInfo = await FileSystem.getInfoAsync(folderUri)
  return folderInfo.exists
}


export const createFolder = async (folderName) => {
  const folderUri = `${FileSystem.documentDirectory}${folderName}/`;
  const exsist = await checkFolder(folderName)
  if (!exsist) {
    await FileSystem.makeDirectoryAsync(folderUri, { intermediates: true })
  }
  return folderUri
}

export const deleteFolder = async (folderName) => {
  const folderUri = `${FileSystem.documentDirectory}${folderName}/`;
  const exsist = await checkFolder(folderName)
  if (exsist) {
    await FileSystem.deleteAsync(folderUri, { idempotent: true })
    return true
  }
}


export const saveFileToFolder = async(folderName, files) => {
  const folderUri = await createFolder(folderName)
  console.log(files)
  const { title, id } = files
  const filename = `${title}.mp3`
  const result = await FileSystem.downloadAsync(
    `http://87.228.25.221:8000/api/app_routers/download_file/${id}`,
    folderUri
  )
  console.log(result, result.uri)
  await deleteStorageFolder()
  const trackmime = result.headers['content-type']
  saveFile(result.uri, filename, trackmime, folderName)
  // for (const file of files) {
  //   const { title, id } = file
  //   const filename = `${title}.mp3`
  //   const result = await FileSystem.downloadAsync(
  //     `http://87.228.25.221:8000/api/app_routers/download_file/${id}`,
  //     folderUri
  //   )
  //   console.log(result, result.uri)
  //   const trackmime = result.headers['content-type']
  //   saveFile(result.uri, filename, trackmime, folderName)
  // }
}


const saveFile = async (uri, filename, mimetype, collectionName) => {
  if (Platform.OS === 'android') {
    const savedDirectoryUri = await getOrRequestDirUri(collectionName)
    console.log('62 savedDirectoryUri', savedDirectoryUri)
    const base64 = await FileSystem.readAsStringAsync(uri, { encoding: FileSystem.EncodingType.Base64 });
    try {
      const fileUri = await FileSystem.StorageAccessFramework.createFileAsync(
        savedDirectoryUri,
        filename,
        mimetype
      );
      console.log('69 fileUri', fileUri)
      await FileSystem.StorageAccessFramework.writeAsStringAsync(fileUri, base64, {
        encoding: FileSystem.EncodingType.Base64,
      });
      
      console.log('file writed to', fileUri)
    } catch (error) {
      console.log(error)
    }
    console.log('files saved')
    }
}



const requestDirPermisssion = async (collectionName) => {
  const permission = await FileSystem.StorageAccessFramework.requestDirectoryPermissionsAsync()
  if (permission.granted) {
    const dirUri = permission.directoryUri
    console.log('dirUri after permis ', dirUri)
    const collectionUri = await createSubFolder(dirUri, collectionName)
    console.log('collectionUri', collectionUri)
    await AsyncStorage.setItem('directoryUri', collectionUri)
    return collectionUri
  }
}


const getOrRequestDirUri = async(collectionName) => {
  let saveDirUri = await AsyncStorage.getItem('directoryUri')
  if (!saveDirUri) {
    saveDirUri = await requestDirPermisssion(collectionName)
  }
  console.log('105 saveDirUri', saveDirUri)
  return saveDirUri
}

const createSubFolder = async(parentDirUri, folderName) => {
  console.log('107 createSubFolder')
  const subFolderUri = `${parentDirUri}%2F${folderName}`;
  console.log('109 subFolderUri', subFolderUri)
  try {
    const dirInfo = await FileSystem.getUriForFileInDirectoryAsync(
      parentDirUri, folderName
    )
    console.log('111 dirInfo', dirInfo)  
  } catch(e) {
    console.log(e)
  }
  if (!dirInfo.exists) {
    console.log("directory doesn't exist, creating…")
    const createdFolder = await FileSystem.makeDirectoryAsync(subFolderUri, { intermediates: true })
    console.log('110 createdFolder', createdFolder)
    return createdFolder;
  }
};




// const saveDirectoryUri = async (uri) => {
//   try {
//     const dir = await AsyncStorage.setItem('directoryUri', uri)
//     return dir
//   } catch (error) {
//     console.error(error)
//   }
// }

const deleteStorageFolder = async () => {
  await AsyncStorage.removeItem('directoryUri')
  return true
}