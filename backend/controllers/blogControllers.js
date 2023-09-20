const { default: mongoose } = require('mongoose');
const Blog = require('../models/blogModel');
const User = require('../models/userModel');
const { use } = require('../routes/blogRoutes');

const getAllBlogs = async(req, res, next) => {
    try {
        const blogs = await Blog.find();
        if(!blogs) {
            return res.status(404).json({message : "No Blogs found"})
        }
        res.status(200).json({blogs})
        
    } catch (error) {
        console.log(error.message);
        res.status(500).json({message : error.message})
    }
}

const addBlog = async(req, res, next) => {
    const {title, description, image, user} = req.body;
    let existingUser;
    try {
        existingUser = await User.findById(user)      
    } catch (error) {
        console.log(error.message);
        res.status(500).json(error.message)
    }
    if(!existingUser) {
        return res.status(400).json('Unable to find the user')
    }
    const blog = new Blog(
        {
            title,
            description,
            image,
            user
        }
    )
    try {
        const session = await mongoose.startSession();
        session.startTransaction({session});
        await blog.save();
        existingUser.blogs.push(blog);
        await existingUser.save({session})
        await session.commitTransaction();
    } catch (error) {
        console.log(error.message);
        res.status(500).json({message : error.message})
        
    }
   
    res.status(200).json({blog})
}

const updateBlog = async(req, res, next) => {
    const {title, description, image} = req.body;
    const blogId = req.params.id;
    try {
        const blog = await Blog.findByIdAndUpdate(blogId, {
            title,
            description,
            image
        })
        if(!blog) {
            return res.status(404).json({message : "No such blog existed"})
        }
        const updatedBlog = await Blog.findById(blogId)
        res.status(200).json({updatedBlog})
    } catch (error) {
        console.log(error.message);
        res.status(500).json({message : error.message})
        
    }
}

const getById = async(req, res, next) => {
    let blogId = req.params.id;
    try {
        const blog = await Blog.findById(blogId)
        if(!blog) {
            return res.status(404).json({message : "Blog not found"})
        }
        res.status(200).json({blog})
    } catch (error) {
        console.log(error.message);
        res.status(500).json({message : error.message})
        
    }
}

const deleteBlog = async(req, res, next) => {
    let blogId = req.params.id;
    let blog;
    try {
        blog = await Blog.findByIdAndRemove(blogId).populate("user");
        await blog.user.blogs.pull(blog);
        await blog.user.save();
    } catch (error) {
        console.log(error.message);
        res.status(500).json(error.message);
    }
    if(!blog) {
        return res.status(404).json({message : "Blog not exist!!!"})
    }
    // const deletedBlog = await Blog.find();  
    res.status(200).json({message : "Successfully deleted"})
}

const getBlogsByUserId = async(req, res, next) => {
    const userId = req.params.id;
    let userBlogs ;
    try {
        userBlogs = await User.findById(userId).populate("blogs");
    } catch (error) {
        console.log(error.message);
        res.status(500).json({message : error.message})
    }
    if(!userBlogs) {
        return res.status(404).json({message : "No blogs found"})
    }
    return res.status(200).json({blogs : userBlogs})
}

module.exports = {getAllBlogs, addBlog, updateBlog, getById, deleteBlog, getBlogsByUserId} 