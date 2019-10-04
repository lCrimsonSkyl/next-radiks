import { createStore} from 'redux';
import rootReducer from "../rootReducer";

const reduxStore = createStore(
    rootReducer
);

export default reduxStore;
