import { Model } from 'radiks';

class Todo extends Model {
    static className = 'Friends';

    static schema = { // all fields are encrypted by default
        members: Array,
    };
}

export default Todo;