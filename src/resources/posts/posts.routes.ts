import express from "express";

// Import handlers  from posts.controller.js
import {getPosts, getPost, getPostsByUser, createPostByUser, updatePost, deletePost} from "./posts.controllers";
import { auth }  from '../../middleware/auth';


const router = express.Router();


// GET /posts: Retrieve a list of posts.
// POST /posts: Create a new post.
// GET /posts/{postId}: Retrieve a specific post by ID.
// PUT /posts/{postId}: Update a specific post by ID.
// DELETE /posts/{postId}: Delete a specific post by ID.
// GET /users/{userId}/posts: Retrieve all posts by a specific user.
// POST /users/{userId}/posts: Create a new post for a specific user.

// CRUD for posts
router.get("/posts", auth,  getPosts);
router.get("/posts/:id", auth,  getPost);
router.get("/users/:userId/posts", auth, getPostsByUser);
router.put("/posts/:id", auth, updatePost);
router.post("/users/:userId/posts", auth, createPostByUser);
router.delete("/posts/:id", auth, deletePost);


export default router;