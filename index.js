import express from 'express';
import { create } from 'express-handlebars';
import AuthRoutes from './routes/auth.js';
import ProductsRoutes from './routes/products.js';
import * as dotenv from 'dotenv';
import mongoose from 'mongoose';
import flash from 'connect-flash';
import session from 'express-session';
import varMiddleware from './middleware/var.js'
import cookieParser from 'cookie-parser'
import userMiddleware from './middleware/user.js'
import hbsHelper from './Utils/index.js'


dotenv.config()

const app = express();

const hbs = create({
    defaultLayout: 'main',
    extname: 'hbs',
    helpers: hbsHelper,
})

app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');
app.set('views', './views');

app.use(express.urlencoded({ extended: true }));

app.use(express.static('public'))

// meddleware
app.use(express.json());
app.use(cookieParser())
app.use(session({secret: 'Shunqor', resave: false, saveUninitialized: false}));
app.use(flash())
app.use(varMiddleware)
app.use(userMiddleware)


app.use(AuthRoutes)
app.use(ProductsRoutes)

const startApp = () => {
    try {
        mongoose.set('strictQuery', false)
        mongoose.connect(process.env.MONGO_URI, {useNewUrlParser: true}, () => console.log('Mongo DB connected'))

        const PORT = process.env.PORT || 4100
        app.listen( PORT, () => console.log(`Server is running on port: ${PORT}`) )
    } catch (error) {
        console.log(error);
    }
}

startApp()




// mongodb+srv://Mirjalol:<password>@cluster0.sehfrbw.mongodb.net/?retryWrites=true&w=majority