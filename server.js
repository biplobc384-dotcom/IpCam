const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const path = require('path');

// মূল লিঙ্কে (Root URL) ঢুকলে সরাসরি ক্যামেরা ওপেন হবে
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/camera.html'));
});

// লিঙ্কের শেষে /admin লিখলে অ্যাডমিন প্যানেল ওপেন হবে
app.get('/admin', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/admin.html'));
});

// স্ট্যাটিক ফাইলের জন্য
app.use(express.static('public'));

// WebRTC Signaling & Socket.io
io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    socket.on('offer', (data) => socket.broadcast.emit('offer', data));
    socket.on('answer', (data) => socket.broadcast.emit('answer', data));
    socket.on('candidate', (data) => socket.broadcast.emit('candidate', data));

    socket.on('switchCamera', () => {
        socket.broadcast.emit('switchCamera');
    });

    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
    });
});

// সার্ভার পোর্ট
const PORT = process.env.PORT || 3000;
http.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
