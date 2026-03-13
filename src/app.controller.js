import express from 'express'
import { connectDB } from './DB/connectionDB.js'
import userRouter from './modules/user/user.controller.js'
import messageRouter from './modules/message/message.controller.js'
import cors from "cors"
import { PORT } from '../config/config.service.js'
import { redisConnection } from './DB/redis/redis.db.js'
import * as redis_servise from './DB/redis/redis.service.js'

const app = express()
const port = PORT

const bootstrap =async () => {
    app.use(cors({ origin: "*" }), express.json())
    connectDB();
    redisConnection();
    await redis_servise.set({ key: "hello", value: "world", ttl: 60 });
    app.get('/', (req, res) => res.status(200).json({ message: 'Hello to my Saraha App...😁😎' }))
    app.use("/uploads", express.static("uploads"));
    app.use("/user", userRouter);
    app.use("/message", messageRouter);

    app.use("{/*demo}", (req, res, next) => {
        throw new Error(`${req.originalUrl} not found 🤷‍♂️`, { cause: 404 })
    })
    app.use((err, req, res, next) => {
        res.status(err.cause || 500).json({ message: err.message, stack: err.stack })
    })
    app.listen(port, () => console.log(`saraha server listening on port ${port}!..😉`))
}

export default bootstrap