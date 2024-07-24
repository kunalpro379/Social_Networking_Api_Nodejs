const express = require('express');
const router = express.Router();
const Message = require('../models/messages/messages.models.js');

// Posting a one-to-one message
router.post('/message', async (req, res) => {
    const { username, recipient, message } = req.body;
    try {
        const OneToOneMessage = new Message({ username, message, recipient });
        await OneToOneMessage.save();
        const io = req.app.get('io');
        const users = req.app.get('users');
        if (users && users[recipient]) {
            io.to(users[recipient]).emit('OneToOneMessage', { username, message });
        }
        res.status(201).send(OneToOneMessage);
    } catch (error) {
        res.status(400).send({ error: error.message });
    }
});

// Get all messages sent by a specific user
router.get('/user/:username/messages', async (req, res) => {
    const { username } = req.params;
    try {
        const messages = await Message.find({ username }).sort({ timestamp: 1 });
        res.status(200).send(messages);
    } catch (error) {
        res.status(400).send({ error: error.message });
    }
});

module.exports = router;
