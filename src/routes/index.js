const express = require('express');
const notesRoutes = require('./notes.routes');
const authRoutes = require('./auth.routes');
const router = express.Router();

router.use('/notes', notesRoutes);
router.use('/auth', authRoutes);

module.exports = router;