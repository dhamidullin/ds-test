import sequelize from '../config/database'

async function initializeDatabase() {
  try {
    await sequelize.authenticate()
    console.log('Database connection has been established successfully.')

    await sequelize.sync({ alter: true })
    console.log('Database models synchronized.')
  } catch (error) {
    console.error('Unable to connect to the database:', error)
    throw error
  }
}

async function main() {
  try {
    await initializeDatabase()
    console.log('Database initialized successfully')
    process.exit(0)
  } catch (error) {
    console.error('Failed to initialize database:', error)
    process.exit(1)
  }
}

main()
