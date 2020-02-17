import React from 'react';
import renderer from 'react-test-renderer';
import configureStore from 'redux-mock-store';
import StatisticsScreen from '../screens/StatisticsScreen';
import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import {shallow} from 'enzyme';

Enzyme.configure({ adapter: new Adapter() });

const mockStore = configureStore([]);

describe('<StatisticsScreen />', () => {
    let store, 
      wrapper, 
      initialState = {employees: "testEmployees", currentUser: "testCurrentUser"};

    beforeEach(() => {
      store = mockStore(initialState);
      wrapper = shallow(<StatisticsScreen store={store} />);
    });

    it('should render with given state from Redux store', () => {
      expect(wrapper.length).toEqual(1);      
    });

    it('check Prop matches with initialState', () => {
      expect(wrapper.find('StatisticsScreen').prop('employees')).toEqual(initialState.employees); 
      expect(wrapper.find('StatisticsScreen').prop('currentUser')).toEqual(initialState.currentUser); 
    });  
});

