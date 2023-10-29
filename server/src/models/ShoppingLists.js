import mongoose from "mongoose";

const ListsSchema = new mongoose.Schema({
    name: {type: String, required: true,},
    items: [{type: String, required: true}],
    userOwner: {type: mongoose.Schema.Types.ObjectId, ref: "users", required: true,}
})

export const ListModel = mongoose.model("lists", ListsSchema);