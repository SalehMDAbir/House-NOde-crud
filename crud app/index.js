const express = require('express');
const morgan = require('morgan')
const path = require('path');
const bodyparser = require('body-parser')
const app = express();
const User = require('./database')

const dotenv = require('dotenv')
dotenv.config({path:'config.env'})

const PORT = process.env.PORT||8080;

//log request
app.use(morgan('tiny'))

//parse request to body-parser
app.use(bodyparser.urlencoded({extended:true}))

//set view engine
app.set('view engine','ejs')
app.use(express.urlencoded({extended:false}))

//load assets
// app.use('/css',express.static(path.resolve(__dirname,'assets/css')))
// app.use('/img',express.static(path.resolve(__dirname,'assets/img')))
// app.use('/js',express.static(path.resolve(__dirname,'assets/js')))

app.get('/',async(req,res)=>{
    const users = await User.find({})
    res.render('index',{
        title:'this is homepage',
        users:'users'
    })
})

app.post('/register',async(req,res) =>{
    const {name,email,password} = req.body;
    const newuser = new User({name,email,password});
    const usersave = await newuser.save();
    res.redirect('/');
})
app.get('/register',(req,res) =>{
    res.render('register');
})

app.get('/edit/:id',async(req,res)=>{
    const {id} = req.params
    const user = await User.findById({_id:id})
    if (user==null){
        res.redirect('/')
    }else{
        res.render('edit',{
            users:user
        })
    }

})

app.post('/update/:id',async(req,res)=>{
    const {id} = req.params
    const {name,email,password} =req.body
    const updateuser = await User.findByIdAndUpdate({_id:id},{name,email,password},{new:true})
    res.redirect('/')

})

app.listen(PORT,()=>{console.log('Server is running on https://localhost:${PORT}')});