const express = require("express")
const bcrypt = require("bcrypt")
const {createTokenForUser}= require('../service/auth')

const router = express.Router()

const User= require('../models/user')

router.get("/signup", (req, res)=>{
    res.render("signup")
})

router.get("/signin", (req, res)=>{
    res.render('signin')
})

router.post("/signup", async(req, res)=>{
const {fullName, email, password}= req.body

const salt =await bcrypt.genSalt(10);

const hashedPassword = await bcrypt.hash(password, salt)

try {
    await User.create({
        fullName:fullName,
        email:email, 
        salt:salt,
        password:hashedPassword})
        
        return res.redirect('/')
} catch (error) {
    if(error.code === 11000){
        return res.render("signup" , {error : "Email already exist !"})
    }
    
}


})

router.post("/signin", async(req, res)=>{
    const {email, password}=req.body

    const user =await User.findOne({email})
    if(!user) return res.render('signin', {error : "User Not Found !"})

    const hashedEnterdPassword =await bcrypt.hash(password, user.salt)
 
    if(hashedEnterdPassword === user.password){
        const token = createTokenForUser(user)
        return res.cookie("token", token ).redirect('/')
    }
    return res.render('signin', {error : "Invalid Email or Password !"})
    
})

router.get("/logout", (req, res)=>{
    res.clearCookie("token").redirect('/')
})

module.exports= router;


// const isEmailExist =  await User.find({email})

// if(isEmailExist.length != 0 ){
//     res.render("signin", {error : "Email already exist !"})