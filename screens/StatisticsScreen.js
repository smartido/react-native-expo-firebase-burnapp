import React from 'react';
import {View, ScrollView, StyleSheet, Text, TouchableOpacity, Modal, FlatList, ActivityIndicator} from 'react-native';
import {Avatar, Card, ButtonGroup, Badge} from 'react-native-elements';
import * as Animatable from 'react-native-animatable';
import {VictoryPie, VictoryChart, VictoryTheme, VictoryBar, VictoryScatter, VictoryAxis} from "victory-native";
import {Ionicons} from '@expo/vector-icons';
import moment from 'moment';
import Colors from '../API/Colors';
import Firebase, {db} from '../Firebase.js';
import {searchIcon, searchAcronym}  from '../API/helpers';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {fetchUser, fetchEmployees} from '../redux/ActionCreators';

const mapDispatchToProps = dispatch => {
  return bindActionCreators({ fetchUser, fetchEmployees }, dispatch);
}

const mapStateToProps = state => {
  return {
    currentUser: state.currentUser,
    employees: state.employees
  }
}

class StatisticsScreen extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      currentMonth: null,
      emtpyEntries: false,
      showModal: false,
      entries: [],
      username: '',
      relaxatCounter:0, mehCounter:0, estressatCounter:0, //state counters
      estressatCounter:0, tasquesCounter:0, volumCounter:0, horarisCounter:0, participacioCounter:0, perspectivaCounter:0, paperCounter:0, relacionsCounter:0, culturaCounter:0, familiaCounter:0, altresCounter:0, //total activities counters
      r_tasquesCounter:0, r_volumCounter:0, r_horarisCounter:0, r_participacioCounter:0, r_perspectivaCounter:0, r_paperCounter:0, r_relacionsCounter:0, r_culturaCounter:0, r_familiaCounter:0, r_altresCounter:0, //relaxing activities counters
      m_tasquesCounter:0, m_volumCounter:0, m_horarisCounter:0, m_participacioCounter:0, m_perspectivaCounter:0, m_paperCounter:0, m_relacionsCounter:0, m_culturaCounter:0, m_familiaCounter:0, m_altresCounter:0, //meh activities counters
      e_tasquesCounter:0, e_volumCounter:0, e_horarisCounter:0, e_participacioCounter:0, e_perspectivaCounter:0, e_paperCounter:0, e_relacionsCounter:0, e_culturaCounter:0, e_familiaCounter:0, e_altresCounter:0, //stressful activities counters
      ids: []
    }
  }

  componentDidMount() { 
    const uid = Firebase.auth().currentUser.uid;

    if(uid) {
      //fetch current user and employees of the same company
      this.props.fetchEmployees(this.props.currentUser.user.companyName, uid);
      this.setState({username: this.props.currentUser.user.username})
    }

    db.collection('users').doc(uid).collection('entries')
      .onSnapshot((querySnapshot) => {
        if (querySnapshot.empty) {
          this.setState({emptyEntries: true})
          return;
        } else {
          const list = [];
          const ids = [];
          querySnapshot.forEach(doc => {
            let dateJS = doc.data().entries.date.toDate(); //Sun Nov 10 2019 10:07:39 GTM+0100 (CET)       
            let dateText = moment(dateJS).format("DD-MM-YYYY"); //10-11-2019 //2019-11-10
            if (dateJS.getMonth() == new Date().getMonth() && dateJS.getFullYear() == new Date().getFullYear()) {
              ids.push(doc.id);
              list.push({
                id: doc.id, 
                dateText,
                state: doc.data().entries.state
              });
              
              if (this.state.ids.indexOf(doc.id) === -1) { 
                // Set counters for statistics
                this.updateStateCounter(doc.data().entries.state);
                this.updateActivityCounter(doc.data().entries.activity);
                if(doc.data().entries.state === "Relaxat")
                  this.updateRActivityCounter(doc.data().entries.activity);
                if(doc.data().entries.state === "Meh")
                  this.updateMActivityCounter(doc.data().entries.activity);
                if(doc.data().entries.state === "Estressat")
                  this.updateEActivityCounter(doc.data().entries.activity);
              }
            }
          });
          if (list.length == 0){
            this.setState({emptyEntries: true});
          } else {
            this.setState({ entries: list, emptyEntries: false, ids: ids });
          }
          return;
        }
    });
  }

  resetStates() {

    this.setState({
      entries: [],
      relaxatCounter: 0, mehCounter: 0, estressatCounter: 0, 
      tasquesCounter: 0, volumCounter: 0, horarisCounter:0, participacioCounter:0, perspectivaCounter:0, paperCounter:0, relacionsCounter:0, culturaCounter:0, familiaCounter:0, altresCounter:0, 
      r_tasquesCounter:0, r_volumCounter:0, r_horarisCounter:0, r_participacioCounter:0, r_perspectivaCounter:0, r_paperCounter:0, r_relacionsCounter:0, r_culturaCounter:0, r_familiaCounter:0, r_altresCounter:0,
      m_tasquesCounter:0, m_volumCounter:0, m_horarisCounter:0, m_participacioCounter:0, m_perspectivaCounter:0, m_paperCounter:0, m_relacionsCounter:0, m_culturaCounter:0, m_familiaCounter:0, m_altresCounter:0,
      e_tasquesCounter:0, e_volumCounter:0, e_horarisCounter:0, e_participacioCounter:0, e_perspectivaCounter:0, e_paperCounter:0, e_relacionsCounter:0, e_culturaCounter:0, e_familiaCounter:0, e_altresCounter:0,
      ids: []
    });
  }
  
  updateStateCounter(state) {
    switch(state) {
      case 'Relaxat':
        this.setState({ relaxatCounter: this.state.relaxatCounter + 1 });
        break;
      case 'Meh':
        this.setState({ mehCounter: this.state.mehCounter + 1 });
        break;
      case 'Estressat':
        this.setState({ estressatCounter: this.state.estressatCounter + 1 });
        break;
    }
  }

  updateActivityCounter(activity) {
    switch(activity) {
      case "Tasques":
        this.setState({tasquesCounter: this.state.tasquesCounter + 1});
        break;
      case "Volum/ritme de treball":
        this.setState({volumCounter: this.state.volumCounter + 1});
        break;
      case "Horaris":
        this.setState({horarisCounter: this.state.horarisCounter + 1});
        break;
      case "Participació/control":
        this.setState({participacioCounter: this.state.participacioCounter + 1});
        break;
      case "Perspectiva professional":
        this.setState({perspectivaCounter: this.state.perspectivaCounter + 1});
        break;
      case "Paper en l'empresa":
        this.setState({paperCounter: this.state.paperCounter + 1});
        break;
      case "Relacions interpersonals":
        this.setState({relacionsCounter: this.state.relacionsCounter + 1});
        break;
      case "Cultura d'empresa":
        this.setState({culturaCounter: this.state.culturaCounter + 1});
        break;
      case "Relació feina/familia":
        this.setState({familiaCounter: this.state.familiaCounter + 1});
        break;
      case "Altres":
        this.setState({altresCounter: this.state.altresCounter + 1});
        break;
    }
  }

  updateRActivityCounter(activity) {
    switch(activity) {
      case "Tasques":
        this.setState({r_tasquesCounter: this.state.r_tasquesCounter + 1});
        break;
      case "Volum/ritme de treball":
        this.setState({r_volumCounter: this.state.r_volumCounter + 1});
        break;
      case "Horaris":
        this.setState({r_horarisCounter: this.state.r_horarisCounter + 1});
        break;
      case "Participació/control":
        this.setState({r_participacioCounter: this.state.r_participacioCounter + 1});
        break;
      case "Perspectiva professional":
        this.setState({r_perspectivaCounter: this.state.r_perspectivaCounter + 1});
        break;
      case "Paper en l'empresa":
        this.setState({r_paperCounter: this.state.r_paperCounter + 1});
        break;
      case "Relacions interpersonals":
        this.setState({r_relacionsCounter: this.state.r_relacionsCounter + 1});
        break;
      case "Cultura d'empresa":
        this.setState({r_culturaCounter: this.state.r_culturaCounter + 1});
        break;
      case "Relació feina/familia":
        this.setState({r_familiaCounter: this.state.r_familiaCounter + 1});
        break;
      case "Altres":
        this.setState({r_altresCounter: this.state.r_altresCounter + 1});
        break;
    }
  }

  updateMActivityCounter(activity) {
    switch(activity) {
      case "Tasques":
        this.setState({m_tasquesCounter: this.state.m_tasquesCounter + 1});
        break;
      case "Volum/ritme de treball":
        this.setState({m_volumCounter: this.state.m_volumCounter + 1});
        break;
      case "Horaris":
        this.setState({m_horarisCounter: this.state.m_horarisCounter + 1});
        break;
      case "Participació/control":
        this.setState({m_participacioCounter: this.state.m_participacioCounter + 1});
        break;
      case "Perspectiva professional":
        this.setState({m_perspectivaCounter: this.state.m_perspectivaCounter + 1});
        break;
      case "Paper en l'empresa":
        this.setState({m_paperCounter: this.state.m_paperCounter + 1});
        break;
      case "Relacions interpersonals":
        this.setState({m_relacionsCounter: this.state.m_relacionsCounter + 1});
        break;
      case "Cultura d'empresa":
        this.setState({m_culturaCounter: this.state.m_culturaCounter + 1});
        break;
      case "Relació feina/familia":
        this.setState({m_familiaCounter: this.state.m_familiaCounter + 1});
        break;
      case "Altres":
        this.setState({m_altresCounter: this.state.m_altresCounter + 1});
        break;
    }
  }

  updateEActivityCounter(activity) {
    switch(activity) {
      case "Tasques":
        this.setState({e_tasquesCounter: this.state.e_tasquesCounter + 1});
        break;
      case "Volum/ritme de treball":
        this.setState({e_volumCounter: this.state.e_volumCounter + 1});
        break;
      case "Horaris":
        this.setState({e_horarisCounter: this.state.e_horarisCounter + 1});
        break;
      case "Participació/control":
        this.setState({e_participacioCounter: this.state.e_participacioCounter + 1});
        break;
      case "Perspectiva professional":
        this.setState({e_perspectivaCounter: this.state.e_perspectivaCounter + 1});
        break;
      case "Paper en l'empresa":
        this.setState({e_paperCounter: this.state.e_paperCounter + 1});
        break;
      case "Relacions interpersonals":
        this.setState({e_relacionsCounter: this.state.e_relacionsCounter + 1});
        break;
      case "Cultura d'empresa":
        this.setState({e_culturaCounter: this.state.e_culturaCounter + 1});
        break;
      case "Relació feina/familia":
        this.setState({e_familiaCounter: this.state.e_familiaCounter + 1});
        break;
      case "Altres":
        this.setState({e_altresCounter: this.state.e_altresCounter + 1});
        break;
    }
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
            if (querySnapshot.empty) {
              this.setState({emptyEntries: true, showModal: false})
              return;
            } else {
              const list = [];
              const ids = [];
              querySnapshot.forEach(doc => {
                let dateJS = doc.data().entries.date.toDate(); //Sun Nov 10 2019 10:07:39 GTM+0100 (CET)       
                let dateText = moment(dateJS).format("DD-MM-YYYY"); //10-11-2019 //2019-11-10
                if (dateJS.getMonth() == new Date().getMonth() && dateJS.getFullYear() == new Date().getFullYear()) {
                  ids.push(doc.id);
                  list.push({
                    id: doc.id, 
                    dateText,
                    state: doc.data().entries.state
                  });
                  // Set counters for statistics
                  if (this.state.ids.indexOf(doc.id) === -1) { 
                    this.updateStateCounter(doc.data().entries.state);
                    this.updateActivityCounter(doc.data().entries.activity);
                    if(doc.data().entries.state === "Relaxat") 
                      this.updateRActivityCounter(doc.data().entries.activity);
                    if(doc.data().entries.state === "Meh")
                      this.updateMActivityCounter(doc.data().entries.activity);
                    if(doc.data().entries.state === "Estressat")
                      this.updateEActivityCounter(doc.data().entries.activity);
                  }
                }
              });
              if (list.length == 0){  
                this.setState({emptyEntries: true, showModal: false});
              } else {
                this.setState({entries: list, emptyEntries: false, ids: ids, showModal: false});
              }
              return;
            }
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
        <Text style={{ marginLeft: 10 }}>
          {item.username}
        </Text>
        <Ionicons 
          name='ios-arrow-round-forward' 
          size={40} 
          color={Colors.darkGray} 
          style={styles.nameIcon}
          onPress={() => this.getEmployeeStatistics(item.id)}
        />
      </View>
    );
  }

  renderModal() {
    return(
      <Modal
        animationType='slide'
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
          style={styles.nameIcon}/>
      </TouchableOpacity>
    );
  }

  setMonth(){
    let date = new Date()
    let month = date.getMonth(); //Note: 0=January, 1=February etc
    let year = date.getFullYear(); 
    let currentMonth = null;
    switch(month){
      case 0:
        currentMonth = "Gener"
        break;
      case 1:
        currentMonth = "Febrer"
        break;
      case 2:
        currentMonth = "Març"
        break;
      case 3:
        currentMonth = "Abril"
        break;
      case 4:
        currentMonth = "Maig"
        break;
      case 5:
        currentMonth = "Juny"
        break;
      case 6:
        currentMonth = "Juliol"
        break;
      case 7:
        currentMonth = "Agost"
        break;
      case 8:
        currentMonth = "Setembre"
        break;
      case 9:
        currentMonth = "Octubre"
        break;
      case 10:
        currentMonth = "Novembre"
        break;
      case 11:
        currentMonth = "Desembre"
        break;
    }
    
    return(
      <Text style={styles.title}>{currentMonth + " " + year}</Text>
    );
  } 

  render() {
    if (!this.state.emptyEntries) {
      if(this.state.entries[0] != null) {
        let stateData = [
          { x: "Estressat", y: this.state.estressatCounter },
          { x: "Meh", y: this.state.mehCounter },
          { x: "Relaxat", y: this.state.relaxatCounter }
        ]
        let activityData = [
          { x: "Tasques", y: this.state.tasquesCounter },
          { x: "Volum/ritme de treball", y: this.state.volumCounter },
          { x: "Horaris", y: this.state.horarisCounter },
          { x: "Participació/control", y: this.state.participacioCounter },
          { x: "Perspectiva professional", y: this.state.perspectivaCounter },
          { x: "Paper en l'empresa", y: this.state.paperCounter },
          { x: "Relacions interpersonals", y: this.state.relacionsCounter },
          { x: "Cultura d'empresa", y: this.state.culturaCounter },
          { x: "Relació feina/familia", y: this.state.familiaCounter },
          { x: "Altres", y: this.state.altresCounter }
        ]
        return(    
          <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
            {this.props.currentUser.user.isAdmin ? this.renderUsername() : null}
            {this.renderModal()}
            {this.setMonth()}
            <MonthlyStatesComponent data={this.state.entries}/>
            <StateCounterComponent data={stateData}/>
            <ActivityCounterComponent data={activityData}/>
            <GoTogetherComponent 
              r_tasquesCounter={this.state.r_tasquesCounter}
              r_volumCounter={this.state.r_volumCounter}
              r_horarisCounter={this.state.r_horarisCounter}
              r_participacioCounter={this.state.r_participacioCounter}
              r_perspectivaCounter={this.state.r_perspectivaCounter}
              r_paperCounter={this.state.r_paperCounter}
              r_relacionsCounter={this.state.r_relacionsCounter}
              r_culturaCounter={this.state.r_culturaCounter}
              r_familiaCounter={this.state.r_familiaCounter}
              r_altresCounter={this.state.r_altresCounter}
              m_tasquesCounter={this.state.m_tasquesCounter}
              m_volumCounter={this.state.m_volumCounter}
              m_horarisCounter={this.state.m_horarisCounter}
              m_participacioCounter={this.state.m_participacioCounter}
              m_perspectivaCounter={this.state.m_perspectivaCounter}
              m_paperCounter={this.state.m_paperCounter}
              m_relacionsCounter={this.state.m_relacionsCounter}
              m_culturaCounter={this.state.m_culturaCounter}
              m_familiaCounter={this.state.m_familiaCounter}
              m_altresCounter={this.state.m_altresCounter}
              e_tasquesCounter={this.state.e_tasquesCounter}
              e_volumCounter={this.state.e_volumCounter}
              e_horarisCounter={this.state.e_horarisCounter}
              e_participacioCounter={this.state.e_participacioCounter}
              e_perspectivaCounter={this.state.e_perspectivaCounter}
              e_paperCounter={this.state.e_paperCounter}
              e_relacionsCounter={this.state.e_relacionsCounter}
              e_culturaCounter={this.state.e_culturaCounter}
              e_familiaCounter={this.state.e_familiaCounter}
              e_altresCounter={this.state.e_altresCounter}
            />
          </ScrollView>
        );
      } else {
        return(
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={Colors.darkGray} />
            </View>     
        );
      }
    } else {
      return(
        <View style={styles.container}>
          {this.props.currentUser.user.isAdmin ? this.renderUsername() : null}
          {this.renderModal()}
          <Text style={styles.emptyEntries}>No hi ha cap entrada pujada</Text>
        </View>
      );
    }
  }
}

