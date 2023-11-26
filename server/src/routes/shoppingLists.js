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

router.delete("/:listID", verifyToken, async (req, res) => {
    try {
        const list = await ListModel.findByIdAndDelete(req.params.listID);
        res.json({ message: "List deleted successfully", deletedList: list });
    } catch (err) {
        res.status(500).json({ error: "Error deleting the list", details: err });
    }
});

router.get("/:listID", async (req, res) => {
    try {
        const listID = req.params.listID; 

        const list = await ListModel.findById(listID);

        if (!list) {
            return res.status(404).json({ message: "List not found" });
        }

        res.json(list);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }
});

router.put("/:listID", verifyToken, async (req, res) => {
    try {
        const listID = req.params.listID;
        const updatedItems = req.body.items;

        const list = await ListModel.findByIdAndUpdate(listID, { items: updatedItems }, { new: true });

        if (!list) {
            return res.status(404).json({ message: "List not found" });
        }

        res.json({ message: "List updated successfully", updatedList: list });
    } catch (err) {
        res.status(500).json({ error: "Error updating the list", details: err });
    }
});

export {router as listsRouter};