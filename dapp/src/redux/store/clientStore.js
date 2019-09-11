import { createStore as reduxCreateStore, compose } from 'redux';
import rootReducer from "../rootReducer";

const storeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

// create the store for the application
export default function createStore(reducer, initialState = {}, options) {

    return reduxCreateStore(reducer, initialState);
}
