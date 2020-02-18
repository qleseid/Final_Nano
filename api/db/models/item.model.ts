//Model of storage locations
import * as mongoose from "mongoose";

//const mong = require('mongoose');

export interface IItemInterface extends mongoose.Document
{
    id: string;
    owner_id: string;
    title: string;
    file_path: string;
    description: string;
    created: Date;
}

interface IItemModelInterface extends mongoose.Model<IItemInterface>
{
    //Nothing yet
}

export const ItemSchema = new mongoose.Schema(
    {
        // _id: mong.Schema.Types.ObjectId,
        owner_id:
        {
            // type: mong.Schema.Types.ObjectId,
            type: String,
            required: true
        }, 
        title:
        {
            type: String,
            required: true,
            minlength: 1,
            trim: true
        },
        file_path:
        {
            type: String,
            default: "empty.jpg"
        },
        description:
        {
            type: String,
            trim: true
        },
        created: 
        {
            type: Date,
            default: Date.now
        }
    });
        

export default mongoose.model<IItemInterface, IItemModelInterface>('Item', ItemSchema);
