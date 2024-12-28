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
    const baseDir = path.resolve(path.resolve(__dirname,"user")); // Change this to the directory you want to scan
    const tree = getFileTree(baseDir);
    res.json(tree);
});

app.get('/file-content',  async(req, res) => {
    let raw_path = req.query.file_path;
    const baseDir = path.resolve(path.resolve(__dirname,"user"))
    let file_content= fs.readFile(path.join(baseDir,raw_path),'utf-8', (err, data) => {
        if (err) {
          // Handle error, e.g., file not found or read error
          console.error('Error reading file:', err);
          res.status(500).send('Error reading file');
          return;
        }
        // Send the file content as the response
        let fileext=path.extname(path.join(baseDir,raw_path));
        res.send({"data":data,"ext":fileext});
      });


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




function createValidPath(input) {
    // Trim leading and trailing whitespace
    let trimmed = input.trim();
    
    // Split the string by `/`, filter out empty parts, and join with `/`
    let parts = trimmed
      .split('/')
      .filter(part => part.trim() !== '');  // Remove empty parts
  
    // Use path.join to create a valid path
    let validPath = path.join(...parts);
  
    // Normalize the path to remove any redundant slashes or dots
    validPath = path.normalize(validPath);
  
    return validPath;
  }
  
  