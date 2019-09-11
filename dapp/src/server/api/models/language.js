import mongoose from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator';

let { Schema } = mongoose;

let languageSchema = new Schema({
    name: {
        type: String,
        required: [true, 'El nombre es necesario'],
        unique: true,
    },
    ISO_639_1: {
        type: String,
        required: [true, 'La adbreviacion es necesaria'],
        unique: true,
    }
},/* eslint-disable */
    { collection: 'language' }
    /* eslint-enable */
);

languageSchema.plugin(uniqueValidator);

module.exports = mongoose.model('language', languageSchema);