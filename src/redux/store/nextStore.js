import {
    createStore,
    applyMiddleware,
} from 'redux';
import createSagaMiddleware, { END } from 'redux-saga';
import { composeWithDevTools } from 'redux-devtools-extension';
import rootReducer from '../rootReducer';
import apiSaga from '../../sagas/apiSaga';

const sagaMiddleware = createSagaMiddleware();

const initialState = {
    lateralMenuOpen: false,
    notification: { visible: false, type: 'hide', message: '' },
    remoteArticles: [],
};

const makeStore = (state = initialState) => {
    // Make exception for redux dev tools
    /* eslint-disable no-underscore-dangle */
    /* eslint-disable no-undef */
    const composeEnhancers = (typeof window !== 'undefined' && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) || composeWithDevTools;
    /* eslint-enable */
    const store = createStore(
        rootReducer,
        state,
        composeEnhancers(applyMiddleware(sagaMiddleware)),
    );

    store.runSaga = () => {
        // Avoid running twice
        if (store.saga) return;
        store.saga = sagaMiddleware.run(apiSaga);
    };

    store.stopSaga = async () => {
        // Avoid running twice
        if (!store.saga) return;
        store.dispatch(END);
        await store.saga.done;
        store.saga = null;
    };

    store.execSagaTasks = async (isServer, tasks) => {
        // run saga
        store.runSaga();
        // dispatch saga tasks
        tasks(store.dispatch);
        // Stop running and wait for the tasks to be done
        await store.stopSaga();
        // Re-run on client side
        if (!isServer) {
            store.runSaga();
        }
    };
    // Initial run
    store.runSaga();

    return store;
};

export default makeStore;