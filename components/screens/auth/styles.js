import { StyleSheet } from "react-native"


export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  authContainer: {
    flex: 1,
    padding: '2rem',
    alignItems: 'center',
    justifyContent: 'center'
  },
  authContent: {
    width: '45%',
    height: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.24)',
    borderRadius: 30,
    // alignItems: 'center',
  },
  imageContent: {
    alignItems: 'center',
    width: '100%',
    height: '55%'
  },
  image: {

  },
  formData: {
    width: '100%',
  },
  inputLabel: {
    color: '#fff',
    marginLeft: '15%'
  },
  inputWrapper: {
    width: '100%',
  },
  inputField: {
    backgroundColor: '#fff',
    width: '80%',
    borderRadius: 20,
    marginBottom: '3%',
    paddingLeft: 10,
    paddingTop: 5,
    paddingBottom: 5,
  },
  btnWrapper: {
    marginTop: '5%',
    textAlign: "center",
    alignItems: 'center'
  }
})