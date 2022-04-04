import express from 'express'
const categoryRouter = express.Router()

import { categories } from '../data.js'
import Category from '../models/Category/Category.schema.js'

categoryRouter.get('/', async (req, res) => {
  const categories = await Category.find({})
  res.send(categories)
})

categoryRouter.get('/seed', async (req, res) => {
  // await Category.remove({}) //remove all products from db
  const createdCategories = await Category.insertMany(categories)
  res.send({ createdCategories })
})

categoryRouter.get('/:id', async (req, res) => {
  const category = await Category.findById(req.params.id)
  console.log(category)
  if (category) {
    res.send(category)
  } else {
    res.status(404).send({ message: 'Category not found' })
  }
})

export default categoryRouter
