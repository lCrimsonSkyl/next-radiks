import mongoose from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator';

let { Schema } = mongoose;
let { ObjectId } = Schema.Types;

let citySchema = new Schema({
    name: {
        type: String,
        required: [true, 'El nombre es necesario'],
    },
    state: {
        type: ObjectId,
        ref: 'state',
        required: false,
    },
},/* eslint-disable */
    { collection: 'city' }
    /* eslint-enable */
);

citySchema.plugin(uniqueValidator);

module.exports = mongoose.model('city', citySchema);