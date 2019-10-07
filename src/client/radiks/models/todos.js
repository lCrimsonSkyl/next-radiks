import { Model } from 'radiks';

class Todo extends Model {
    static className = 'Todo';

    static schema = { // all fields are encrypted by default
        title: String,
        completed: Boolean,
    };
}

export default Todo;