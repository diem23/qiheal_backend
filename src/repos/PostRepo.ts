import { Types } from "mongoose"
import {v2 as cloudinary} from "cloudinary"
import Post, { PostModel } from "../model/Post"
const chooseRelatedPosts = async (postId: Types.ObjectId, relativePostIds: Types.ObjectId[]): Promise<Post> => {
    let currentPost = await PostModel.findById(postId).exec()
    if (!currentPost) {  
        throw new Error("Post not found")
    }
    currentPost.relativePosts = relativePostIds
    
    await currentPost.save();
    return currentPost;

}
const search = async (keyword: string, page: number, limit: number): Promise<Post[] | null> => {
    const posts = await PostModel.find({
        $or: [
            { title: { $regex: '%' + keyword + '%', $options: "i" } },
        ]
    })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean<Post[]>()
        .exec()
    return posts
}
const getAlls = async (): Promise<Post[] | null> => {
    const posts = await PostModel.find().lean<Post[]>().exec()
    return posts
}
const getById = async (id: Types.ObjectId): Promise<Post | null> => {
    const post = await PostModel.findById(id).lean().exec()
    return post
}
const create = async (
    post: Post,
) => {
    const newPost = await PostModel.create(post)
    return newPost
}
const update = async (id: Types.ObjectId, post: any) => {
    const updatedPost = await PostModel.findByIdAndUpdate(id, post
        , { new: true }).exec()
    return updatedPost
}
const del = async (id: Types.ObjectId) => {
    const deletedPost = await PostModel.findByIdAndDelete(id)
    return deletedPost
}
const updateImages = async (id: Types.ObjectId, file: string) => {
    cloudinary.config({
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET,
    })
    const uploadResult = await cloudinary.uploader.upload(file);
    const updatedPost = await PostModel.findByIdAndUpdate(
        id,
         { image: uploadResult.public_id  } , // Add new Base64 images to the array
        { new: true }
    ).exec();

    return updatedPost;
};
const PostRepo = {
    chooseRelatedPosts,
    search,
    getAlls,
    getById,
    create,
    update,
    del,
    updateImages
}
export default PostRepo