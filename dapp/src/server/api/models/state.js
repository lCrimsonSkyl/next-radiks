import mongoose from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator';

let { Schema } = mongoose;
let { ObjectId } = Schema.Types;

let stateSchema = new Schema({
    name: {
        type: String,
        required: [true, 'El nombre es necesario'],
    },
    country: {
        type: ObjectId,
        ref: 'country',
        required: false,
    },
},/* eslint-disable */
    { collection: 'state' }
    /* eslint-enable */
);

stateSchema.plugin(uniqueValidator);

module.exports = mongoose.model('state', stateSchema);