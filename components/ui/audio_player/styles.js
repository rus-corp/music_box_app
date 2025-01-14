import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  player: {
    width: '100%',
    height: 70,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'black',
    paddingLeft: '3%',
    paddingRight: '3%'
  },
  trackTitle: {
    color: 'white',
    fontSize: 16
  },
  control: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20
  },
});