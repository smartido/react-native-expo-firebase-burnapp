import React from 'react';
import renderer from 'react-test-renderer';
import configureStore from 'redux-mock-store';
import EntriesScreen from '../screens/EntriesScreen';
import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import {shallow} from 'enzyme';

Enzyme.configure({ adapter: new Adapter() });

const mockStore = configureStore([]);

describe('<EmploeesScreen />', () => {
    let store, 
      wrapper, 
      initialState = {currentUser: "testCurrentUser"};

    beforeEach(() => {
      store = mockStore(initialState);
      wrapper = shallow(<EntriesScreen store={store} />);
    });

    it('should render with given state from Redux store', () => {
      expect(wrapper.length).toEqual(1);      
    });

    it('check Prop matches with initialState', () => {
      expect(wrapper.find('EntriesScreen').prop('currentUser')).toEqual(initialState.currentUser); 
    });  
});
