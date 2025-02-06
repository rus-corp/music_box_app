import { backend } from "../_variables";


export const getClientCollections = async () => {
  try {
    const response = await backend.get(
      '/app_routers/get_client_collection'
    )
    return response
  } catch (error) {
    console.error(error)
  }
}


export const getCollectionTracks = async (collectionId) => {
  try {
    const response = await backend.get(
      `/app_routers/get_collection_tracks/${collectionId}`
    )
    return response
  } catch (error) {
    console.error(error)
  }
}


export const getCollectionBases = async (collectionId) => {
  try {
    const response = await backend.get(
      `/music/collection/collection_with_base_collection_and_track_collection/${collectionId}`
    )
    return response
  } catch (error) {
    console.error(error.response.data)
  }
}

export const getBaseTracks = async (baseId) => {
  const reqData = {
    "collection_id": baseId,
    "limit": 50,
    "offset": 0
  }
  try {
    const response = await backend.post(
      `/music/tracks/base_collection_tracks`,
      reqData
    )
    return response
  } catch (error) {
    console.error(error)
  }
}