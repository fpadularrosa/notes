const { notes, deleteNotes, postNote } = require('../controllers/notes.controller');
const express = require('express');
const validate = require('../middlewares/validate.schema');
const { joiNoteSchema: schema } = require('../models/Note.schema');

const router = express();

router.get('/', notes);

router.delete('/:id', deleteNotes);

router.post('/add', validate(schema), postNote);

module.exports = router;