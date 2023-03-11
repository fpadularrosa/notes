const { Note } = require('../models/Note.schema');

module.exports = {
    notes: async(_req, res) => {
        try {
            res.status(200).json({ success: true, response: await Note.find({}) });
        } catch (error) {
            res.status(404).json({ success: false, error: error.message });
        }
    },
    deleteNotes: async (req, res) => {
        try {
            const { id } = req.params;

            if(!id) return res.status(400).json({ success: false, error: 'Id not founded.' });

            await Note.findByIdAndDelete(id);

            return res.json({ success: true, response: 'Note deleted successfully.' });
        } catch (error) {
            res.status(404).json({ success: false, error: error.message });
        }
    },
    postNote: async(req, res) => {
        try {
            await Note.create({note:req.body.note, userId:req.body.userId});
            return res.status(200).json({ success: true, response: 'Note added successfully.' });
        } catch (error) {
            res.status(404).json({ success: false, error: error.message });
        }
    }
}