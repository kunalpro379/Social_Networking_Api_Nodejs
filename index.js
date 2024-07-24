const express = require('express');
const dotenv = require('dotenv');
const socketIo = require('socket.io');
const authRouter = require('./routes/auth');
const connectDB = require('./database/db');
const cookieParser = require('cookie-parser');  
const userRouter = require('./routes/users');
const messageRoutes = require('./routes/messages');
const groupRoutes = require('./routes/groups');
const http = require('http');

dotenv.config();

const app = express();
const server = http.createServer(app);    
const io = socketIo(server);

const { errorHandler } = require('./middlewares/error');

app.use(express.json());
app.use(cookieParser());

// Routes
app.use(errorHandler);
app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use('/group', groupRoutes);
app.use('/messages', messageRoutes);

app.get('/', (req, res) => {
    res.send('Hello World');
});

const users = {};

io.on('connection', (socket) => {
    console.log('New client connected');
    
    socket.on('join', (username) => {
        users[username] = socket.id;
        socket.broadcast.emit('userConnected', username);
    });
    
    socket.on('joinGroup', (groupName) => {
        socket.join(groupName);
    });
    
    socket.on('disconnect', () => {
        for (const user in users) {
            if (users[user] === socket.id) {
                socket.broadcast.emit('userDisconnected', user);
                delete users[user];
                break;
            }
        }
    });
});

app.set('io', io);
app.set('users', users);

console.log('Loaded MONGO_URI:', process.env.MONGO_URI);

const port = process.env.PORT || 7000;
server.listen(port, () => {
    connectDB();
    console.log(`Server is running on port ${port}`);
});
