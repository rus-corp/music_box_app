import { StyleSheet } from "react-native";


export const styles = StyleSheet.create({
  mainContainer: {
    flex: 1
  },
  mainContent: {
    flex: 1
  },
  mainContentHeader: {
    height: '10%',
    width: '90%',
    flexDirection: 'row',
    gap: 200,
    marginLeft: '7%',
    alignItems: 'center'
  },
  headerContentItem: {
    color: 'rgba(128, 142, 238, 1)',
    fontSize: 32
  },
  line: {
    marginLeft: 'auto',
    marginRight: 'auto',
    borderWidth: 1,
    width: '90%',
    borderColor: 'rgba(255, 255, 255, 0.35)'
  },
  collectionList: {
    marginTop: '2%',
    paddingLeft: '5%',
    paddingRight: '5%',
    width: '100%',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 40,
    alignItems: 'stretch'
  },
})