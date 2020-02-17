import React from 'react';
import renderer from 'react-test-renderer';
import configureStore from 'redux-mock-store';
import CalendarScreen from '../screens/CalendarScreen';
import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import {shallow} from 'enzyme';

Enzyme.configure({ adapter: new Adapter() });

const mockStore = configureStore([]);

describe('<CalendarScreen />', () => {
    let store, 
      wrapper, 
      initialState = {employees: "testEmployees", currentUser: "testCurrentUser"};

    beforeEach(() => {
      store = mockStore(initialState);
      wrapper = shallow(<CalendarScreen store={store} />);
    });

    it('should render with given state from Redux store', () => {
      expect(wrapper.length).toEqual(1);      
    });

    it('check Prop matches with initialState', () => {
      expect(wrapper.find('CalendarScreen').prop('employees')).toEqual(initialState.employees); 
      expect(wrapper.find('CalendarScreen').prop('currentUser')).toEqual(initialState.currentUser); 
    });  
});

