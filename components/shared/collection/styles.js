import { StyleSheet } from "react-native";


export const styles = StyleSheet.create({
  collectionItem: {
    borderRadius: 20,
    width: '100%',
    height: '100%',
    minHeight: '28%',
    backgroundColor: 'rgba(220, 143, 164, 0.24)',
    alignItems: 'center'
    // borderWidth: 2,
  },
  image: {
    borderRadius: 20,
    width: '100%',
    height: 100,
  },
  content: {
    marginTop: '8%',
  },
  title: {
    fontWeight: 600,
    fontSize: 18
  },
  desc: {
    marginTop: '15%',
    textAlign: 'center'
  },
})