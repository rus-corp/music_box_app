import { StyleSheet } from "react-native";


export const styles = StyleSheet.create({
  mainContainer: {
    flex: 1
  },
  mainContent: {
    flex: 1,
    paddingLeft: '10%'
  },
  mainContentHeader: {
    height: '10%',
    width: '90%',
    flexDirection: 'row',
    gap: 200,
    marginLeft: '5%',
    alignItems: 'center'
  },
  headerContentItem: {
    color: 'rgba(128, 142, 238, 1)',
    fontSize: 32
  },
  line: {
    borderWidth: 1,
    width: '90%',
    borderColor: 'rgba(255, 255, 255, 0.35)'
  },
  collectionList: {
    flex: 1,
    marginTop: '3%',
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 40
  },
})