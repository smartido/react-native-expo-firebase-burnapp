import {createAppContainer, createSwitchNavigator} from 'react-navigation';
import Login from '../screens/Login';
import Signup from '../screens/Signup';
import MainTabNavigator from './MainTabNavigator';

const SwitchNavigator = createSwitchNavigator({
    Login: Login,
    Signup: Signup,
    Main: MainTabNavigator,
  }, {
    initialRouteName: 'Login'
  }
);

export default createAppContainer(SwitchNavigator);
