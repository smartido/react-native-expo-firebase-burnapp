import * as ActionTypes from './ActionTypes';

export const employees = (
    state = {
        isLoading: true,
        errMess: null,
        employees: []
    }, 
    action) => {
    switch (action.type) {
        case ActionTypes.FETCH_EMPLOYEES:
            return { ...state, isLoading: false, errMess: null, employees: action.payload }
        
        case ActionTypes.EMPLOYEES_LOADING:
            return { ...state, isLoading: true, errMess: null, employees: [] }
        
        case ActionTypes.EMPLOYEES_FAILED:
            return { ...state, isLoading: false, errMess: action.payload, employees: [] }
            
        default:
            return state
    }
}
