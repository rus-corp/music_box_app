import { StyleSheet } from "react-native";


export const styles = StyleSheet.create({
  headerContainer: {
    padding: 10,
    height: 150,
    paddingLeft: '10%',
  },
  containerTitle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 100
  },
  collectionTitle: {
    fontSize: 30,
    fontWeight: 'bold',
  },
  containerContent: {
    flexDirection: 'row',
    gap: 40,
    marginTop: 10
  },
});