const { required, valid } = require('joi');
const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema({
    id: {
        type: String,
        required: true
    },
    category: {
        type: String,
        valid: ('Paragraph', 'h1', 'h2', 'h3', 'todo', 'bulleted_list', 'image', 'divider', 'code', 'numbered_list'),
        default: 'Paragraph',
        required: true
    },
    content: {
        type: String,
        default: ''
    },
    checked: {
        type: Boolean,
        default: false
    }, // for todo 
    language: {
        type: String,
        default: 'javascript' 
    },  // for code
}, {id: false});



const pageSchema = new mongoose.Schema({
    title: {
        type: String,
        default: 'Untitled'
    },
    icon: {
        type: String,
        default: '📄'
    },
    cover: {
        type: String,
        default: ''
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    parent: {
        type: mongoose.Schema.Types.ObjectId,
        REF: 'Page',
        default: null
    },  // for subpages
    blocks: [noteSchema],
    isFavourite: {
        type: Boolean,
        default: false
    },
    isArchived: {
        type: Boolean,
        default: false
    },
    sharedWith: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
},
    { timestamps: true }
);


pageSchema.index({ owner: 1, parent: 1, unique: true });

const Note = mongoose.model('Page', pageSchema);

module.exports = Note;
    