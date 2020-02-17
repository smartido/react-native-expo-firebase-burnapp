import * as ActionTypes from './ActionTypes';

export const users = (state = {}, action) => {
    switch (action.type) {

        case ActionTypes.LOGIN:
            return action.payload
        
        case ActionTypes.SIGNUP:
            return action.payload
        
        case ActionTypes.UPDATE_NAME:
            return { ...state, username: action.payload }

        case ActionTypes.UPDATE_COMPANY:
            return { ...state, companyName: action.payload }

        case ActionTypes.UPDATE_ADMIN:
            return { ...state, isAdmin: action.payload }

        case ActionTypes.UPDATE_PERMISSION:
            return { ...state, hasPermission: action.payload }

        case ActionTypes.UPDATE_ENTRIES:
            return { ...state, entries: action.payload }

        case ActionTypes.UPDATE_EMAIL:
            return { ...state, email: action.payload }

        case ActionTypes.UPDATE_PASSWORD:
            return { ...state, password: action.payload }

        default:
            return state
    }
}

