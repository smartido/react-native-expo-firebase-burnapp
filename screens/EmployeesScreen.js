import * as React from 'react';
import {Text, View, StyleSheet, FlatList, TouchableOpacity, Modal, Alert, Switch, ActivityIndicator} from 'react-native';
import {Avatar, SearchBar, Card} from 'react-native-elements';
import Swipeout from 'react-native-swipeout';
import * as Animatable from 'react-native-animatable';
import Colors from '../API/Colors';
import {searchAcronym}  from '../API/helpers';
import {Ionicons} from '@expo/vector-icons';
import Firebase, {db} from '../Firebase.js';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {fetchUser, fetchEmployees} from '../redux/ActionCreators';

const mapDispatchToProps = dispatch => {
  return bindActionCreators({ fetchUser, fetchEmployees }, dispatch)
}

const mapStateToProps = state => {
  return {
    currentUser: state.currentUser,
    employees: state.employees
  }
}

class EmployeesScreen extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      employeeSearch: [],
      showModal: false,
      search: "",
      employeeId: "",
      employeeUsername: "",
      employeeEmail: "",
      employeeCompanyName: "", 
      employeeIsAdmin: false,
      employeeHasPermission: false
    }
  }

  componentDidMount() { 
    const uid = Firebase.auth().currentUser.uid;

    if(uid) {
      //fetch current user and employees of the same company
      this.props.fetchUser(uid);
      this.props.fetchEmployees(this.props.currentUser.user.companyName, uid);
    }
  }

  searchFilterFunction(text) {
    //passing the inserted text in textinput
    const newData = this.props.employees.employees.filter(function(item) {
      //applying filter for the inserted text in search bar
      const itemData = item.username ? item.username.toUpperCase() : ''.toUpperCase();
      const textData = text.toUpperCase();
      return itemData.indexOf(textData) > -1;
    });
    
    //setting the filtered newData on datasource
    //After setting the data it will automatically re-render the view
    this.setState({employeeSearch: newData, search: text});
  }

  renderCurrentUser() {
    return(
      <Card containerStyle={styles.userCard}>
        <View style={styles.employeeContainer}>
            <Avatar 
              size="small"
              rounded 
              title={searchAcronym(this.props.currentUser.user.username)} 
              overlayContainerStyle={{ backgroundColor: Colors.yellow }}
            />
            <Text style={styles.name}>
              {this.props.currentUser.user.username}
            </Text>     
          </View>
      </Card>
    );
  }

  toggleModal(item = null) {
    this.setState({ showModal: !this.state.showModal });
    if(item != null) {
      this.setState({
        employeeId: item.id,
        employeeUsername: item.username,
        employeeEmail: item.email,
        employeeCompanyName: item.companyName,
        employeeIsAdmin: item.isAdmin,
        employeeHasPermission: item.hasPermission
      });
    }
  }

  updatePermission(id) {
    // Set the 'hasPermission' field of the user
    db.collection('users').doc(id).update({hasPermission: !this.state.employeeHasPermission});
  }

  showAlert(email) {
    Alert.alert(
      'Estàs segur?',
      'Vols esborrar aquest treballador de la llista?',
      [
        {text: 'Cancelar', style: 'cancel'},
        {text: 'OK', onPress: () => this.deleteItemByEmail(email)}
      ]
    );
  }

  deleteItemByEmail(email) {
    db.collection('users').onSnapshot((querySnapshot) => {
      querySnapshot.forEach(doc => {
        if(doc.data().email == email) 
          db.collection('users').doc(doc.id).delete();
      });
    });
  }

  toggleSwitch = value => {
    this.updatePermission(this.state.employeeId);
    this.setState({employeeHasPermission: value});
  };

  renderModal() {
    return(
      <Modal
        animationType='slide'
        visible={this.state.showModal}
        onDismiss={() => this.toggleModal()}
        onRequestClose={() => this.toggleModal()}
      >
        <View style={styles.modalContainer}>
          <TouchableOpacity style={styles.close} onPress={() => this.toggleModal()}>
            <Ionicons
              name='ios-close'
              size={35}
              style={{ marginLeft: 10 }}
              color={Colors.darkGray}
            />
          </TouchableOpacity>
          <Card containerStyle={styles.modalCard}>
            <Text style={styles.modalName}>{this.state.employeeUsername}</Text>
            <Text style={styles.modalSection}>Treball</Text>
            <Text style={styles.modalSubtitle}>Manager</Text>
            <Text style={styles.modalText}>{this.state.employeeIsAdmin ? "Administrador" : "Empleat"}</Text>
            <Text style={styles.modalSubtitle}>Correu electrònic</Text>
            <Text style={styles.modalText}>{this.state.employeeEmail}</Text>
            <Text style={styles.modalSubtitle}>Empresa</Text>
            <Text style={styles.modalText}>{this.state.employeeCompanyName}</Text>
            <Text style={styles.modalSection}>Permisos</Text>
            { !this.props.currentUser.user.isAdmin ? null :  
              <View style={styles.switch}>
                <Text>Té permisos?</Text>
                <Switch
                  style={{ transform: [{ scaleX: 1.0 }, { scaleY: 1.0 }] }}
                  onValueChange={this.toggleSwitch}
                  value={this.state.employeeHasPermission}
                  trackColor={{true: '#000', false: Colors.lightGray}}
                  thumbColor={Colors.lightGray}
                />
              </View> }
          </Card>
        </View>
      </Modal>
    );
  }

  renderEmployee(item) {
    if(this.props.currentUser.user.isAdmin) {
      return(
        <Swipeout 
          autoClose={true} 
          backgroundColor="transparent" 
          right={[{ 
            text: <Ionicons name='ios-arrow-round-forward' size={35} color={Colors.darkGray} />,
            backgroundColor: Colors.white,
            onPress: () => this.toggleModal(item)
          }, {
            text: <Ionicons name='ios-trash' size={25} color={Colors.white} />,
            backgroundColor: Colors.red,
            onPress: () => this.showAlert(item.email)
          }]} 
          style={styles.swipeout}
        >
          <View style={styles.employeeContainer}>
            <Avatar 
              size="small"
              rounded 
              title={searchAcronym(item.username)} 
              overlayContainerStyle={{ backgroundColor: Colors.yellow }}
            />
            <Text style={item.hasPermission ? styles.name : styles.nameDisabled}>{item.username}</Text>
            { item.hasPermission ? null : 
              <TouchableOpacity onPress={() => this.updatePermission(item.id)}>
                <Text style={styles.accept}>{" Acceptar"}</Text>
              </TouchableOpacity>
            }
          </View>
        </Swipeout>
      );
    } else {
      return(
        <Swipeout 
          autoClose={true} 
          backgroundColor="transparent" 
          right={[{ 
            text: <Ionicons name='ios-arrow-round-forward' size={35} color={Colors.darkGray} />,
            backgroundColor: Colors.white,
            onPress: () => this.toggleModal(item)
          }]} 
          style={styles.swipeout}
        >
          <View style={styles.employeeContainer}>
            <Avatar 
              size="small"
              rounded 
              title={searchAcronym(item.username)} 
              overlayContainerStyle={{ backgroundColor: Colors.yellow }}
            />
            <Text style={item.hasPermission ? styles.name : styles.nameDisabled}>{item.username}</Text>
          </View>
        </Swipeout>
      );
    }
  }
  
  renderEmployeesList() {
    if(this.props.employees.employees.length > 0) {
      return(
        <Card containerStyle={styles.card}>
          {this.renderModal()}
          <FlatList 
            data={this.state.employeeSearch.length == 0 ? this.props.employees.employees : this.state.employeeSearch}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (this.renderEmployee(item))}
          />
        </Card> 
      );
    } else {
      return (
        <View style={{width: '100%'}}>
          <Text style={styles.emptyEmployees}>No hi ha cap treballador registrat</Text>
        </View>
      );
    }
  }

  render() {
    if(this.props.currentUser.isLoading || this.props.employees.isLoading) {
      return(
        <View style={styles.container}>
          <ActivityIndicator size="large" color={Colors.darkGray} />
        </View>
      ); 
    } else {
      return(
        <View style={styles.container}>
          <View style={styles.header}>
            <SearchBar
              inputContainerStyle={styles.searchBarInput}
              containerStyle={styles.searchBarContainer}
              searchIcon={{ size: 24 }}
              onChangeText={text => this.searchFilterFunction(text)}
              onClear={text => this.searchFilterFunction('')}
              placeholder="Cerca"
              value={this.state.search}
            />
          </View>
          <Animatable.View style={styles.body} animation="fadeIn" duration={1000} delay={1000}>
            {this.renderCurrentUser()}
            {this.renderEmployeesList()}
          </Animatable.View>
        </View>
      );
    }
  }
}

