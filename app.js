const path = require("path")
const express = require('express')
const dotenv  = require('dotenv')
const morgan = require('morgan')
const exphbs = require('express-handlebars')
const passport = require('passport')
const session = require('express-session')
const MongoStore = require('connect-mongo')
const connectDB = require('./config/db')
const { default: mongoose } = require("mongoose")



dotenv.config({ path: './config/config.env'})


require('./config/passport')(passport)

connectDB()

const app = express() 

app.use(express.urlencoded({ extended: false}))
app.use(express.json())


if (process.env.NODE_ENV ==='development') {
    app.use(morgan('dev'))
}


app.engine('.hbs', exphbs.engine(
    {
     defaultLayout: 'main',
     extname: '.hbs'
}));   
app.set('view engine', '.hbs');


app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
        mongoUrl: process.env.MONGO_URI
    })
    
}))



app.use(passport.initialize())
app.use(passport.session())



//Static Folder
app.use(express.static(path.join(__dirname, 'public')))


//Routes
app.use("/", require('./routes/index'))
app.use('/auth', require('./routes/auth'))
app.use('/dashboard', require('./routes/index'))
app.use('/stories' , require('./routes/stories'))

const PORT = process.env.PORT || 3000

app.listen(PORT , console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`))