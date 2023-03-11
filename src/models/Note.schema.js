const { model, Schema } = require('mongoose');
const Joi = require('joi');

const noteSchema = new Schema({
    note: {
        type: String,
        required: true
    },
    userId: {
        type: String,
        required: true
    }
});

const Note = model('Note', noteSchema);

const joiNoteSchema = Joi.object({
    note: Joi.string().required().min(1).max(300),
    userId: Joi.string()
});

module.exports = { Note, joiNoteSchema };