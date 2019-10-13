const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/myproject', {useNewUrlParser: true, 
useUnifiedTopology: true, 
useFindAndModify: false});

const db = mongoose.connection;

const colorSchema = mongoose.Schema({
    color: {
        type: String,
        required: true
    },
    hex: {
        type: String,
        required: true
    }
})

const Color = db.model('Color', colorSchema);

module.exports = Color;