class MonthlyStatesComponent extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      items: []
    }
  }

  componentWillMount() {
    var items = [];
    
    this.props.data.map(item => {
      let str = JSON.stringify(item);
      str = str.substring(1, str.length-1);
      let d = str.split(",")[1].split(":")[1].split("-")[0].substr(1); //entry day
      let s = str.split(",")[2].split(":")[1].substr(1);
      s = s.substring(0, s.length-1); //entry state

      items.push({ x:d, y:s });
      items.sort(this.sortEntries);

      this.setState({items: items});
    });
  }

  componentDidUpdate(prevProps) {
    if(prevProps.data.length != this.props.data.length) {
      var items = [];
    
      this.props.data.map(item => {
        let str = JSON.stringify(item);
        str = str.substring(1, str.length-1);
        let d = str.split(",")[1].split(":")[1].split("-")[0].substr(1); //entry day
        let s = str.split(",")[2].split(":")[1].substr(1);
        s = s.substring(0, s.length-1); //entry state

        items.push({ x:d, y:s });
        items.sort(this.sortEntries);

        this.setState({items: items});
      });
    }
  }

  sortEntries(a, b) {
    const xA = a.x;
    const xB = b.x;

    let comparison = 0;
    if (xA > xB) {
      comparison = 1;
    } else if (xA < xB) {
      comparison = -1;
    }
    return comparison;
  }

  getLabel(t){
    if(t.charAt(0) == 0) {
      t = t.substr(1);
    } 
    return t;
  }

  render() {
    return (
      <Animatable.View style={styles.contentContainer} animation="fadeIn" duration={1000} delay={1000}>
        <Card containerStyle={styles.card}>
            <View style={styles.cardTitleContainer}>
              <Text style={styles.cardTitleText}>Estats mensuals</Text>
            </View>
            <ScrollView horizontal={true}>
            <View style={styles.cardContent}>
              <VictoryChart
                theme={VictoryTheme.material}
                width={this.props.data.length * 25} 
                height={150}
              >
                <VictoryScatter
                  style={{ data: { fill: Colors.yellow } }}
                  size={5}
                  data={this.state.items}
                  style={{
                    data: {
                      fill: ({ datum }) => datum.y === "Relaxat" ? Colors.green : (datum.y === "Meh" ? Colors.yellow : Colors.red),
                      stroke: ({ datum }) => datum.y === "Relaxat" ? Colors.green : (datum.y === "Meh" ? Colors.yellow : Colors.red),
                      fillOpacity: 0.5,
                      strokeWidth: 3
                    }
                  }}
                />
                <VictoryAxis crossAxis
                  tickFormat={(t) => `${this.getLabel(t)}`}
                  style={{
                    tickLabels: {fontSize: 12, padding: 5}
                  }}
                />
              </VictoryChart>
            </View>
          </ScrollView>
        </Card>
      </Animatable.View>
    );
  }
}

