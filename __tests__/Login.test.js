import React from 'react';
import renderer from 'react-test-renderer';
import configureStore from 'redux-mock-store';
import Login from '../screens/Login';
import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import {shallow } from 'enzyme';
import {updatePassword, updateEmail, login} from '../redux/ActionCreators';
import {users} from '../redux/users';

Enzyme.configure({ adapter: new Adapter() });

const mockStore = configureStore([]);

describe('<Login />', () => {
    let store, 
      wrapper, 
      initialState = {users: "test"};

    beforeEach(() => {
      store = mockStore(initialState);
      wrapper = shallow(<Login store={store}/>);
    });

    it('should render with given state from Redux store', () => {
      expect(wrapper.find('Login').length).toEqual(1);      
    });

    it('check Prop matches with initialState', () => {
      expect(wrapper.find('Login').prop('user')).toEqual(initialState.users);
    });

    it('check actionCreator: test updateEmail', () => {
      const action = updateEmail("smartido@uoc.edu")
      expect(action).toEqual({type:"UPDATE_EMAIL", payload:"smartido@uoc.edu"});
    });

    it('check actionCreator: test updatePassword', () => {
      const action = updatePassword("password")
      expect(action).toEqual({type:"UPDATE_PASSWORD", payload:"password"});
    });

    it('check reducer: test updateEmail', () => {
      let state = {email: "hola@uoc.edu"}
      state = users(state, {type:"UPDATE_EMAIL", payload: "smartidoa@uoc.edu"});
      expect(state).toEqual({email: "smartidoa@uoc.edu"});
    });

    it('check reducer: test updatePassword', () => {
      let state = {password: "password1"}
      state = users(state, {type:"UPDATE_PASSWORD", payload: "password2"});
      expect(state).toEqual({password: "password2"});
    });

    it('capturing Snapshot of Login', () => {
      const tree =  renderer.create(<Login store={store}/>).toJSON()
      expect(tree).toMatchSnapshot();
    });
});


