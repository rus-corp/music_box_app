import { StyleSheet } from "react-native";


export const styles = StyleSheet.create({
  mainContainer: {
    flex: 1
  },
  bntBlock: {
    width: '100%',
    flexDirection: 'row'
  },
  mainContent: {
    flex: 1
  },
  mainContentHeader: {
    height: '13%',
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
  progressContainer: {
    padding: 10,
    alignItems: "center",
  },
  progressText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  progressBar: {
    width: "80%",
    height: 10,
    backgroundColor: "#ddd",
    borderRadius: 5,
    overflow: "hidden",
    marginTop: 5,
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#4CAF50",
  },
})