class StateCounterComponent extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      selectedIndex: 0
    }
    this.updateIndex = this.updateIndex.bind(this)
  }

  updateIndex(selectedIndex) {
    this.setState({selectedIndex});
  }

  chartElement(type) {
    switch (type) {
      case 0:
        return(
          <VictoryPie
            width={230} height={230}
            innerRadius={100}
            colorScale={[Colors.red, Colors.yellow, Colors.green]}
            data={this.props.data}
            labels={({ datum }) => `${datum.y}`} //{({ datum }) => `${datum.x}: ${datum.y}`}//
          />
        );
      case 1:
        return(
          <VictoryChart 
            theme={VictoryTheme.material} 
            domainPadding={10}
            width={230} height={230}
          >
            <VictoryBar
              style={{ data: { fill: ({ datum }) => datum.x == 'Relaxat' ? Colors.green : (datum.x == 'Meh' ? Colors.yellow : Colors.red) } }}
              data={this.props.data}
            />
          </VictoryChart>
        );
    }
  }

  render() {
    return (
      <Animatable.View style={styles.contentContainer} animation="fadeIn" duration={1000} delay={1000}>
        <Card containerStyle={styles.card}>
          <View style={styles.cardTitleContainer}>
            <Text style={styles.cardTitleText}>
              Comptador mensual d'estats
            </Text>
          </View>
          <View style={styles.buttonGroupContainer}>
            <ButtonGroup
              onPress={this.updateIndex}
              selectedIndex={this.state.selectedIndex}
              selectedButtonStyle={{ backgroundColor: Colors.darkGray }}
              buttons={['Circular', 'Barres']}
              containerStyle={{ height: 30, borderColor: Colors.lightGray, backgroundColor: Colors.lightGray }}
              innerBorderStyle={{ width: 0 }}
              buttonStyle={{ borderRadius: 15 }}
              textStyle={{ color: Colors.darkGray }}
            />
          </View>
          <View style={styles.cardContent}>
            {this.chartElement(this.state.selectedIndex)}
          </View>
        </Card>
      </Animatable.View>
    );
  }
}

