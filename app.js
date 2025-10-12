require('dotenv').config();
const path = require('path');
const express = require('express')
const mongoose = require('mongoose');
const passport = require('passport');
const bcrypt = require('bcryptjs');
const connectDB = require('./config/db');
var morgan = require('morgan')
const handlebars = require('express-handlebars');
const routes = require('./routes');
const session = require('express-session');
const initializePassport = require('./config/passport');
const User = require('./models/User');
const Education = require('./models/Education');
const Experience = require('./models/Experience');
const Project = require('./models/Project');
const Social = require('./models/Social');
const Technical = require('./models/Technical');
const TechType = require('./models/TechType');

const app = express()
const port = 3000

app.use(express.static(path.join(__dirname, 'public')));

//HTTP logger
app.use(morgan('combined'))

//Template engine
const hbs = handlebars.create({
    extname: '.hbs',
    defaultLayout: 'main',
    layoutsDir: './views/layouts/',
    helpers: {
        increment: (value) => value + 1,
        isEven: (value) => value % 2 === 0,
    }
});

app.engine('hbs', hbs.engine);


app.set('view engine', 'hbs');
app.set('views', './views');


app.use(express.urlencoded({ extended: false }));
app.use(express.json()); // thêm nếu dùng API JSON


// Connecrt to database
connectDB();

// Session
app.use(session({
  secret: 'secret-key',
  resave: false,
  saveUninitialized: false
}));

// Passport init
initializePassport(passport);
app.use(passport.initialize());
app.use(passport.session());

// Gắn toàn bộ routes
app.use("/", routes);


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})