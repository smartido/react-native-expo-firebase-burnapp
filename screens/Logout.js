import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import Colors from '../API/Colors';
import Firebase from '../Firebase.js';

class Logout extends React.Component {
  constructor(props){
    super(props);
  }

  handleSignout() {
    Firebase.auth().signOut();
    this.props.navigation.navigate('Login');
  }

  render() {
    return (
      <View style={styles.container}> 
        <Text style={styles.title}>Tancar sessió</Text>
        <Text style={styles.subtitle}>Vols sortir de l'aplicació?</Text>
        <Text style={styles.divider}></Text>
        <TouchableOpacity style={styles.button} onPress={() => this.handleSignout()}>
          <Text style={styles.buttonText}>Sortir</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.buttonCancel} onPress={() => this.props.navigation.goBack()}>
          <Text style={styles.buttonCancelText}>Cancelar</Text>
        </TouchableOpacity>
      </View>  
    );
  }
}

Logout.navigationOptions = {
  title: 'Sortir',
  headerStyle: { backgroundColor: Colors.yellow },
  headerTintColor: Colors.white
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
    alignItems: 'center',
    justifyContent: 'center'
  },
  arrowBackContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    alignItems: 'flex-start',
    paddingVertical: 15,
  },
  title: {
    fontSize: 17,
    margin: 10,
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    color: Colors.yellow,
    fontWeight: 'bold',
  },  
  subtitle: {
    fontSize: 22,
    margin: 10,
    letterSpacing: 1.5,
    color: 'rgba(96,100,109, 1)',
    textAlign: 'center'
  },
  divider: {
    backgroundColor: Colors.yellow,
    width: '15%',
    height: 3,
    margin: 30,
  },
  button: {
    marginTop: 30,
    marginBottom: 10,
    paddingVertical: 15,
    alignItems: 'center',
    backgroundColor: Colors.yellow,
    borderColor: Colors.yellow,
    borderWidth: 3,
    borderRadius: 30,
    width: '85%'
  },
  buttonText: {
    fontSize: 17,
    fontWeight: 'bold',
    color: Colors.white
  },
  buttonCancel: {
    marginTop: 10,
    paddingVertical: 15,
    alignItems: 'center',
    borderColor: Colors.yellow,
    borderWidth: 3,
    borderRadius: 30,
    width: '85%'
  },
  buttonCancelText: {
    fontSize: 17,
    fontWeight: 'bold',
    color: Colors.yellow
  }
});

export default Logout;

