import * as express from 'express';
import * as session from 'express-session';
import * as cookieParser from 'cookie-parser';

import * as bodyParser from 'body-parser';
import * as cors from 'cors';
import * as mongoose from 'mongoose';
import * as passport from 'passport';
import env from './config/env.config.manager';
import Routes from './routes';
import * as path from 'path';
import * as fs from 'fs';
class App {
    public app: express.Application;
    public dbUrl: string = env.getEnvValue('DB_URL');
    constructor() {
        this.app = express();
        this.checkDir();
        this.config();
        this.mongoSetup();
        this.setRoutes();
    }

    checkDir = () => {
        const directories = path.join(__dirname, '../public/images');
        if (!fs.existsSync(directories)) {
            fs.mkdirSync(directories, { recursive: true });
        }
    }

    setRoutes = () => {
        this.app.get('/', (req, res) => {
            res.send('App is up & running.');
        });
        this.app.use('/v1/api', Routes.router);
        this.app.use('/static', express.static(path.join(__dirname, '../public')));
        // this.app.post('/notifications/subscribe', (req, res) => {
        //     const subscription = req.body;
        //     console.log(subscription);
        //     const payload = JSON.stringify({
        //         title: 'Hello!',
        //         body: 'It works.',
        //         sound: 'notification.mp3'
        //     });
        //     webpush
        //         .sendNotification(subscription, payload)
        //         .then((result) => console.log(result))
        //         .catch((e) => console.log(e.stack));

        //     res.status(200).json({ success: true });
        // });
    }
    config = () => {
        // support application/json type post data
        this.app.use(bodyParser.json());
        this.app.use(cors());
        this.app.use(cookieParser());
        this.app.use(
            session({
                secret: env.getEnvValue('SECRET'),
                resave: true,
                saveUninitialized: false,
                cookie: { secure: true }
            })
        );

        //support application/x-www-form-urlencoded post data
        this.app.use(bodyParser.urlencoded({ extended: false }));
        this.app.use(passport.initialize());
        this.app.use(passport.session());

        // Set Vapid Details For Web Push Notifications
        // webpush.setVapidDetails(
        //     process.env.WEB_PUSH_CONTACT,
        //     process.env.PUBLIC_VAPID_KEY,
        //     process.env.PRIVATE_VAPID_KEY
        // );
    }

    mongoSetup = () => {
        mongoose
            .connect(this.dbUrl, {
                useNewUrlParser: true,
                useUnifiedTopology: true,
                useCreateIndex: true,
                useFindAndModify: false
            })
            .then(() => {
                console.log('Connected to MongoDB!');
            })
            .catch((err) => {
                console.log(err);
            });
    }
}

const { app } = new App()
export default app;
