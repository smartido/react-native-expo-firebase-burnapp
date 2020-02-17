import * as ActionTypes from './ActionTypes';
import Firebase, { db } from '../Firebase.js';
import moment from 'moment';

export const updateName = (username) => ({
    type: ActionTypes.UPDATE_NAME,
    payload: username
});

export const updateEmail = (email) => ({
    type: ActionTypes.UPDATE_EMAIL,
    payload: email
});

export const updatePassword = (password) => ({
    type: ActionTypes.UPDATE_PASSWORD,
    payload: password
});

export const updateCompany = (companyName) => ({
    type: ActionTypes.UPDATE_COMPANY,
    payload: companyName
});

export const updateAdmin = (isAdmin) => ({
    type: ActionTypes.UPDATE_ADMIN,
    payload: isAdmin
});

export const updatePermission = (hasPermission) => ({
    type: ActionTypes.UPDATE_PERMISSION,
    payload: hasPermission
});

export const updateEntries = (date, state, activity, comment) => {
    const entry = {
        date: date,
        state: state,
        activity: activity,
        comment: comment
    }   
    return {
        type: ActionTypes.UPDATE_ENTRIES,
        payload: entry
    }
};

export const login = () => {
    return async (dispatch, getState) => {
        try {
            const { email, password } = getState().users
            const response = await Firebase.auth().signInWithEmailAndPassword(email, password)
            dispatch(getUser(response.user.uid))
        } catch(error) {
            var errorCode = error.code;
            var errorMessage = error.message;
            alert(errorCode + ": " + errorMessage);
        }
    }
}

export const getUser = uid => {
    return async (dispatch) => {
        try {
            const user = await db
                .collection('users')
                .doc(uid)
                .get()
            dispatch({ type: ActionTypes.LOGIN, payload: user.data() })
        } catch(error) {
            var errorCode = error.code;
            var errorMessage = error.message;
            alert(errorCode + ": " + errorMessage);
        }
    }
}

export const signup = () => {
    return async (dispatch, getState) => {
        try {
            const { username, email, password, companyName, isAdmin, hasPermission } = getState().users
            const response = await Firebase.auth().createUserWithEmailAndPassword(email, password)
            if (response.user.uid) {
                const user = {
                    uid: response.user.uid,
                    username: username,
                    email: email,
                    password: password,
                    companyName: companyName,
                    isAdmin: isAdmin,
                    hasPermission: hasPermission
                }

                db.collection('users')
                    .doc(response.user.uid)
                    .set(user)
                dispatch({ type: ActionTypes.SIGNUP, payload: user })
            }
        } catch(error) {
            var errorCode = error.code;
            var errorMessage = error.message;
            alert(errorCode + ": " + errorMessage);
        }
    }
} 

export const fetchUser = (uid) => {
    return async (dispatch) => {
        dispatch(userLoading());
        try {
            const user = await db
                .collection('users')
                .doc(uid)
                .get();
            dispatch({ type: ActionTypes.FETCH_USER, payload: user.data() }); 
        } catch (error) {
            dispatch({ type: ActionTypes.USER_FAILED, payload: error }); 
        }
    } 
}

export const userLoading = () => ({
    type: ActionTypes.USER_LOADING
});

export const fetchEntries = (uid, limited) => {
    return async (dispatch) => {
        dispatch(entriesLoading());
        try {
            const entries = await db
                .collection('users')
                .doc(uid)
                .collection('entries')
                .onSnapshot((querySnapshot) => {
                    const list = [];
                    querySnapshot.forEach(doc => {
                        let dateJS = doc.data().entries.date.toDate(); //Sun Nov 10 2019 10:07:39 GTM+0100 (CET)       
                        let dateText = moment(dateJS).format("DD-MM-YYYY") //10-11-2019
                        list.push({
                            id: doc.id,
                            dateText,
                            state: doc.data().entries.state,
                            activity: doc.data().entries.activity,
                            comment: doc.data().entries.comment
                        });

                        //sort entries by date
                        list.sort(function(a, b) {
                            const xA = a.dateText;
                            const xB = b.dateText;
                            let comparison = 0;
                            if(xA < xB) {
                                comparison = 1;
                            } else if (xA > xB) {
                                comparison = -1;
                            }
                            return comparison;
                        });

                        //limit entries to 50 maximum
                        if(limited && list.length > 50) {
                            const listLimited = [];
                            for(i=0; i <= 50; i++) {
                                listLimited.push(list[i]);
                            }
                            dispatch({ type: ActionTypes.FETCH_ENTRIES, payload: listLimited }); 
                        } else {
                            dispatch({ type: ActionTypes.FETCH_ENTRIES, payload: list }); 
                        } 
                    });
                });
        } catch (error) {
            dispatch({ type: ActionTypes.ENTRIES_FAILED, payload: error }); 
        }
    } 
} 

export const entriesLoading = () => ({
    type: ActionTypes.ENTRIES_LOADING
});

export const addEntries = (date, state, activity, comment, email) => {
    return async (dispatch) => {
        try {
            const entries = {
                date: date,
                state: state,
                activity: activity,
                comment: comment
            }
            
            db.collection('users').onSnapshot((querySnapshot) => {
                querySnapshot.forEach(doc => {
                    if(email === doc.data().email) {
                        db.collection('users')
                            .doc(doc.id)
                            .collection('entries')
                            .add({entries})
                        dispatch({ type: ActionTypes.ADD_ENTRIES, payload: entries })
                    }
                });
            });
        } catch(e) {
            alert(e);
        }
    }
}

export const fetchEmployees = (companyName, uid) => {
    return async (dispatch) => {
        dispatch(employeesLoading());
        try {
            const employees = await db
                .collection('users')
                .onSnapshot((querySnapshot) => {
                    const list = [];
                    querySnapshot.forEach(doc => {
                    if(companyName == doc.data().companyName) {
                        list.push({
                            id: doc.id,
                            username: doc.data().username,
                            email: doc.data().email,
                            companyName: doc.data().companyName,
                            isAdmin: doc.data().isAdmin,
                            hasPermission: doc.data().hasPermission
                        });
                    }
                });
                dispatch({ type: ActionTypes.FETCH_EMPLOYEES, payload: list }); 
            });
        } catch (error) {
            dispatch({ type: ActionTypes.EMPLOYEES_FAILED, payload: error }); 
        }
    } 
}

export const employeesLoading = () => ({
    type: ActionTypes.EMPLOYEES_LOADING
});