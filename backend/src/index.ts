import express from 'express'
import TaskModel from './models/Task'
import { TaskCreationData, TaskUpdateData } from '@/../../../shared/types/task'
import cors from 'cors'

const app = express()
const PORT = 3001

app.use(cors()) // TODO: only allow frontend to access the API

// logging middleware
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`)
  next()
})

app.use(express.json())

app.get('/', (_req, res) => {
  res.send('API is working')
})

const apiRouter = express.Router()

apiRouter.get('/tasks', async (_req, res) => {
  try {
    const tasks = await TaskModel.findAll({
      order: [['createdAt', 'DESC']]
    })

    res.json(tasks)
  } catch (error) {
    console.error('Error fetching tasks:', error)
    res.status(500).json({ error: 'Failed to fetch tasks' })
  }
})

apiRouter.post<{}, {}, TaskCreationData>('/tasks', async (req, res) => {
  try {
    const { title, description } = req.body

    if (!title) {
      res.status(400).json({ error: 'Title is required' })
      return
    }

    const task = await TaskModel.create({
      title,
      description,
      completed: false
    })

    res.json(task)
  } catch (error) {
    console.error('Error creating task:', error)
    res.status(500).json({ error: 'Failed to create task' })
  }
})

apiRouter.get<{ id: number }>('/tasks/:id', async (req, res) => {
  try {
    const task = await TaskModel.findByPk(req.params.id)

    if (!task) {
      res.status(404).json({ error: 'Task not found' })
      return
    }

    res.json(task)
  } catch (error) {
    console.error('Error fetching task:', error)
    res.status(500).json({ error: 'Failed to fetch task' })
  }
})

apiRouter.put<{ id: number }, {}, TaskUpdateData>('/tasks/:id', async (req, res) => {
  try {
    const task = await TaskModel.findByPk(req.params.id)

    if (!task) {
      res.status(404).json({ error: 'Task not found' })
      return
    }

    const { title, description, completed } = req.body

    if (title !== undefined) task.title = title
    if (description !== undefined) task.description = description
    if (completed !== undefined) task.completed = completed

    await task.save()
    res.json(task)
  } catch (error) {
    console.error('Error updating task:', error)
    res.status(500).json({ error: 'Failed to update task' })
  }
})

apiRouter.delete<{ id: number }>('/tasks/:id', async (req, res) => {
  try {
    const task = await TaskModel.findByPk(req.params.id)

    if (!task) {
      res.status(404).json({ error: 'Task not found' })
      return
    }

    await task.destroy()
    res.json({ message: 'Task deleted successfully' })
  } catch (error) {
    console.error('Error deleting task:', error)
    res.status(500).json({ error: 'Failed to delete task' })
  }
})

app.use('/api', apiRouter)

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})
