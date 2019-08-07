const Mongoose = require('mongoose');
const UniqueValidator = require('mongoose-unique-validator');

let Schema = Mongoose.Schema;
let RolesValidos = {
    values: ['ADMIN_ROLE', 'USER_ROLE'],
    message: '{VALUE} no es un rol valido'
}

let UsuarioSchema = new Schema({
    name: {
        type: String,
        required: [true, 'El nombre es necesario']
    },
    edad: {
        type: Number,
        required: [true, 'La edad es Obligatoria']
    },
    email: {
        type: String,
        unique: true,
        required: [true, 'El correo es obligatorio']
    },
    password: {
        type: String,
        required: [true, 'El password es obligatorio']
    },
    img: {
        type: String,
        required: false
    },
    role: {
        type: String,
        default: 'USER_ROLE',
        enum: RolesValidos
    },
    status: {
        type: Boolean,
        required: [true, 'El estatus es obligatorio'],
        default: true
    },
    google: {
        type: Boolean,
        default: false
    }
});


UsuarioSchema.methods.toJSON = function() {
    let user = this;
    let UserObject = user.toObject();
    delete UserObject.password;
    return UserObject;
}

UsuarioSchema.plugin(UniqueValidator, { message: '{PATH} debe de ser unico' });

module.exports = Mongoose.model('Usuario', UsuarioSchema);