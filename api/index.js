import { baseUrl } from "./_variables";
import {
  getClientCollections,
  getCollectionTracks,
  getCollectionBases,
  getBaseTracks
} from "./collection_api/collection";
import { downloadAudio } from "./downloading/download_api";
import { authPost } from "./login";
import { getClientSheduler } from "./sheduler/sheduler";

export { authPost, getClientCollections,
  baseUrl, getCollectionTracks,
  downloadAudio, getCollectionBases, getBaseTracks,
  getClientSheduler }