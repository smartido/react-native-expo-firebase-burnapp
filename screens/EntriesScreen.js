import React from 'react';
import {View, StyleSheet, Text, TouchableOpacity, Image, TextInput, DatePickerAndroid} from 'react-native';
import {Avatar, Card} from 'react-native-elements';
import {Ionicons} from '@expo/vector-icons';
import {STATES}  from '../API/states';
import {ACTIVITIES}  from '../API/activities';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {updateEntries, addEntries} from '../redux/ActionCreators';
import moment from 'moment';
import Firebase from '../Firebase.js';
import Colors from '../API/Colors';

const mapStateToProps = state => {
  return {
    currentUser: state.currentUser
  }
}

const mapDispatchToProps = dispatch => { 
  return bindActionCreators({ updateEntries, addEntries }, dispatch)
}

class EntriesScreen extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      showActivities: false,
      selectedState: '',
      selectedEmoji: '',
      selectedActivity: '',
      comment: '',
      date: new Date(), //current date
      dateText: moment(new Date()).format("DD-MM-YYYY")
    }
    this.showDatePicker.bind(this);
  }

  handleSave(){
    const auth = Firebase.auth().currentUser;

    if (auth) {
      this.props.addEntries(this.state.date, this.state.selectedState, this.state.selectedActivity, this.state.comment, auth.email);
      this.setState({selectedState: '', selectedActivity: '', comment: '', showActivities: false}) //reset
      this.props.updateEntries([]);
      this.props.navigation.navigate('Home');
    } 
  }

  showDatePicker = async() => {
    try {
      const {action, year, month, day} = await DatePickerAndroid.open({maxDate: new Date()}); //disable future dates in DatePickerAndroid
      if (action !== DatePickerAndroid.dismissedAction) {
        let date = new Date(year, month, day);
        let newState = {};
        newState['date'] = date;
        newState['dateText'] = moment(date).format("DD-MM-YYYY")  
        this.setState(newState);
      }
    } catch ({message}) {
      alert(message);
    }
  }

  renderStateOptions(){
    return(
      <View style={styles.selector}>
          { STATES.map((state) => {
            return(
              <TouchableOpacity 
                key={state.id}   
                style={{padding: 5}} 
                onPress={() => this.setState({showActivities: true, selectedState: state.name, selectedEmoji: state.image})}
              >
                <Image style={styles.emoji} source={state.image}/>
                <Text style={this.state.selectedState != state.name ? styles.stateText : styles.stateTextSelected}>
                  {state.name}
                </Text>
              </TouchableOpacity>
            );
          }) }
      </View>
    );
  }
  
  renderStates() {
    let title = (
      <View style={styles.dateContainer}>
         <Avatar 
          size="medium"
          title={ 
            <Ionicons
              name='md-calendar'
              size={30}
              style={{ textAlign: 'center'}}
              color={Colors.yellow}
            />
          }
          overlayContainerStyle={{ backgroundColor: Colors.lightYellow }}
          onPress={() => this.showDatePicker({date: this.state.date})}
        />
        <View style={{flexDirection: 'column', width: '80%'}}>
          <Text style={styles.dateTitle}>Data</Text>
          <Text style={styles.dateText}>{this.state.dateText}</Text>
        </View>
      </View>
    );

    return(      
      <View style={styles.container}>
        <View style={styles.header}>
          { this.state.selectedState == '' ? null :
          <TouchableOpacity style={styles.logoHeaderRight} onPress={() => this.setState({showActivities: true})}>
            <Ionicons
              name='ios-arrow-round-forward'
              size={35}
              style={{ marginRight: 20 }}
              color={Colors.white}
            />
          </TouchableOpacity> }
          <Text style={styles.title}>Com estàs?</Text>
          <Text style={styles.subtitle}>Selecciona una opció</Text>
        </View>
        <View style={styles.body}>
          <Card title={title} containerStyle={styles.card}>
            {this.renderStateOptions()}
          </Card>
        </View>
      </View>
    );
  }
  
  renderActivitiesOptions() {
    return(
        <View style={styles.selector}>
          <TextInput
            style={styles.inputBox}
            value={this.state.comment}
            onChangeText={comment => this.setState({ comment })}
            placeholder='Afegeix una nota'
          />
          { ACTIVITIES.map((activity) => {
            return(
              <TouchableOpacity style={{paddingBottom: 10}} key={activity.id} onPress={() => this.setState({selectedActivity: activity.name}) }>
                <Ionicons
                  name={activity.image}
                  size={25}
                  style={{ padding: 5, textAlign: 'center'}}
                  color={this.state.selectedActivity != activity.name ? Colors.darkGray : Colors.black}
                />
                <Text style={this.state.selectedActivity != activity.name ? styles.activityText : styles.activityTextSelected}>
                  {activity.name}
                </Text>
              </TouchableOpacity>
            );
          }) }
        </View>
    );
  }

  renderActivities() {
    return(
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.logoHeaderLeft} onPress={() => this.setState({showActivities: false})}>
            <Ionicons
              name='ios-arrow-round-back'
              size={35}
              style={{ marginLeft: 20 }}
              color={Colors.white}
            />
          </TouchableOpacity>
          <TouchableOpacity style={styles.logoHeaderRight} onPress={() => this.handleSave()}>
            <Ionicons
              name='ios-checkmark'
              size={35}
              style={{ marginRight: 20 }}
              color={Colors.white}
            />
          </TouchableOpacity>
          <Text style={styles.title}>Com ha passat?</Text>
          <Text style={styles.subtitle}>Selecciona una opció</Text>
        </View>
        <View style={styles.body}>
          <Card containerStyle={styles.card}>
            <Image style={styles.emojiSelected} source={this.state.selectedEmoji}/>
            {this.renderActivitiesOptions()}
          </Card>
        </View>
      </View>
    );
  }

  render(){
    return !this.state.showActivities ? this.renderStates() : this.renderActivities() 
  }
}

