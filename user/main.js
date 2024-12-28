const http = require('http');
const express = require('express');
const socket = require('socket.io');
const cors = require('cors');
const { exec } = require('node:child_process')
const fs = require('fs');
const path = require('path');


const app = express();
app.use(cors());
app.use(express.json());


// Function to get the file tree
const getFileTree = (dirPath) => {
    const result = {};
    const items = fs.readdirSync(dirPath);

    items.forEach(item => {
        const fullPath = path.join(dirPath, item);
        const stats = fs.statSync(fullPath);

        if (stats.isDirectory()) {
            result[item] = getFileTree(fullPath);
        } else {
            result[item] = null;
        }
    });

    return result;
};

const server = http.createServer(app);
const io = socket(server, {
    cors: {
        origin: "*", // Allow all origins. You can specify a specific origin if needed.
        methods: ["GET", "POST"],
        allowedHeaders: ["my-custom-header"],
        credentials: true
    }
});

const port = process.env.PORT || 8080;

app.get('/', function (req, res) {
    res.send("Hello from Server on PORT : " + req.ip + ":" + port);
});
// Route to get the file tree
app.get('/file-tree', (req, res) => {
    const baseDir = path.resolve(__dirname); // Change this to the directory you want to scan
    const tree = getFileTree(baseDir);
    res.json(tree);
});

io.on('connection', (socket) => {
    console.log('user connected');
    
    socket.on('disconnect', function () {
        console.log('user disconnected');
    });
    socket.on('Terminal:INPUT', (data) => {
        console.log('Terminal:ENTER : ' + data);
        // Execute the received command
        exec(data, (err, stdout, stderr) => {
            if (err) {
                // Send error output back to the client
                socket.emit('Terminal:OUTPUT', `Error: ${stderr}`);
            } else {
                // Send the command output back to the client
                socket.emit('Terminal:OUTPUT', stdout);
            }
        });

    });
    socket.on('Terminal:WHOAMI', (data) => {
        console.log('Terminal:USER : ' + data);
        // Execute the received command
        exec(data, (err, stdout, stderr) => {
            if (err) {
                // Send error output back to the client
            } else {
                // Send the command output back to the client
                socket.emit('Terminal:USER', stdout);
            }
        });

    });
    socket.on('Terminal:OUTPUT', (data) => {
        console.log('Terminal:ENTER : ' + data);

    });

});



server.listen(port, function () {
    console.log(`Listening on port ${port}`);
});
