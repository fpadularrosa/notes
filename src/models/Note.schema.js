const { model, Schema } = require('mongoose');
const Joi = require('joi');

const noteSchema = new Schema({
    note: {
        type: String,
        required: true
    }
});

const Note = model('Note', noteSchema);

const joiNoteSchema = Joi.object({
    note: Joi.string().required().min(3).max(300)
});

module.exports = { Note, joiNoteSchema };