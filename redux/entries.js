import * as ActionTypes from './ActionTypes';

export const entries = (
    state = {
        isLoading: true,
        errMess: null,
        entries: []
    }, 
    action) => {
    switch (action.type) {
        case ActionTypes.FETCH_ENTRIES:
            return { ...state, isLoading: false, errMess: null, entries: action.payload }
        
        case ActionTypes.ENTRIES_LOADING:
            return { ...state, isLoading: true, errMess: null, entries: [] }
        
        case ActionTypes.ENTRIES_FAILED:
            return { ...state, isLoading: false, errMess: action.payload, entries: [] }
        
        case ActionTypes.ADD_ENTRIES:
            return { ...state, isLoading: false, errMess: null, entries: action.payload }
            
        default:
            return state
    }
}
