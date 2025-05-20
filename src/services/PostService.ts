import { Types } from "mongoose"
import PostRepo from "../repos/PostRepo"

const handleChooseRelatedPosts = async (req: any) => {
    const postId = req.params.id
    const relativePostIds = req.body.relativePostIds
    //console.log("postId: ", postId);
    //console.log("relativePostIds: ", relativePostIds);
    const updatedPost = await PostRepo.chooseRelatedPosts(postId, relativePostIds)
    return updatedPost
}
const handleSearch = async (req: any) => {
    const keyword = req.body.keyword;
    const page = parseInt(req.body.page) || 1
    const limit = parseInt(req.body.limit) || 10
    //console.log("keyword: ", keyword);
    //console.log("page: ", page);
    //console.log("limit: ", limit);
    const posts = await PostRepo.search(keyword, page, limit)
    return posts
}
const handleGetPosts = async (req: any) => {
    const posts = await PostRepo.getAlls()
    //console.log(posts)
    return posts
}
const handleGetPostById = async (req: any) => {
    const postId = Types.ObjectId.createFromHexString(req.params.id)
    //console.log("postId: ",postId);
    const post = await PostRepo.getById(postId)
    //console.log(post);
    return post
}
const handleCreatePost = async (req: any) => {
    const newPost = await PostRepo.create(req.body)
    return newPost
}
const handleUpdatePost = async (req: any) => {
    const postId = Types.ObjectId.createFromHexString(req.params.id)
    // console.log("postId: ", postId);
    const updatedPost = await PostRepo.update(postId, req.body)
    return updatedPost
}
const handleDeletePost = async (req: any) => {
    const postId = Types.ObjectId.createFromHexString(req.params.id)
    const deletedPost = await PostRepo.del(postId)
    return deletedPost
}
const addBase64ImagesToPost = async (req: any) => {
    const postId: string = req.params.id;
    const files = req.files?.singleFile;
    const fileBase64 = 'data:image/jpeg;base64,' + files?.data.toString('base64');
    if (!Types.ObjectId.isValid(postId)) {
        throw new Error('Invalid Product ID');
    }

    const updatedProduct = await PostRepo.updateImages(
        new Types.ObjectId(postId),
        fileBase64
    );

    return updatedProduct;
};
const PostService = {
    handleChooseRelatedPosts,
    handleSearch,
    handleGetPosts,
    handleGetPostById,
    handleCreatePost,
    handleUpdatePost,
    handleDeletePost,
    addBase64ImagesToPost
}
export default PostService