const router = require('express').Router();
const auth = require('../middleware/auth.js');
const ctrl = require('../controllers/note.controller.js');

router.use(auth);


router.post('/', auth.js, createPage);

router.get('/', auth.js, getPages);

router.get('/:id', auth.js, getPage);

router.put('/:id', auth.js, updatePage);

router.delete('/:id', auth.js, deletePage);

module.exports = router;
           