EntriesScreen.navigationOptions = {
  title: 'Entrades',
  headerStyle: { backgroundColor: Colors.yellow, elevation: 0 },
  headerTintColor: 'white'
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.lightGray,
    justifyContent: 'center'
  },
  logoHeaderLeft: {
    alignItems: 'center',
    flexDirection: 'row',
    top: 0,
    left: 0,
    position: 'absolute'
  },
  logoHeaderRight: {
    alignItems: 'center',
    flexDirection: 'row',
    top: 0,
    right: 0,
    position: 'absolute'
  },
  header: {
    flex: 1,
    backgroundColor: Colors.yellow,
    alignItems: 'center',
    justifyContent: 'center'
  },
  title: {
    fontSize: 16,
    margin: 10,
    letterSpacing: 1.5,
    color: Colors.white,
    fontWeight: 'bold',
  },  
  subtitle: {
    fontSize: 22,
    margin: 10,
    letterSpacing: 1.5,
    color: Colors.white,
    opacity: 0.8,
    textAlign: 'center',
    marginBottom: 30
  },
  body: {
    flex: 2,
    backgroundColor: Colors.lightGray,
    alignItems: 'center',
    justifyContent: 'center'
  },
  card: {
    position: 'absolute',
    top: -60,
    width: '90%',
    borderWidth: 0,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 0,
    paddingBottom: 20
  },
  dateContainer: {
    flexDirection: 'row',
    paddingVertical: 10,
    alignItems: 'center',
    borderColor: Colors.lightGray,
    borderBottomWidth: 1,
    marginBottom: 20
  },
  dateTitle: {
    fontSize: 16,
    color: Colors.darkGray,
    paddingLeft: 15,
    marginBottom: 10
  },
  dateText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'black',
    paddingLeft: 15
  },
  selector: {
    flexDirection: 'row',
    justifyContent: 'center',
    flexWrap: 'wrap',
  },
  emoji: {
    width: 65,
    height: 65
  },
  stateText: {
    textAlign: 'center',
    fontSize: 11,
    color: Colors.darkGray
  },
  stateTextSelected: {
    textAlign: 'center',
    fontSize: 11,
    color: Colors.black,
    fontWeight: 'bold'
  },
  emojiSelected: {
    width: 35,
    height: 35,
    alignSelf: 'center'
  },
  inputBox: {
    fontSize: 16,
    color: Colors.darkGray, 
    width: '100%',
    margin: 10,
    padding: 5,
    borderColor: Colors.lightGray,
    borderWidth: 1,
    borderRadius: 8
  },
  activityText: {
    textAlign: 'center',
    width: 70,
    fontSize: 11,
    color: Colors.darkGray
  },
  activityTextSelected: {
    textAlign: 'center',
    width: 70,
    fontSize: 11,
    color: Colors.black,
    fontWeight: 'bold'
  },
})

export default connect(mapStateToProps, mapDispatchToProps)(EntriesScreen);