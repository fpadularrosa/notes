const { Note } = require('../models/Note.schema');

module.exports = {
    notes: async(req, res) =>{
        try {
            const allNotes = await Note.find({});

            res.status(200).json({ success: true, response: allNotes });
        } catch (error) {
            res.status(404).json({ success: false, error: error.message });
        }
    },
    deleteNotes: async (req, res) => {
        try {
            const { id } = req.params;
            if(!id) throw new Error('id not finded');

            const noteEliminated = await Note.findByIdAndRemove(id);
            if(!noteEliminated) throw new Error('Note not finded');

            res.json({ success: true, response: 'Note deleted successfully.' });
        } catch (error) {
            res.status(404).json({ succes: false, error: error.message });
        }
    },
    updateNote: async (req, res) => {
        try {
            const { id } = req.params;
            const { note } = req.body;

            const noteUpdated = await Note.findByIdAndUpdate(id, { note }, { new: true });

            res.json({ success: true, response: noteUpdated });
        } catch (error) {
            res.status(404).json({ succes: false, error: error.message });
        }
    },
    postNote: async(req, res) => {
        try {
            const { note } = req.body;

            const newNote = await Note.create({
                note
            });

            res.json({ succes: true, response: newNote });
        } catch (error) {
            res.status(404).json({ success: false, error: error.message });
        }
    }
}