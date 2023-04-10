import { Router } from 'express';
import User from '../models/User.js';
import bcrypt from 'bcrypt'
import { generateJWTToken } from '../services/token.js';
import router from './products.js';

const ruoter = Router()

ruoter.get('/login', (req, res) => {
    if(req.cookies.token){
        res.redirect('/')
        return
    }
    res.render('login', {
        title: 'Login | shunqor',
        isLogin: true,
        loginError: req.flash('loginError'),
    })
})

ruoter.get('/register', (req, res) => {
    if(req.cookies.token){
        res.redirect('/')
        return
    }
    res.render('register', {
        title: 'Register | shunqor',
        isRegister: true,
        registerError: req.flash('registerError'),  
    })
})

router.get('/logout', (req, res) => {
    res.clearCookie('token')
    res.redirect('/')
})

ruoter.post('/login', async (req, res) => {

    const {email, password} = req.body

    if(!email, !password){
        req.flash('loginError', 'All fields are required')
        res.redirect("/login")
        return
    }

    const existUser = await User.findOne({email});

    if (!existUser){
        req.flash('loginError', 'User not found')
        res.redirect("/login")
        return
    };
    const isPasswordEqual = await bcrypt.compare(password, existUser.password)
    if (!isPasswordEqual){
        req.flash('loginError', 'Password wrong')
        res.redirect("/login")
        return
    }
    const token = generateJWTToken(existUser._id)
    res.cookie("token", token, {httpOnly: true, secure: true})
    res.redirect('/')
})

ruoter.post('/register', async (req, res) => {
    const { firstname, lastname, email, password } = req.body

    if(!firstname || !lastname || !email || !password){
        req.flash('registerError', 'All fields are required')
        res.redirect("/register")
        return
    }

    const candidate = await User.findOne({email})

    if(candidate){
        req.flash('registerError', 'User already registered')
        res.redirect("/register")
        return
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const userData = {
        firstName: firstname,
        lastName: lastname,
        email: email,
        password: hashedPassword
    }

    const user = await User.create(userData)

    const token = generateJWTToken(user._id)

    res.cookie("token", token, {httpOnly: true, secure: true})

    res.redirect('/')
})

export default ruoter


