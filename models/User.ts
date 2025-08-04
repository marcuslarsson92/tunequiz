// models/User.ts
import { Schema, model, models, Document } from 'mongoose';

export interface Artist {
  name: string;
  count: number;
}

export interface IUser extends Document {
  email: string;
  artists: Artist[];
}

// Schema of Artist to keep the counter which is used to generate top artists.
const ArtistSubSchema = new Schema<Artist>({
  name: { type: String, required: true },
  count: { type: Number, default: 1 },
});

// Schema of <IUser> that contains email and artists which is a type of ArtistSubSchema
const UserSchema = new Schema<IUser>(
  {
    email: { type: String, required: true, unique: true },
    artists: {
      type: [ArtistSubSchema],
      default: [],
    },
  },
  { timestamps: true }
);

export default models.User || model<IUser>('User', UserSchema);
