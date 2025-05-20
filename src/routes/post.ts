import express from "express";

export const PostRouter = express.Router()
import PostService from "../services/PostService";
import Post from "../model/Post";
import { Types } from "mongoose";
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
PostRouter.post("/search", async (req, res) => {
    // #swagger.tags = ['Post']
    /* #swagger.parameters['body'] = {
            in: 'body',
            description: 'Add a user',
            schema: { 
                $keyword: "Office Chair",
                $page: 1,
                $limit: 10
            }
        } 
        */
    const response = await PostService.handleSearch(req)
    res.status(200).json({
        message: "Get all posts successfully",
        count: response?.length,
        data: response,
    });
});
PostRouter.get("/", async (req, res) => {
    // #swagger.tags = ['Post']
    const response = await PostService.handleGetPosts(req)
    res.status(200).json({
        message: "Get all posts successfully",
        count: response?.length,
        data: response,
    });
});
PostRouter.get("/:id", async (req, res) => {
    // #swagger.tags = ['Post']
    const reponse = await PostService.handleGetPostById(req)
    if

        (!reponse) {
        return res.status(404).json({ message: "Post not found" });
    }
    res.status(200).send(reponse)
}
);
PostRouter.post("/", async (req, res) => {
    // #swagger.tags = ['Post']
    /* #swagger.parameters['body'] = {
            in: 'body',
            description: 'Add a user',
            schema: { 
                $title: "Office Chair",
                $desc: "A comfortable office chair with adjustable height",
                $price: 120.99,
                $stockQty: 50,
                $warningLevel: 10,
                $categoryId: "645b1f2e8f1b2c001c8e4d3a"
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
