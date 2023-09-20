const express = require('express')

const mongoose = require('mongoose')

const userRouter = require('./routes/userRoutes')

const blogRouter = require('./routes/blogRoutes')

const app = express()

app.use(express.json());

app.use(express.urlencoded({extended : false}))

app.use('/api/user', userRouter);

app.use('/api/blog', blogRouter);

mongoose.connect('mongodb+srv://vrindasukumar:Vrinda2127@cluster0.b43osob.mongodb.net/Blog_Applicaation?retryWrites=true&w=majority')
.then(() => {
    console.log('Database connected!!!');
    app.listen(5000, () =>{
        console.log("Api is running at port 5000!!!");
    });
})
.catch((error) =>{
    console.log(error);
})
