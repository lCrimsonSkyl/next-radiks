import {
    combineReducers,
} from 'redux';

// import reduceReducers from 'reduce-reducers';
// import articles from './reducers/article';
// import apiFetch from './reducers/apiFetch';
import globalState from './reducers/globalState';

const initialState = {
    lateralMenuOpen: false,
    notification: { visible: false, type: 'hide', message: '' },
    remoteArticles: []
};

const rootReducer = combineReducers(globalState);

export default rootReducer;