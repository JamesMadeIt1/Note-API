const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        minLength: 5
    },
    content: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true,
        default: 'General'
    },
    tags: {
        type: [String],
        default: []
    }
}, 
{
    timestamps: true
});

module.exports = mongoose.model('Note', noteSchema);
