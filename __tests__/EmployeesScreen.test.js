import React from 'react';
import renderer from 'react-test-renderer';
import configureStore from 'redux-mock-store';
import EmployeesScreen from '../screens/EmployeesScreen';
import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import {shallow} from 'enzyme';

Enzyme.configure({ adapter: new Adapter() });

const mockStore = configureStore([]);

describe('<EmploeesScreen />', () => {
    let store, 
      wrapper, 
      initialState = {employees: "testEmployees", currentUser: "testCurrentUser"};

    beforeEach(() => {
      store = mockStore(initialState);
      wrapper = shallow(<EmployeesScreen store={store} />);
    });

    it('should render with given state from Redux store', () => {
      expect(wrapper.length).toEqual(1);      
    });

    it('check Prop matches with initialState', () => {
      expect(wrapper.find('EmployeesScreen').prop('employees')).toEqual(initialState.employees); 
      expect(wrapper.find('EmployeesScreen').prop('currentUser')).toEqual(initialState.currentUser); 
    });  
});

