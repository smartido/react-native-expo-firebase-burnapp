import React from 'react';
import {createStackNavigator, createBottomTabNavigator, createDrawerNavigator, createSwitchNavigator, DrawerItems, SafeAreaView} from 'react-navigation';
import HomeScreen from '../screens/HomeScreen';
import EmployeesScreen from '../screens/EmployeesScreen';
import EntriesScreen from '../screens/EntriesScreen';
import StatisticsScreen from '../screens/StatisticsScreen';
import CalendarScreen from '../screens/CalendarScreen';
import Logout from '../screens/Logout';
import {ScrollView, View, Text, StyleSheet} from 'react-native';
import {Ionicons} from '@expo/vector-icons';
import Colors from '../API/Colors';

/** 
 * Inici 
 */
const HomeStack = createStackNavigator({
  Home: { 
    screen: HomeScreen,
    navigationOptions: ({ navigation }) => ({
      headerRight: <Ionicons name='md-more' size={30} color={Colors.white} onPress={() => navigation.toggleDrawer()} style={{ paddingRight: 15 }}/>
    })
  }
});

HomeStack.navigationOptions = {
  tabBarLabel: 'Inici',
  tabBarOptions: {activeTintColor: Colors.yellow},
  tabBarIcon: ({ focused }) => (
    <Ionicons name='ios-home' size={30} style={{ marginBottom: -3 }} color={focused ? Colors.tabIconSelected : Colors.tabIconDefault}/>
  ),
};

HomeStack.path = '';

/** 
 * Empleats 
 */
const EmployeesStack = createStackNavigator({
  Employees: {
    screen: EmployeesScreen,
    navigationOptions: ({ navigation }) => ({
      headerRight: <Ionicons name='md-more' size={30} color={Colors.white} onPress={() => navigation.toggleDrawer()} style={{ paddingRight: 15 }}/>
    })
  }
});

EmployeesStack.navigationOptions = {
  tabBarLabel: 'Empleats',
  tabBarOptions: {activeTintColor: Colors.yellow},
  tabBarIcon: ({ focused }) => (
    <Ionicons name='ios-people' size={30} style={{ marginBottom: -3 }} color={focused ? Colors.tabIconSelected : Colors.tabIconDefault}/>
  ),
};

EmployeesStack.path = '';

/** 
 * Entrades 
 */
const EntriesStack = createStackNavigator({
  Entries: {
    screen: EntriesScreen,
    navigationOptions: ({ navigation }) => ({
      headerRight: <Ionicons name='md-more' size={30} color={Colors.white} onPress={() => navigation.toggleDrawer()} style={{ paddingRight: 15 }}/>
    })
  }
});

EntriesStack.navigationOptions = {
  tabBarLabel: 'Entrades',
  tabBarOptions: {activeTintColor: Colors.yellow},
  tabBarIcon: ({ focused }) => (
    <Ionicons name='ios-add' size={30} style={{ marginBottom: -3 }} color={focused ? Colors.tabIconSelected : Colors.tabIconDefault}/>
  ),
};

EntriesStack.path = '';

/** 
 * Estadístiques
 */
const StatisticsStack = createStackNavigator({
  Statistics: {
    screen: StatisticsScreen, 
    navigationOptions: ({ navigation }) => ({
      headerRight: <Ionicons name='md-more' size={30} color={Colors.white} onPress={() => navigation.toggleDrawer()} style={{ paddingRight: 15 }}/>
    })
  }
});

StatisticsStack.navigationOptions = {
  tabBarLabel: 'Estadístiques',
  tabBarOptions: {activeTintColor: Colors.yellow},
  tabBarIcon: ({ focused }) => (
    <Ionicons name='ios-stats' size={30} style={{ marginBottom: -3 }} color={focused ? Colors.tabIconSelected : Colors.tabIconDefault}/>
  ),
};

StatisticsStack.path = '';

/** 
 * Calendari
 */
const CalendarStack = createStackNavigator({
  Calendar: {
    screen: CalendarScreen, 
    navigationOptions: ({ navigation }) => ({
      headerRight: <Ionicons name='md-more' size={30} color={Colors.white} onPress={() => navigation.toggleDrawer()} style={{ paddingRight: 15 }}/>
    })
  }
});

CalendarStack.navigationOptions = {
  tabBarLabel: 'Calendari',
  tabBarOptions: {activeTintColor: Colors.yellow},
  tabBarIcon: ({ focused }) => (
    <Ionicons name='md-calendar' size={30} style={{ marginBottom: -3 }} color={focused ? Colors.tabIconSelected : Colors.tabIconDefault}/>
  ),
};

CalendarStack.path = '';

const tabNavigator = createBottomTabNavigator({
  HomeStack,
  EmployeesStack,
  EntriesStack,
  StatisticsStack,
  CalendarStack
});

tabNavigator.path = '';

/**
 * DrawerNavigator
 */
const CustomDrawerContentComponent = (props) => (
  <ScrollView>
    <SafeAreaView style={styles.container} forceInset={{ top: 'always', horizontal: 'never' }}>
      <View style={styles.drawerHeader}>
          <Ionicons 
            name='ios-flame' 
            size={60} 
            color={Colors.white} 
            style={{ margin: 20 }}
          />
          <Text style={styles.drawerHeaderText}>BurnApp</Text>
      </View>
      <DrawerItems {...props}/>
    </SafeAreaView>
  </ScrollView>
);

const Drawer = createDrawerNavigator({
  Fet: {
    screen: tabNavigator,
    navigationOptions: {
      title: 'Fet',
      drawerLabel: 'Fet',
      drawerIcon: <Ionicons name='ios-checkmark' size={30} color={Colors.white}/>
    }
  },
  Sortir: {
    screen: Logout,
    navigationOptions: {
      title: 'Sortir',
      drawerLabel: 'Sortir',
      drawerIcon: <Ionicons name='ios-log-out' size={30} color={Colors.white}/>
    }
  }
}, {
  drawerBackgroundColor: Colors.yellow,
  drawerPosition: 'right',
  contentComponent: CustomDrawerContentComponent,
  contentOptions: {
    activeTintColor: Colors.white,
    inactiveTintColor: Colors.white
  }
})

const Navigators = createSwitchNavigator({
  Drawer: { screen: Drawer }
});

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  drawerHeader: {
    backgroundColor: Colors.yellow,
    height: 140,
    alignItems: 'center',
    flex: 1,
    flexDirection: 'row'
  },
  drawerHeaderText: {
    color: Colors.white,
    fontSize: 25,
    fontWeight: 'bold'
  }
});

export default Navigators;