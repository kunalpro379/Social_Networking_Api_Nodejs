const express = require('express');
const Group = require('../models/group_chat/group.models.js');
const Message = require('../models/messages/messages.models.js');
const router = express.Router();

// Creating a group
router.post('/', async (req, res) => {
    const { name, members } = req.body;
    try {
        const newGroup = new Group({ name, members: Array.from(members) });
        await newGroup.save();
        res.status(201).send(newGroup);
    } catch (error) {
        res.status(400).send({ error: error.message });
    }
});

// Posting a message in a group
router.post('/:name/message', async (req, res) => {
    const { name } = req.params;
    const { username, message } = req.body;
    try {
        const groupMessage = new Message({ username, message, group: name });
        await groupMessage.save();
        const io = req.app.get('io');
        io.to(name).emit('groupMessage', { username, message });
        res.status(201).send(groupMessage);
    } catch (error) {
        res.status(400).send({ error: error.message });
    }
});

// Get all messages from a specific group
router.get('/:name/messages', async (req, res) => {
    const { name } = req.params;
    try {
        const messages = await Message.find({ group: name }).sort({ timestamp: 1 });
        res.status(200).send(messages);
    } catch (error) {
        res.status(400).send({ error: error.message });
    }
});

module.exports = router;
