import React from 'react';
import {TouchableOpacity, View, StyleSheet, Text, Image, Modal, FlatList} from 'react-native';
import {Avatar, Card} from 'react-native-elements';
import {LocaleConfig, Agenda, calendarTheme} from 'react-native-calendars';
import Firebase, {db} from '../Firebase.js';
import moment from 'moment';
import {Ionicons} from '@expo/vector-icons';
import Colors from '../API/Colors';
import {searchAcronym, searchEmoji, searchIcon}  from '../API/helpers';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {fetchUser, fetchEmployees} from '../redux/ActionCreators';


LocaleConfig.locales['cat'] = {
  monthNames: ['gener','febrer','març','abril','maig','juny','juliol','agost','setembre','octubre','novembre','desembre'],
  monthNamesShort: ['gen.','febr.','març','abr.','maig','juny','jul.','ag.','set.','oct.','nov.','des.'],
  dayNames: ['diumenge','dilluns','dimarts','dimecres','dijous','divendres','dissabte'],
  dayNamesShort: ['dg.','dl.','dt.','dc.','dj.','dv.','ds.'],
  today: 'Avui'
};
LocaleConfig.defaultLocale = 'cat';

const mapDispatchToProps = dispatch => {
  return bindActionCreators({ fetchUser, fetchEmployees }, dispatch)
}

const mapStateToProps = state => {
  return {
    currentUser: state.currentUser,
    employees: state.employees
  }
}

class CalendarScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showModal: false,
      items: {},
      markedDates: {},
      entries: [],
      today: this.timeToString(new Date()), //current date
      username: ''
    };
  }

  componentDidMount() { 
    const uid = Firebase.auth().currentUser.uid;

    if(uid) {
      //fetch current user and employees of the same company
      this.props.fetchEmployees(this.props.currentUser.user.companyName, uid);
      this.setState({username: this.props.currentUser.user.username});
    }

    db.collection('users').doc(uid).collection('entries')
      .onSnapshot((querySnapshot) => {
        const list = [];
        querySnapshot.forEach(doc => {
          const { date, state, activity, comment } = doc.data().entries; //Timestamp(seconds=1573376859, nenoseconds=971000000)
          let dateJS = date.toDate(); //Sun Nov 10 2019 10:07:39 GTM+0100 (CET)       
          let dateText = moment(dateJS).format("YYYY-MM-DD") //10-11-2019 //2019-11-10
          list.push({
            id: doc.id, 
            dateText,
            state,
            activity,
            comment
          });
        });
        this.setState({entries: list});
        this.getMarkedDates();
      });
  }

  resetStates(){
    this.setState({ entries: [], markedDates: {} });
  }

  loadItems(day) {
    setTimeout(() => {
      const strTime = this.timeToString(day.timestamp);
      this.state.items[strTime] = [];  
      const newItems = {};

      this.state.entries.map(entry => {
        if (entry.dateText == strTime) {
          this.state.items[strTime].push({
            date: strTime,
            state: entry.state,
            activity: entry.activity,
            comment: entry.comment
          });
        }
      });
      
      Object.keys(this.state.items).forEach(key => { newItems[key] = this.state.items[key]; });
      this.setState({items: newItems});
      this.getMarkedDates();
    }, 1000);
  }

  renderItem(item) {
    return (
      <View style={[styles.item]}>
        <Image style={styles.image} source={searchEmoji(item.state)} />
        <View>
          <Text style={styles.entryTitle}>
            {item.state}
          </Text>
          <Text style={styles.entryText}>
            <Ionicons name={searchIcon(item.activity)} size={15} />
            {" " + item.activity + ". " + item.comment}
          </Text>
        </View>
      </View>
    );
  }

  renderEmptyDate() {
    return (
      <View style={styles.emptyDate}>
        <Text>Aquesta data està buida.</Text>
      </View>
    );
  }

  rowHasChanged(r1, r2) {
    return r1.name !== r2.name;
  }

  timeToString(time) {
    const date = new Date(time);
    return date.toISOString().split('T')[0];
  }

  getMarkedDates() {
    let mark = [];
    let markObjects = {};

    //get the array of dates with entries to get marked
    this.state.entries.map(entry => {
      mark.push(entry.dateText+":"+entry.state);
    });
    
    //convert all dates to objects
    mark.map(date => {
      let str = date.split(":");
      let dateText = str[0];
      let state = str[1];
      let obj = Object.assign(markObjects, {[dateText]: {marked: true, dotColor: state == "Relaxat" ? Colors.green : state == "Meh" ? Colors.yellow : Colors.red }})
      this.setState({ markedDates : obj });
    });
  }

  toggleModal() {
    this.setState({showModal: !this.state.showModal});
  }

  getEmployeeStatistics(id) {
    this.resetStates();

    db.collection('users').doc(id).get()
      .then(doc => {
        this.setState({username: doc.data().username})
        db.collection('users').doc(doc.id).collection('entries')
          .onSnapshot((querySnapshot) => {
            const list = [];
            querySnapshot.forEach(doc => {
              const { date, state, activity, comment } = doc.data().entries; //Timestamp(seconds=1573376859, nenoseconds=971000000)
              let dateJS = date.toDate(); //Sun Nov 10 2019 10:07:39 GTM+0100 (CET)       
              let dateText = moment(dateJS).format("YYYY-MM-DD"); //10-11-2019 //2019-11-10
              list.push({
                id: doc.id, 
                dateText,
                state,
                activity,
                comment
              });
            });
            this.setState({entries: list, showModal: false});
            this.getMarkedDates();
          });
      });
  }

  renderEmployee(item) {
    return(
      <View style={styles.employeeContainer}>
        <Avatar 
          size="small"
          rounded 
          title={searchAcronym(item.username)} 
          overlayContainerStyle={{ backgroundColor: Colors.yellow }}
        />
        <Text style={{ marginLeft: 10 }}>{item.username}</Text>
        <Ionicons 
          name='ios-arrow-round-forward' 
          size={40} 
          color={Colors.darkgray}
          style={styles.nameIcon}
          onPress={() => this.getEmployeeStatistics(item.id)}
        />
      </View>
    );
  }
  
  renderModal(){
    return(
      <Modal
        animationType={'slide'}
        transparent={false}
        visible={this.state.showModal}
        onDismiss={() => this.toggleModal()}
        onRequestClose={() => this.toggleModal()}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity style={styles.logoHeaderLeft} onPress={() => this.toggleModal()}>
              <Ionicons
                name='ios-close'
                size={35}
                style={{ marginLeft: 20 }}
                color={Colors.black}
              />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Empleats</Text>
            <Text style={styles.modalSubtitle}>Selecciona el treballador que vols consultar</Text>
          </View>

          <View style={styles.modalBody}>
            <Card containerStyle={styles.modalCard}>
              <FlatList 
                data={this.props.employees.employees}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (this.renderEmployee(item))}
              />
            </Card>
          </View>    
        </View>
      </Modal>
    );
  }

  renderUsername() {
    return(
      <TouchableOpacity style={styles.nameContainer} onPress={() => this.toggleModal()}>
        <Text style={styles.nameText}>
          {this.state.username}
        </Text>
        <Ionicons 
          name='ios-arrow-round-forward' 
          size={40} 
          color={Colors.white} 
          style={styles.nameIcon}
        />
      </TouchableOpacity>
    );
  }

  render(){
    return(
      <View style={{height: '100%'}}>
        {this.props.currentUser.user.isAdmin ? this.renderUsername() : null}
        {this.renderModal()}
        <Agenda
          items={this.state.items}
          loadItemsForMonth={this.loadItems.bind(this)}
          maxDate={this.state.today}
          selected={this.state.today}
          renderItem={this.renderItem.bind(this)}
          renderEmptyDate={this.renderEmptyDate.bind(this)}
          rowHasChanged={this.rowHasChanged.bind(this)}
          markedDates={this.state.markedDates}
          theme={{
            ...calendarTheme,
            agendaDayTextColor: Colors.yellow,
            agendaDayNumColor: Colors.yellow,
            agendaTodayColor: Colors.yellow,
            agendaKnobColor: Colors.yellow,
            selectedDayBackgroundColor: Colors.red,
            backgroundColor: Colors.lightYellow,
          }}
        />
      </View>
    );
  }
}

