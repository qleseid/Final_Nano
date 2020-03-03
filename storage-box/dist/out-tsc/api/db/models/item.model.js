import * as mongoose from "mongoose";
export const ItemSchema = new mongoose.Schema({
    // _id: mong.Schema.Types.ObjectId,
    owner_id: {
        // type: mong.Schema.Types.ObjectId,
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true,
        minlength: 1,
        trim: true
    },
    file_path: {
        type: String,
        default: "empty.jpg"
    },
    description: {
        type: String,
        trim: true
    },
    created: {
        type: Date,
        default: Date.now
    }
});
export default mongoose.model('Item', ItemSchema);
//# sourceMappingURL=item.model.js.map