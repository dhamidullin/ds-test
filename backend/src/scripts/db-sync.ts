import Task from '../models/Task'
import sequelize from '../config/database'

async function initializeDatabase() {
  try {
    await sequelize.authenticate()
    console.log('Database connection has been established successfully.')

    // Explicitly register the model
    const models = [Task]
    models.forEach(model => {
      sequelize.define(model.tableName, model.getAttributes())
    })

    await sequelize.sync({ alter: true })
    console.log('Database models synchronized.')
    process.exit(0)
  } catch (error) {
    console.error('Unable to connect to the database:', error)
    process.exit(1)
  }
}

initializeDatabase()
