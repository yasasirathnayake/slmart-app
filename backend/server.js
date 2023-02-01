const express = require('express')
const app = express()
var cors = require('cors')
const helmet = require("helmet");
var bodyParser = require('body-parser')
const multer = require('multer')
const PORT = process.env.PORT || 3000

// all routes
var authRoutes = require('./routes/authRoute')
var adminRoutes = require('./routes/adminRoute')
var userRoutes = require('./routes/userRoute')



// image
app.use('/backend/uploads', express.static('uploads'))

// some dependency
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(cors({ origin: '*' }))

// http://localhost:4200

//secure http
app.use(helmet());

//image google cloud cloud
const multerMid = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 5 * 1024 * 1024,
    },
})
app.use(multerMid.single('file'))



//database connection
const db = require('./database/db')();

// socket connection
var server = require('http').Server(app);
var io = require('socket.io')(server,


    {
        cors: {
            origin: '*',
            methods: ["GET", "POST"],
            allowedHeaders: ["my-custom-header"],
            credentials: true
        }
    }

);
app.set('io', io);
io.on('connection', socket => {
    console.log("new  sockeet connection...");
    socket.emit("test event", "hey girly");
});

// for testing purpose
app.get('/', (req, res) => {
    res.send("Hello srilanka from slmart Server")
})

// use all routes
app.use('/', authRoutes)
app.use('/admin', adminRoutes)
app.use('/user', userRoutes)


// for debugging
server.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
})