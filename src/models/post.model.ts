import e from "express";
import mongoose,{Document, Schema} from "mongoose";

export interface IPost extends Document {
    _id: mongoose.Types.ObjectId
    title: string;
    content: string;
    author: mongoose.Types.ObjectId;
    imageURL?: string;
    tags?: string[];
    createdAt: Date;
    updatedAt: Date;
}

const postSchema = new mongoose.Schema<IPost>({
        title: { type: String, required: true },
        content: { type: String, required: true },
        author: { type: Schema.Types.ObjectId, ref: "User", required: true },
        imageURL: String ,
        tags: [String],
    },
    {
        timestamps: true,
      
    }
);

export const Post = mongoose.model<IPost>("Post", postSchema);
