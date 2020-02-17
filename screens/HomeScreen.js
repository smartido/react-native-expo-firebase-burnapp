import React from 'react';
import {ScrollView, StyleSheet, Text, View, FlatList, Image, ActivityIndicator} from 'react-native';
import {Card} from 'react-native-elements';
import * as Animatable from 'react-native-animatable';
import Colors from '../API/Colors';
import {Ionicons} from '@expo/vector-icons';
import Firebase from '../Firebase.js';
import {searchEmoji, searchIcon}  from '../API/helpers';
import {bindActionCreators } from 'redux';
import {connect} from 'react-redux';
import {fetchUser, fetchEntries} from '../redux/ActionCreators';

const mapDispatchToProps = dispatch => {
  return bindActionCreators({ fetchUser, fetchEntries }, dispatch)
}

const mapStateToProps = state => {
  return {
    entries: state.entries,
    currentUser: state.currentUser
  }
}

class HomeScreen extends React.Component {
  constructor(props){
    super(props);
  }

  componentDidMount() {
    const uid = Firebase.auth().currentUser.uid;
    if(uid) {
      //fetch current user and entries
      this.props.fetchUser(uid);
      this.props.fetchEntries(uid, true);
    }
  } 

  renderEntries() {
    if(this.props.entries.entries.length > 0) {
      return(
        <ScrollView style={styles.entriesContainer}>
          <Animatable.View animation="fadeIn" duration={1000} delay={1000}>
            <FlatList 
              data={this.props.entries.entries}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => <EntryComponent {...item} />}
            />
          </Animatable.View>
        </ScrollView>
      );
    } else {
      return(
        <View style={{width: '100%'}}>
          <Text style={styles.emptyEntries}>No hi ha cap entrada pujada</Text>
        </View>
      );
    }
  }

  render() {
    if(!this.props.currentUser.isLoading && this.props.currentUser.user) {
      let name = this.props.currentUser.user.username.split(" ")[0];
      return(
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.welcomeText}>{"Hola de nou, " + name}</Text>
            <Text style={styles.welcomeSubtitle}>Aquestes són les teves últimes entrades</Text>
          </View>
          <View style={styles.body}>
            {this.renderEntries()}
          </View>
        </View>
      );
    } else {
      return(
        <View style={styles.container}>
          <ActivityIndicator size="large" color={Colors.darkGray} />
        </View>
      ); 
    }
  }
}

function EntryComponent({ dateText, state, activity, comment }) {
  return(
    <Card containerStyle={ state == "Relaxat" ? styles.cardRelaxat : (state == "Meh" ? styles.cardMeh : styles.cardEstressat) }>
      <View style={styles.cardTitleContainer}>
        <Text style={styles.cardTitleText}>
          {dateText}
        </Text>
      </View>
      <View style={styles.cardContent}>
        <Image style={styles.emoji} source={searchEmoji(state)} />
        <View>
          <Text style={styles.entryTitle}>
            {state}
          </Text>
          <Text style={styles.entryText}>
            <Ionicons name={searchIcon(activity)} size={15} />
            {" " + activity + ". " + comment}
          </Text>
        </View>
      </View>
    </Card>
  );
}

HomeScreen.navigationOptions = {
  title: 'Inici',
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
    height: '30%',
    backgroundColor: Colors.yellow,
    justifyContent: 'flex-end',
    paddingBottom: 70
  },
  welcomeText: {
    color: Colors.white,
    fontSize: 22,
    marginLeft: 15,
    marginBottom: 5,
    fontWeight: 'bold',
  },
  welcomeSubtitle: {
    color: Colors.white,
    fontSize: 16,
    marginLeft: 15,
    opacity: 0.8 
  },
  body: {
    height: '70%',
    backgroundColor: Colors.lightGray,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyEntries: {
    margin: 15,
    padding: 50,
    borderRadius: 5,
    backgroundColor: Colors.lightGray,
    borderWidth: 1,
    borderColor: '#dfe3e6',
    color: 'rgba(96,100,109, 1)',
    textAlign: 'center'
  },
  entriesContainer: {
    width: '100%', 
    top: -60, 
    bottom: 0, 
    position: 'absolute'
  },
  cardEstressat: {
    padding: 0,
    elevation: 0,
    borderWidth: 0,
    borderRadius: 3,
    borderTopWidth: 3,
    marginTop: 0,
    marginBottom: 10,
    borderColor: Colors.red
  },
  cardRelaxat: {
    padding: 0,
    elevation: 0,
    borderWidth: 0,
    borderRadius: 3,
    borderTopWidth: 3,
    marginTop: 0,
    marginBottom: 10,
    borderColor: Colors.green
  },
  cardMeh: {
    padding: 0,
    elevation: 0,
    borderWidth: 0,
    borderRadius: 3,
    borderTopWidth: 3,
    marginTop: 0,
    marginBottom: 10,
    borderColor: Colors.darkYellow1
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
    flexDirection: 'row',
    marginLeft: 15,
    marginRight: 15,
    padding: 10,
    width: '100%'
  },
  emoji: {
    width: 45,
    height: 45,
    marginRight: 20,
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

export default connect(mapStateToProps, mapDispatchToProps)(HomeScreen);