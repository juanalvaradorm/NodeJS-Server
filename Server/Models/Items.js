var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var ItemsSchema = new Schema({
    Name: { type: String, required: [true, 'El nombre es necesario'] },
    UnitPrice: { type: Number, required: [true, 'El precio únitario es necesario'] },
    Description: { type: String, required: false },
    Avaliable: { type: Boolean, required: true, default: true },
    CategoryId: { type: Schema.Types.ObjectId, ref: 'Category', required: true },
    UserIdAdd: { type: Schema.Types.ObjectId, ref: 'Usuario', required: true },
    DateAdd: { type: Date, default: Date.now, required: true },
    UserIdModify: { type: Schema.Types.ObjectId, ref: 'Usuario', required: false },
    DateModify: { type: Date, required: false },
    UserIdDelete: { type: Schema.Types.ObjectId, ref: 'Usuario', required: false },
    DateDelete: { type: Date, required: false },
});


module.exports = mongoose.model('Items', ItemsSchema);