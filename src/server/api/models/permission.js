import mongoose from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator';

let { Schema } = mongoose;

let permissionSchema = new Schema({
    name: {
        type: String,
        unique: true,
        index: true,
        required: [true, 'El nombre es necesario'],
        trim: true,
    },
    description: {
        type: String,
        required: [true, 'La descripcion es necesaria'],
        trim: true,
    },
    isActive: {
        type: Boolean,
        default: true,
        required: [true, 'El estado del borrado logico es necesario.']
    }
},/* eslint-disable */
    { collection: 'permission' }
    /* eslint-enable */
);

permissionSchema.plugin(uniqueValidator);

module.exports = mongoose.model('permission', permissionSchema);