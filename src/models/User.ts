import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
    name: string;
    email: string;
    image?: string;
    flatId?: mongoose.Types.ObjectId;
    createdAt: Date;
}

const UserSchema = new Schema<IUser>({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    image: { type: String },
    flatId: { type: Schema.Types.ObjectId, ref: "Flat" },
    createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.User ||
    mongoose.model<IUser>("User", UserSchema);