class ActivityCounterComponent extends React.Component{
  constructor(props){
    super(props);
  }

  render() {
    return (
      <Animatable.View style={styles.contentContainer} animation="fadeIn" duration={1000} delay={1000}>
        <Card containerStyle={styles.card}>
          <View style={styles.cardTitleContainer}>
            <Text style={styles.cardTitleText}>
              Comptador mensual d'activitats
            </Text>
          </View>
          <View style={styles.activitySelector}>
            { this.props.data.map((activity, index) => {
              if (activity.y > 0) {
                return(
                  <TouchableOpacity key={index} style={styles.activityButton}>
                    <Ionicons 
                      name={searchIcon(activity.x)} 
                      size={30} 
                      style={{ padding: 5, textAlign: 'center'}} 
                      color={Colors.darkGray}
                    />
                    <Badge 
                      value={activity.y} 
                      badgeStyle={{backgroundColor: Colors.darkGray}}
                      containerStyle={{ position: 'absolute', top: 25, right: 15 }} 
                    />
                    <Text style={styles.imageTextActivity}>{activity.x}</Text>
                  </TouchableOpacity>
                );
              }
            }) }
          </View>
        </Card>
      </Animatable.View>
    );
  }
}

class GoTogetherComponent extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      selectedIndex: 0
    }
    this.updateIndex = this.updateIndex.bind(this)
  }

  updateIndex(selectedIndex) {
    this.setState({selectedIndex});
  }

  getRelaxatActivities() {
    let activityData = [
      { x: "Tasques", y: this.props.r_tasquesCounter },
      { x: "Volum/ritme de treball", y: this.props.r_volumCounter },
      { x: "Horaris", y: this.props.r_horarisCounter },
      { x: "Participació/control", y: this.props.r_participacioCounter },
      { x: "Perspectiva professional", y: this.props.r_perspectivaCounter },
      { x: "Paper en l'empresa", y: this.props.r_paperCounter },
      { x: "Relacions interpersonals", y: this.props.r_relacionsCounter },
      { x: "Cultura d'empresa", y: this.props.r_culturaCounter },
      { x: "Relació feina/familia", y: this.props.r_familiaCounter },
      { x: "Altres", y: this.props.r_altresCounter }
    ]
    return activityData;
  }

  getMehActivities() {
    let activityData = [
      { x: "Tasques", y: this.props.m_tasquesCounter },
      { x: "Volum/ritme de treball", y: this.props.m_volumCounter },
      { x: "Horaris", y: this.props.m_horarisCounter },
      { x: "Participació/control", y: this.props.m_participacioCounter },
      { x: "Perspectiva professional", y: this.props.m_perspectivaCounter },
      { x: "Paper en l'empresa", y: this.props.m_paperCounter },
      { x: "Relacions interpersonals", y: this.props.m_relacionsCounter },
      { x: "Cultura d'empresa", y: this.props.m_culturaCounter },
      { x: "Relació feina/familia", y: this.props.m_familiaCounter },
      { x: "Altres", y: this.props.m_altresCounter }
    ]
    return activityData;
  }

  getEstressatActivities(){
    let activityData = [
      { x: "Tasques", y: this.props.e_tasquesCounter },
      { x: "Volum/ritme de treball", y: this.props.e_volumCounter },
      { x: "Horaris", y: this.props.e_horarisCounter },
      { x: "Participació/control", y: this.props.e_participacioCounter },
      { x: "Perspectiva professional", y: this.props.e_perspectivaCounter },
      { x: "Paper en l'empresa", y: this.props.e_paperCounter },
      { x: "Relacions interpersonals", y: this.props.e_relacionsCounter },
      { x: "Cultura d'empresa", y: this.props.e_culturaCounter },
      { x: "Relació feina/familia", y: this.props.e_familiaCounter },
      { x: "Altres", y: this.props.e_altresCounter }
    ]
    return activityData;
  }

  renderActivities(activities) {
    let iconStyle = this.state.selectedIndex == 0 ? Colors.green : (this.state.selectedIndex == 1 ? Colors.yellow : Colors.red)

    return activities.map((activity, index) => {
      if(activity.y > 0) {
        return(
          <TouchableOpacity key={index} style={styles.activityButton}>
            <Ionicons 
              name={searchIcon(activity.x)} 
              size={30} 
              style={{ padding: 5, textAlign: 'center'}} 
              color={iconStyle} 
            />
            <Badge 
              value={activity.y} 
              badgeStyle={{backgroundColor: iconStyle}}
              containerStyle={{ position: 'absolute', top: 25, right: 15 }} 
            />
            <Text style={styles.imageTextActivity}>{activity.x}</Text>
          </TouchableOpacity>
        );
      }
    });   
  }

  togetherElement(type){
    switch (type) {
      case 0:
        var activities = this.getRelaxatActivities();
        break;
      case 1:
        var activities = this.getMehActivities();
        break;
      case 2:
        var activities = this.getEstressatActivities();
        break;
    }
    return this.renderActivities(activities);
  }
  
  render() {
    let buttonStyle = this.state.selectedIndex == 0 ? Colors.green : (this.state.selectedIndex == 1 ? Colors.yellow : Colors.red)
    return (
      <Animatable.View style={styles.contentContainer} animation="fadeIn" duration={1000} delay={1000}>
        <Card containerStyle={styles.card}>
            <View style={styles.cardTitleContainer}>
              <Text style={styles.cardTitleText}>Solen anar junts</Text>
            </View>
            <View style={styles.buttonGroupContainer}>
              <ButtonGroup
                onPress={this.updateIndex}
                selectedIndex={this.state.selectedIndex}
                selectedButtonStyle={{ backgroundColor: buttonStyle }}
                buttons={['Relaxat', 'Meh', 'Estressat']}
                containerStyle={{ height: 30, borderColor: Colors.lightGray, backgroundColor: Colors.lightGray }}
                innerBorderStyle={{ width: 0 }}
                buttonStyle={{ borderRadius: 15 }}
                textStyle={{ color: Colors.darkGray }}
              />
            </View>
            <View style={styles.activitySelector}>
              {this.togetherElement(this.state.selectedIndex)}
           </View>
        </Card>
      </Animatable.View>
    );
  }
}

