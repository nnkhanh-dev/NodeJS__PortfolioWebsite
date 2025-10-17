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
    partialsDir: './views/partials/',
    runtimeOptions: {
        allowProtoPropertiesByDefault: true,
        allowProtoMethodsByDefault: true,
    },
    helpers: {
        increment: (value) => value + 1,
        isEven: (value) => value % 2 === 0,
        ifEqual: function(a, b, options) {
            if (a && b && a.toString() === b.toString()) {
                return options.fn(this);
            }
            return options.inverse(this);
        },
        formatDate: (date) => {
            if (!date) return '';
            const d = new Date(date);
            return d.toLocaleDateString('vi-VN');
        },
        gt: function(a, b) {
          return a > b;
        },
        substring: function(str, start, end) {
          return str.substring(start, end);
        },
        getGradientColor: function(index) {
          const colors = [
            'from-blue-800 to-blue-600',
            'from-green-800 to-green-600',
            'from-purple-800 to-purple-600',
            'from-yellow-800 to-yellow-600',
            'from-pink-800 to-pink-600',
            'from-orange-800 to-orange-600',
            'from-red-800 to-red-600',
            'from-teal-800 to-teal-600',
            'from-indigo-800 to-indigo-600',
            'from-cyan-800 to-cyan-600'
          ];
          return colors[index % colors.length];
        },
        multiply: function(a, b) {
          return a * b;
        },
        inArray: function(array, value, options) {
          if (array && Array.isArray(array)) {
            const found = array.some(item => {
              // Handle both ObjectId and string comparison
              const itemStr = item.toString();
              const valueStr = value.toString();
              return itemStr === valueStr;
            });
            return found ? 'checked' : '';
          }
          return '';
        }
    }
});

app.engine('hbs', hbs.engine);


app.set('view engine', 'hbs');
app.set('views', './views');


app.use(express.urlencoded({ extended: false, limit: '5mb' }));
app.use(express.json({ limit: '5mb' })); // thêm nếu dùng API JSON


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

// Add user to res.locals from session
app.use((req, res, next) => {
  if (req.isAuthenticated()) {
    res.locals.user = req.user;
  }
  next();
});

// Gắn toàn bộ routes
app.use("/", routes);


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})