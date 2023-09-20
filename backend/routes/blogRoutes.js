const express = require('express')

const {getAllBlogs, addBlog, updateBlog, getById, deleteBlog, getBlogsByUserId} = require('../controllers/blogControllers')

const blogRouter = express.Router()

blogRouter.get('/', getAllBlogs);

blogRouter.post('/add', addBlog);

blogRouter.put('/update/:id', updateBlog);

blogRouter.get('/:id', getById)

blogRouter.delete('/delete/:id', deleteBlog)

blogRouter.get('/user/:id', getBlogsByUserId)

module.exports = blogRouter;