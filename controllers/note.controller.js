const express = require('express');
const router = express.Router();

const Note = require('../models/note.model.js');
const { default: mongoose } = require('mongoose');

router.post('/api/notes', async (req, res, next) => {
    try {
        const { title, content, category, tags } = req.body;

        const newNote = await Note.create({
            title,
            content,
            category,
            tags
        });

         res.status(201).json({
            message: 'Note created successfully',
            note: newNote
        });
    } catch (error) {
        res.status(400).json({ 
            message: 'Failed to create note',
            error: error.message 
        });
    }
});

router.get('/api/notes', async (req, res, next) => {
    try {
        const page = Math.max(1, parseInt(req.query.page, 10) || 1);
        const limit = Math.min(
            100,
            Math.max(1, parseInt(req.query.limit, 10) || 10)
        );
        const skip = (page - 1) * limit;

        const sort = req.query.sort || '-createdAt'; // Default sort by createdAt descending
        const allowedSortFields = [
            'title',
            '-title',
            'category',
            '-category',
            'createdAt', 
            'updatedAt'
        ];

        if (!allowedSortFields.includes(sort)) {
            return res.status(400).json({
                message: 'Invalid sort field',
                error: `Sort field must be one of: ${allowedSortFields.join(', ')}`
            });
        }

        const search = (req.query.search || req.query.q || '').trim();

        const filter = {};

        if (search) {
            filter.$text = { $search: search };
        }

        if (req.query.category) {
            filter.category = req.query.category;
        }

        const [totalCount, notes] = await Promise.all([
            Note.find(filter)
                .sort(sort)
                .skip(skip)
                .limit(limit),
                
            Note.countDocuments(filter),
        ]);

        res.status(200).json({
            message: 'Notes fetched successfully',
            pagination: {
                page,
                limit,
                totalNotes: totalCount,
                totalPages: Math.ceil(totalCount / limit)
            },
            notes,
        });
    } catch (error) {
        res.status(400).json({ 
            message: 'Failed to fetch notes',
            error: error.message 
        });
    }
})

router.get('/api/notes/:id', async (req, res, next) => {
    try {
        const { noteId } = req.params;

        const note = await Note.findById(noteId);

        if (!note) {
            return res.status(404).json({
                message: 'Note not found'
            });
        }

        res.status(200).json({
            message: 'Note fetched successfully',
            note
        });
    } catch (error) {
        if (error.name === 'CastError') {
            return res.status(400).json({
                message: 'Invalid note ID',
                error: error.message
            });
        }
        res.status(400).json({
            message: 'Failed to fetch note',
            error: error.message
        });
    }
});

router.put('/api/notes/:id', async (req, res, next) => {
    try {
        const { noteId } = req.params;
        const { title, content, category, tags } = req.body;

        // Validate input fields
        if (
            typeof title !== 'string' ||
            typeof content !== 'string' ||
            !content.trim()
        ) {
            return res.status(400).json({
                message: 'Invalid input data',
                error: 'Title and content must be non-empty strings'
            });
        }

        //Validate category and tags if provided
        if (
            category !== undefined &&
            (typeof category !== 'string' || !category.trim()) 
        ) {
            return res.status(400).json({
                message: 'Invalid category',
                error: 'Category must be a non-empty string'
            });
        }

        if (
            tags !== undefined &&
            (!Array.isArray(tags) || 
            !tags.every(tag => typeof tag === 'string'))
        ) {
            return res.status(400).json({
                message: 'Invalid tags',
                error: 'Tags must be an array of non-empty strings'
            });
        }

        // Update the note in the database
        const updatedNote = await Note.findByIdAndUpdate(
            noteId,
            { title: title.trim(),
                 content: content.trim(), 
                 category: category === undefined ? 'General' : category.trim(),
                 tags: tags === undefined ? [] : tags 
            },
            { 
                new: true, 
                runValidators: true 
            }
        );

        // Check if the note was found and updated
        if (!updatedNote) {
            return res.status(404).json({
                message: 'Note not found'
            });
        }

        res.status(200).json({
            message: 'Note updated successfully',
            note: updatedNote
        });
    } catch (error) {
        if (error.name === 'CastError') {
            return res.status(400).json({
                message: 'Invalid note ID',
                error: error.message
            });
        }
        res.status(400).json({
            message: 'Failed to update note',
            error: error.message
        });
    }
});

router.delete('/api/notes/:id', async (req, res, next) => {
  try {
    await Page.findByIdAndDelete({
         _id: req.params.id, owner: req.user.id }, { isArchived: false });
    res.json({ message: 'Moved to trash' });
  } catch (e) { next(e); }
}

);

const ctrl = mongoose.model( 'ctrl',  createPage, getPages, getPage, updatePage, deletePage)

    module.exports = { ctrl };