CalendarScreen.navigationOptions = {
  title: 'Calendari',
  headerStyle: { backgroundColor: Colors.yellow, elevation: 0 },
  headerTintColor: Colors.white
};

const styles = StyleSheet.create({
  nameContainer: {
    width: '100%',
    top: 0,
    backgroundColor: Colors.yellow,
    padding: 15,
    flexDirection: 'row',
    alignItems: 'center'
  },
  nameText: {
    color: Colors.white,
    opacity: 0.8,
    fontSize: 16
  },
  nameIcon: {
    right: 10, 
    position: 'absolute', 
    opacity: 0.8 
  },
  item: {
    backgroundColor: Colors.white,
    flex: 1,
    borderRadius: 5,
    padding: 10,
    marginRight: 10,
    marginTop: 17,
    flexDirection: 'row'
  },
  emptyDate: {
    height: 15,
    flex:1,
    paddingTop: 30
  }, 
  image: {
    width: 35,
    height: 35,
    marginRight: 20
  },

  modalContainer: {
    flex: 1,
    backgroundColor: Colors.lightGray
  },
  logoHeaderLeft: {
    alignItems: 'center',
    flexDirection: 'row',
    top: 0,
    left: 0,
    position: 'absolute'
  },
  modalHeader: {
    height: '20%',
    width: '100%',
    backgroundColor: Colors.lightGray,
    alignItems: 'center',
    justifyContent: 'center'
  },
  modalTitle: {
    fontSize: 16,
    margin: 10,
    letterSpacing: 1.5,
    color: Colors.black,
    fontWeight: 'bold'
  },  
  modalSubtitle: {
    fontSize: 16,
    margin: 10,
    letterSpacing: 1.5,
    color: Colors.darkGray,
    textAlign: 'center'
  },
  modalBody: {
    height: '80%',
    width: '100%',
    backgroundColor: Colors.lightGray,
    alignItems: 'center'
  },
  modalCard: {
    borderWidth: 0,
    borderRadius: 8,
    width: '90%',
    elevation: 5,
    bottom: 0,
    padding: 0,
    marginBottom: 15,
  },
  employeeContainer: {
    flexDirection: 'row',
    padding: 15,
    borderBottomWidth: 1,
    borderColor: Colors.lightGray,
    alignItems: 'center'
  },
  entryTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.black
  },
  entryText: {
    marginTop: 5,
    color: Colors.darkGray,
    flexWrap: 'wrap',
    width: 200
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(CalendarScreen);