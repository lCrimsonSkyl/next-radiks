import mongoose from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator';

let { Schema } = mongoose;
let { ObjectId } = Schema.Types;

let systemSchema = new Schema({
    name: {
        type: String,
        required: [true, 'El nombre es necesario'],
        unique: true,
    },
    description: {
        type: String,
        required: [true, 'La descripcion es necesaria']
    },
    roles: [{
        type: ObjectId,
        ref: 'role',
        required: [true, 'Cada rol debe tener una ID valida'],
    }],
    isActive: {
        type: Boolean,
        required: [true, 'El estado del borrado logico es necesario']
    }
},/* eslint-disable */
    { collection: 'system' }
    /* eslint-enable */
);

systemSchema.plugin(uniqueValidator);

module.exports = mongoose.model('system', systemSchema);