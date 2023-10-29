import express from "express"; 
import {ListModel} from "../models/ShoppingLists.js";
import {UserModel} from "../models/Users.js";
import {verifyToken} from "./users.js";

const router = express.Router();

router.get("/", async (req, res) => {
    try {
        const response = await ListModel.find({});
        res.json(response);
    } catch (err) {
        res.json(err);
    }
});

router.post("/", verifyToken, async (req, res) => {

    const list = new ListModel(req.body);

    try {
        await list.save();
        res.json(list);
    } catch (err) {
        res.json(err);
    }
});

router.put("/", verifyToken, async (req, res) => {

    try {
        const list = await ListModel.findById(req.body.listID);
        const user = await UserModel.findById(req.body.userID);
        user.savedLists.push(list);
        await user.save();
        res.json({savedLists: user.savedLists});
    } catch (err) {
        res.json(err);
    }
});

router.get("/savedLists/ids/:userID", async (req, res) => {
    try {
        const user = await UserModel.findById(req.params.userID);
        res.json({savedLists: user?.savedLists});
    } catch (err) {
        res.json(err)
    }
});

router.get("/savedLists/:userID", async (req, res) => {
    try {
        const user = await UserModel.findById(req.params.userID);
        const savedLists = await ListModel.find({
            _id: {$in: user.savedLists},
        });
        res.json({savedLists});
    } catch (err) {
        res.json(err)
    }
});

// Import necessary modules and ListModel

// Assuming `ListModel` represents your Mongoose model for the lists

// Endpoint to get details of a specific list by ID
router.get("/:listID", async (req, res) => {
    try {
        const listID = req.params.listID; // Fetch the list ID from the URL

        // Query the database using the ListModel to find the list by ID
        const list = await ListModel.findById(listID);

        if (!list) {
            // If the list is not found, respond with a 404 Not Found status
            return res.status(404).json({ message: "List not found" });
        }

        // If the list is found, respond with the list details
        res.json(list);
    } catch (error) {
        // Handle any errors that occur during this process
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }
});


export {router as listsRouter};