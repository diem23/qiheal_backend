import express from "express";
import PostService from "../services/PostService";
import verifyRoles from "../middleware/verifyRoles";
import { UserRole } from "../model/User";
export const PostRouter = express.Router()


PostRouter.post("/chooseRelatedPosts/:id", async (req, res) => {
    // #swagger.tags = ['Post']
    /* #swagger.parameters['body'] = {
            in: 'body',
            description: 'Add a user',
            schema: { 
                $relativePostIds: ["645b1f2e8f1b2c001c8e4d3a", "645b1f2e8f1b2c001c8e4d3b"]
            }
        } 
        */
    const response = await PostService.handleChooseRelatedPosts(req)
    res.status(200).json({
        message: "Get all posts successfully",
        data: response,
    });
});
PostRouter.post("/", async (req, res) => {
    // #swagger.tags = ['Post']
    /* #swagger.parameters['body'] = {
            in: 'body',
            description: 'Add a user',
            schema: { 
                $image: "https://example.com/image.jpg",
                $title: "Office Chair",
                $content: "A comfortable office chair with adjustable height",
                $relativePosts: ["645b1f2e8f1b2c001c8e4d3a", "645b1f2e8f1b2c001c8e4d3b"],
            }
        } 
        */
    const response = await PostService.handleCreatePost(req)
    res.send(response)
}
);
PostRouter.put("/:id", async (req, res) => {
    // #swagger.tags = ['Post']
    /* #swagger.parameters['body'] = {
            in: 'body',
            description: 'Add a user',
            schema: { 
                $name: "Office Chair",
                $desc: "A comfortable office chair with adjustable height",
                $price: 120.99,
                $stockQty: 50,
                $warningLevel: 10,
                $categoryId: "645b1f2e8f1b2c001c8e4d3a"
            }
        } 
        */
    const response = await PostService.handleUpdatePost(req)
    res.send(response)
}
);
PostRouter.delete("/:id", async (req, res) => {
    // #swagger.tags = ['Post']
    const response = await PostService.handleDeletePost(req)
    res.send(response)
}
);
PostRouter.post("/upload/:id", async (req, res) => {
    // #swagger.tags = ['Post']
    /*
        #swagger.consumes = ['multipart/form-data']  
        #swagger.parameters['singleFile'] = {
            in: 'formData',
            type: 'file',
            required: 'true',
            description: 'Some description...',
    } */
    const response = await PostService.addBase64ImagesToPost(req)
    res.send(response)
});
