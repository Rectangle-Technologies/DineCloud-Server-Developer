// Importing modules
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const morgan = require('morgan');
const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');
const authenticateUserMiddleware = require('./middlewares/authenticate');

// Configuring dotenv
dotenv.config();

// Creating app
const app = express();

// Importing routers
const routers = require('./routers');

// Configuring morgan
if (process.env.NODE_ENV === 'development') {
    var accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), { flags: 'a' })
    app.use(morgan('dev', { stream: accessLogStream }));
    app.use(morgan('dev'));
} else {
    var accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), { flags: 'a' })
    app.use(morgan('combined', { stream: accessLogStream }));
    app.use(morgan('combined'));
}

// Configuring cors
app.use(cors());

// Configuring body-parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Authentication middleware
app.use('/api', authenticateUserMiddleware)

// Create table containg all routes
var Table = require('cli-table');
var table = new Table({
    head: ['Method', 'Path', 'Description']
});

// Function to generate routers
const generateRouters = async (routers) => {
    for (var routerIndex in routers) {
        const router = routers[routerIndex];
        for (var routeIndex in router.router) {
            const Router = express.Router();
            const route = router.router[routeIndex];

            // Creating single router
            Router[route.method](route.path, [...route.middlewares], route.controller);

            // Adding route to table
            table.push([route.method, '/api' + router.path + route.path, route.description]);

            // Adding router to app
            app.use(`/api${router.path}`, Router);
        }
    }
}

// Function to start server
const startServer = async () => {
    try {
        // Connecting to database
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to database');

        // Creating routers
        await generateRouters(routers);
        console.log('Created routers');

        // Listen on port
        const port = process.env.PORT || 3000;
        app.listen(port, () => {
            console.log(`Server started on port ${port}`);
            console.log(table.toString());
        });
    } catch (err) {
        console.log(err);
    }
}

// Start server
try {
    startServer();
} catch (err) {
    console.log(`Error starting server: , ${err}`);
}