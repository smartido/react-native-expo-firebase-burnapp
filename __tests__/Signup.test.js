import React from 'react';
import renderer from 'react-test-renderer';
import configureStore from 'redux-mock-store';
import Signup from '../screens/Signup';
import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import {shallow} from 'enzyme';
import {updateName, updateCompany, updateAdmin, updatePermission, updateEntries, signup} from '../redux/ActionCreators';
import {users} from '../redux/users';

Enzyme.configure({ adapter: new Adapter() });

const mockStore = configureStore([]);

describe('<Signup />', () => {
    let store, 
      wrapper, 
      initialState = {users: "test"};

    beforeEach(() => {
      store = mockStore(initialState);
      wrapper = shallow(<Signup store={store} />);
    });

    it('should render with given state from Redux store', () => {
      expect(wrapper.length).toEqual(1);      
    });

    it('check Prop matches with initialState', () => {
      expect(wrapper.find('Signup').prop('user')).toEqual(initialState.users); 
    }); 
    
    it('check actionCreator: test updateName', () => {
      const action = updateName("Sara Martínez Domínguez")
      expect(action).toEqual({type:"UPDATE_NAME", payload:"Sara Martínez Domínguez"});
    });

    it('check actionCreator: test updateCompany', () => {
      const action = updateCompany("UOC")
      expect(action).toEqual({type:"UPDATE_COMPANY", payload:"UOC"});
    });

    it('check actionCreator: test updateAdmin', () => {
      const action = updateAdmin(true)
      expect(action).toEqual({type:"UPDATE_ADMIN", payload:true});
    });

    it('check actionCreator: test updatePermission', () => {
      const action = updatePermission(true)
      expect(action).toEqual({type:"UPDATE_PERMISSION", payload:true});
    });

    it('check actionCreator: test updateEntries', () => {
      const action = updateEntries("10-11-2019", "Estressat", "Horaris", "");
      expect(action).toEqual({type:"UPDATE_ENTRIES", payload: {date: "10-11-2019", state: "Estressat", activity: "Horaris", comment: ""}});
    });

    it('check reducer: test updateName', () => {
      let state = {username: "Adrià Casado"}
      state = users(state, {type:"UPDATE_NAME", payload: "Sara Martínez Domínguez"});
      expect(state).toEqual({username: "Sara Martínez Domínguez"});
    });

    it('check reducer: test updateCompany', () => {
      let state = {companyName: "UOC"}
      state = users(state, {type:"UPDATE_COMPANY", payload: "Iskra"});
      expect(state).toEqual({companyName: "Iskra"});
    });

    it('check reducer: test updateAdmin', () => {
      let state = {isAdmin: false}
      state = users(state, {type:"UPDATE_ADMIN", payload: true});
      expect(state).toEqual({isAdmin: true});
    });

    it('check reducer: test updatePermission', () => {
      let state = {hasPermission: false}
      state = users(state, {type:"UPDATE_PERMISSION", payload: true});
      expect(state).toEqual({hasPermission: true});
    });

    it('check reducer: test updateEntries', () => {
      let state = {entries: []}
      state = users(state, {type:"UPDATE_ENTRIES", payload: {date: "10-11-2019", state: "Estressat", activity: "Horaris", comment: ""}});
      expect(state).toEqual({entries: {date: "10-11-2019", state: "Estressat", activity: "Horaris", comment: ""}});
    });

    it('capturing Snapshot of Signup', () => {
      const tree = renderer.create(<Signup store={store}/>).toJSON()
      expect(tree).toMatchSnapshot();
    });
});


