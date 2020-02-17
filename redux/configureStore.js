import {createStore, combineReducers, applyMiddleware} from 'redux';
import thunk from 'redux-thunk';
import logger from 'redux-logger';
import {users} from './users';
import {currentUser} from './currentUser';
import {employees} from './employees';
import {entries} from './entries';

export const ConfigureStore = () => {
    const store = createStore(
        combineReducers({
            users,
            employees,
            entries,
            currentUser
        }),
        applyMiddleware(thunk/*, logger*/)
    );

    return store; 
}
