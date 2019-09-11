import mongoose from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator';

let { Schema } = mongoose;

let companySchema = new Schema({
    name: {
        type: String,
        required: [true, 'El nombre es necesario']
    },
    businessName: {
        type: String,
        required: [true, 'La razon social es necesaria']
    },
    identificationNumber: {
        unique: true,
        type: String,
        required: [true, 'El identificador es necesario']
    },
    address: {
        type: String,
        required: [true, 'La direccion es necesaria']
    },
    telephoneNumber: {
        type: String,
        required: [true, 'El numero telefonico es necesario']
    },
    cellphoneNumber: {
        type: String,
        required: [true, 'El numero celular es necesario']
    },
    webPage: {
        type: String,
        required: [true, 'La pagina web es necesaria']
    },
    businessRotation: {
        type: String,
        required: [true, 'El giro empresarial es necesario']
    },
    isActive: {
        type: Boolean,
        required: [true, 'El estado del borrado logico es necesario']
    }
},/* eslint-disable */
    { collection: 'company' }
    /* eslint-enable */
);

companySchema.plugin(uniqueValidator);

module.exports = mongoose.model('company', companySchema);