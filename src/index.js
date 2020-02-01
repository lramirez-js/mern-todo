const express = require('express')
const path = require('path')
const morgan = require('morgan')

const { mongoose } = require('./database')

const app = express()

// Settings
app.set('port', process.env.PORT || 3000)

// Middleware
app.use(morgan('dev'))
app.use(express.json())

// Routes
app.use('/api/tasks', require('./routes/task.routes'))

// Static Files
app.use(express.static(path.join(__dirname, 'public')))

// Start the server
app.listen(app.get('port'), () => {
    process.stdout.write(`Server on port: ${app.get('port')}\n`)
} )