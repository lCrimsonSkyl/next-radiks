import mongoose from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator';

let { Schema } = mongoose;
let { ObjectId } = Schema.Types;

let userSchema = new Schema({
    name: {
        type: String,
        required: [true, 'El nombre es necesario']
    },
    userName: {
        type: String,
        required: [true, 'The username is required']
    },
    identificationNumber: {
        unique: true,
        type: String,
        required: [true, 'El identificador es necesario']
    },
    email: {
        type: String,
        unique: true,
        required: [true, 'El correo es necesario']
    },
    password: {
        type: String,
        required: [true, 'La contraseña es obligatoria']
    },
    role: {
        type: ObjectId,
        ref: 'role',
        required: [true, 'La ID ROl no es valida'],
    },
    company: {
        type: ObjectId,
        ref: 'company',
        required: [true, 'La ID Company no es valida'],
    },
    language: {
        type: ObjectId,
        ref: 'language',
        required: [true, 'La ID language no es valida'],
    },
    city: {
        type: ObjectId,
        ref: 'city',
        required: [true, 'La ID city no es valida'],
    },
    isActive: {
        type: Boolean,
        required: [true, 'El estado del borrado logico es necesario']
    }
},/* eslint-disable */
    { collection: 'user' }
    /* eslint-enable */
);

userSchema.methods.toJSON = function () {

    const user = this;
    const userObject = user.toObject();
    delete userObject.password;

    return userObject;
}

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('user', userSchema);