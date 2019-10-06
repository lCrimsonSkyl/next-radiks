import {
    combineReducers,
} from 'redux';

// import reduceReducers from 'reduce-reducers';

// import apiFetch from './reducers/apiFetch';
import globalState from './reducers/globalState';

// const rootReducer = combineReducers(globalState);
const rootReducer = globalState;

export default rootReducer;