StatisticsScreen.navigationOptions = {
  title: 'Estadístiques',
  headerStyle: { backgroundColor: Colors.yellow, elevation: 0 },
  headerTintColor: Colors.white
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.lightGray,
    width: '100%'
  },
  contentContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%'
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: Colors.lightGray,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center'
  },
  title: {
    fontSize: 16,
    margin: 10,
    letterSpacing: 1.5,
    color: Colors.darkGray,
    fontWeight: 'bold',
  },  
  emptyEntries: {
    margin: 15,
    marginTop: 50,
    padding: 50,
    borderRadius: 5,
    backgroundColor: Colors.lightGray,
    borderWidth: 1,
    borderColor: '#dfe3e6',
    color: 'rgba(96,100,109, 1)',
    textAlign: 'center'
  },
  nameContainer: {
    width: '100%',
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
    right: 20, 
    position: 'absolute', 
    opacity: 0.8 
  },
  card: {
    padding: 0,
    elevation: 0,
    borderWidth: 0,
    borderRadius: 3,
    borderTopWidth: 3,
    marginTop: 0,
    marginBottom: 10,
    borderColor: Colors.darkGray,
    width: '90%'
  },
  cardTitleContainer: {
    backgroundColor: '#ebeeef',
    padding: 5,
    paddingLeft: 15
  },
  cardTitleText: {
    color: Colors.darkGray,
    fontWeight: 'bold',
    textAlign: 'left'
  },
  cardContent: {
    justifyContent: 'center',
    alignItems: 'center'
  },
  buttonGroupContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.lightGray
  },
  activitySelector: {
    flexDirection: 'row',
    justifyContent: 'center',
    flexWrap: 'wrap',
  },
  activityButton: {
    paddingBottom: 10
  },  
  imageTextActivity: {
    textAlign: 'center',
    width: 70,
    fontSize: 11,
    color: Colors.darkGray
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
});

export default connect(mapStateToProps, mapDispatchToProps)(StatisticsScreen);