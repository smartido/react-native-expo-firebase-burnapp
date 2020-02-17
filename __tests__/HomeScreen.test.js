import React from 'react';
import renderer from 'react-test-renderer';
import configureStore from 'redux-mock-store';
import HomeScreen from '../screens/HomeScreen';
import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import {shallow} from 'enzyme';

Enzyme.configure({ adapter: new Adapter() });

const mockStore = configureStore([]);

describe('<HomeScreen />', () => {
    let store, 
      wrapper, 
      initialState = {entries: "testEntries", currentUser: "testCurrentUser"};

    beforeEach(() => {
      store = mockStore(initialState);
      wrapper = shallow(<HomeScreen store={store} />);
    });

    it('should render with given state from Redux store', () => {
      expect(wrapper.length).toEqual(1);      
    });

    it('check Prop matches with initialState', () => {
      expect(wrapper.find('HomeScreen').prop('entries')).toEqual(initialState.entries); 
      expect(wrapper.find('HomeScreen').prop('currentUser')).toEqual(initialState.currentUser); 
    });  
});

