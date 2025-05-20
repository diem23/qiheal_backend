import { model, Schema, Types } from "mongoose";

export default interface Post{
    _id: Types.ObjectId;
    image: string;
    title: string;
    content: string;
    relativePosts: Types.ObjectId[];
}
export const DOCUMENT_NAME = 'Posts';
export const COLLECTION_NAME = 'Posts';
const schema = new Schema<Post>({
    image: {type: Schema.Types.String, required: false},
    title: {type: Schema.Types.String, required: true},
    content: {type: Schema.Types.String, required: true},
    relativePosts: [{type: Schema.Types.ObjectId, ref: "Posts"}]
}, {
    timestamps: true,
})
export const PostModel = model<Post>( DOCUMENT_NAME,schema, COLLECTION_NAME)