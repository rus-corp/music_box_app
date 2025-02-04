import { StyleSheet } from "react-native";


export const styles = StyleSheet.create({
  collectionItem: {
    borderRadius: 20,
    width: '100%',
    height: '100%',
    minHeight: 280,
    backgroundColor: 'rgba(220, 143, 164, 0.24)',
    alignItems: 'center'
    // borderWidth: 2,
  },
  image: {
    borderRadius: 20,
    width: '100%',
    height: 150,
  },
  content: {
    marginTop: '2%',
  },
  title: {
    fontWeight: 600,
    fontSize: 18
  },
  desc: {
    marginTop: '7%',
    textAlign: 'center'
  },
  collectionBtn: {
    marginTop: '5%',
    width: '80%',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    paddingTop: '4%',
    paddingBottom: '4%',
    backgroundColor: 'skyblue'
  },
  btnPressed: {
    transform: [{ scale: 0.9 }]
  },
})

