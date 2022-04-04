import mongoose from 'mongoose'

const mongoClient = async () => {
  if (!process.env.MONGO_CLIENT) {
    console.log(
      'MONGO_CLIENT is not defined. Please create MONGO_CLIENT and provide a MongoDB connection string',
    )
  }
  try {
    const connectionString = await mongoose.connect(
      process.env.MONGO_CLIENT || 'mongodb://localhost/Soccer_Store',
    )
    if (connectionString) {
      return console.log('MongoDB Connected')
    }
    console.log('Failed to connect to MongoDB')
  } catch (error) {
    console.log(error)
  }
}

export default mongoClient
