import mongoose from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator';

let { Schema } = mongoose;

let countrySchema = new Schema({
    name: {
        type: String,
        required: [true, 'El nombre es necesario'],
        unique: true,
    },
    ISO_3166_1: {
        type: String,
        required: [true, 'La adbreviacion es necesaria'],
        unique: true,
    }
},/* eslint-disable */
    { collection: 'country' }
    /* eslint-enable */
);

countrySchema.plugin(uniqueValidator);

module.exports = mongoose.model('country', countrySchema);