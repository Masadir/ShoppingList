import express from "express";
import cors from "cors";
import mongoose from "mongoose";

import {userRouter} from './routes/users.js';
import {listsRouter} from './routes/shoppingLists.js';

const app = express()

app.use(express.json()); 
app.use(cors());

app.use("/authorization", userRouter);
app.use("/lists", listsRouter);

mongoose.connect("mongodb+srv://masadir:homework@shopapp.jypmulj.mongodb.net/shopapp?retryWrites=true&w=majority")

const server = app.listen(3001, () => console.log("Server Started!"));

export { app, server };