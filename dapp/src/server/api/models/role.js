import mongoose from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator';

let { Schema } = mongoose;
let { ObjectId } = Schema.Types;

let roleSchema = new Schema({
    name: {
        type: String,
        required: [true, 'El nombre es necesario'],
        unique: true,
    },
    description: {
        type: String,
        required: [true, 'La descripcion es necesaria']
    },
    permissions: [{
        type: ObjectId,
        ref: 'permission',
        required: [true, 'Cada permiso debe tener una ID valida'],
    }],
    isActive: {
        type: Boolean,
        required: [true, 'El estado del borrado logico es necesario.']
    }
},/* eslint-disable */
    { collection: 'role' }
    /* eslint-enable */
);

roleSchema.plugin(uniqueValidator);

module.exports = mongoose.model('role', roleSchema);