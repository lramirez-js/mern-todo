const express = require('express')
const router = express.Router()

const Task = require('../models/task')

// Root
router.get('/', async (req, res) => {
    const tasks = await Task.find()
    res.status(200).json(tasks)
})

router.get('/:id', async (req, res) => {
    const task = await Task.findById(req.params.id)
    res.status(200).json(task)
})

router.post('/', async (req, res) => {
    // Body from express.json()
    let { title, description, created } = await req.body
    title = title.toString()
    description = description.toString()
    created = new Date(created)
    let msg = ''
    if((title.length >= 3 && title.length <= 10) && (description.length >= 3 && description.length <= 1000) && (created instanceof Date) ) {
        const task = new Task({
            title,
            description,
            created
        })
        await task.save()
        msg = 'Task saved'
    } else {
        msg = 'Task not saved'
    }
    res.status(200).json({status: msg})
})

router.put('/:id', async (req, res) => {
    // Body from express.json()
    let { title, description } = await req.body
    title = title.toString()
    description = description.toString()
    let msg = ''
    if((title.length >= 3 && title.length <= 10) && (description.length >= 3 && description.length <= 1000) ) {
        const task = {
            title,
            description
        }
        await Task.findByIdAndUpdate(req.params.id, task)
        msg = 'Task updated'
    } else {
        msg = 'Task not updated'
    }
    res.status(200).json({status: msg})
})

router.delete('/:id', async (req, res) => {
    await Task.findByIdAndRemove(req.params.id)
    res.status(200).json({status: 'Task deleted'})
})

module.exports = router