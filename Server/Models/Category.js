const Mongoose = require('mongoose');
const UniqueValidator = require('mongoose-unique-validator');

let Schema = Mongoose.Schema;


let CategorySchema = new Schema({
    Name: {
        type: String,
        required: [true, 'El nombre de la categoria es requerido'],
        maxlength: 50
    },
    Status: {
        type: Boolean,
        required: [true, 'Estatus Obligatorio'],
        default: true
    },
    UserAddId: {
        type: Schema.Types.ObjectId,
        ref: 'Usuarios',
        required: [true, 'Usuario Obligatorio'],
    },
    DateAdd: {
        type: Date,
        required: [true],
        default: Date.now
    },
    UserModify: {
        type: Schema.Types.ObjectId,
        ref: 'Usuarios',
        required: false
    },
    DateModify: {
        type: Date,
        required: false
    },
    UserDelete: {
        type: Schema.Types.ObjectId,
        ref: 'Usuarios',
        required: [false],
    },
    DateDelete: {
        type: Date,
        required: false
    }
});

CategorySchema.methods.toJSON = function() {
    let Category = this;
    let CategoryObject = Category.toObject();
    delete CategoryObject.UserAddId;
    delete CategoryObject.DateAdd;
    delete CategoryObject.UserModify;
    delete CategoryObject.DateModify;
    return CategoryObject;
}

CategorySchema.plugin(UniqueValidator, { message: '{PATH} debe de ser unico' });

module.exports = Mongoose.model('Category', CategorySchema);