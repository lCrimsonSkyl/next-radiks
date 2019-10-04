import { ADD_ARTICLE } from "../actions/actionTypes";

const forbiddenWords = ["spam", "money"];

const forbiddenWordsMiddleware = ({ dispatch }) => next => action => {
    if (action.type === ADD_ARTICLE) {
        const foundWord = forbiddenWords.filter(word =>
            action.payload.title.includes(word)
        );
        if (foundWord.length > 0) {
            return dispatch({ type: "FOUND_BAD_WORD" });
        }
    }
    return next(action);
}

export default forbiddenWordsMiddleware;