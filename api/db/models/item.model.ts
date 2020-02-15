import { Model } from 'mongoose';
//Model of storage locations
import { model, Schema, Document } from 'mongoose';

//const mong = require('mongoose');

interface IItemModel extends Model<any> 
{
    id: string;
    owner_id: string;
    title: string;
    file_path: string;
    description: string;
    created: Date;
}

export const ItemSchema: Schema = new Schema<IItemModel>(
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
        

export default model<IItemModel & Document>('Item', ItemSchema);
