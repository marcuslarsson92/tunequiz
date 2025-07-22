import { Schema, model, models } from 'mongoose';
import { unique } from 'next/dist/build/utils';

const ArtistSubSchema = new Schema({
    name: {type: String, required: true},
    count: { type: Number, default: 1},
});

const UserSchema = new Schema(
    {
        name: String,
        email: { type: String, required: true, unique: true },
        artists: { 
            type: [ArtistSubSchema],
            default: []
        }
    },
    { timestamps: true }
);

export default models.User || model('User', UserSchema);