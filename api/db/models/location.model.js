//Model of storage locations

const mong = require('mongoose');

const LocationSchema = new mong.Schema(
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
            default: "noPhoto.jpg"
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
    }
);
        

const Location = mong.model('Location', LocationSchema);

module.exports = {Location};