EmployeesScreen.navigationOptions = {
  title: 'Empleats',
  headerStyle: { backgroundColor: Colors.yellow, elevation: 0 },
  headerTintColor: Colors.white
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.lightGray,
    justifyContent: 'center'
  },
  header: {
    height: '20%',
    width: '100%',
    backgroundColor: Colors.yellow,
    alignItems: 'center'
  },
  body: {
    height: '80%',
    width: '100%',
    backgroundColor: Colors.lightGray,
    alignItems: 'center'
  },
  userCard: {
    padding: 0,
    paddingTop: 10,
    paddingBottom: 10,
    width: '90%', 
    borderWidth: 0,
    borderRadius: 8,
    elevation: 5,
    marginBottom: 15,
    top: -50, 
    position: 'absolute'
  },
  card: { 
    padding: 0,
    width: '90%',
    borderWidth: 0,
    borderRadius: 8,
    elevation: 5,
    marginBottom: 15,
    top: 40,
    bottom: 0,
    position: 'absolute'
  },
  searchBarContainer: {
    backgroundColor: Colors.yellow, 
    borderBottomColor: 'transparent', 
    borderTopColor: 'transparent', 
    width: '95%'
  },
  searchBarInput: {
    backgroundColor: 'white', 
    borderBottomColor: 'transparent', 
    borderTopColor: 'transparent'
  },
  swipeout: {
    borderBottomWidth: 1,
    borderColor: Colors.lightGray
  },
  employeeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10
  },
  name: {
    marginLeft: 15,
    fontSize: 16,
    width: '60%'  
  },
  nameDisabled: {
    marginLeft: 15,
    fontSize: 16,
    opacity: 0.2
  },
  accept: {
    color: Colors.green
  },
  modalContainer: {
    flex: 1,
    backgroundColor: Colors.lightGray,
    alignItems: 'center',
    paddingTop: 60,
  },
  close: {
    position: 'absolute',
    left: 10,
    paddingTop: 30,
  },
  modalCard: {
    padding: 0,
    width: '90%',
    borderWidth: 0,
    borderRadius: 8,
    elevation: 5
  },
  modalName: {
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
    fontSize: 22,
    paddingTop: 60,
    paddingBottom: 20
  },
  modalSection: {
    backgroundColor: Colors.lightGray,
    color: Colors.darkGray,
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    fontWeight: 'bold',
    padding: 10,
    paddingLeft: 15,
    paddingRight: 15
  },
  modalSubtitle: {
    color: Colors.darkGray,
    paddingLeft: 15,
    paddingRight: 15,
    marginTop: 15,
  },
  modalText: {
    paddingLeft: 15,
    paddingRight: 15,
    marginBottom: 15,
  },
  switch: {
    flexDirection: 'row',
    padding: 15
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(EmployeesScreen);
