import { Request, Response } from "express";
import { Post } from "../models/post.model";
import { AUthRequest } from "../middleware/auth"; // Note: Consider renaming to AuthRequest
import { v2 as cloudinary } from "cloudinary";

export const createPost = async (req: AUthRequest, resp: Response) => {
  try {
    const { title, content, tags } = req.body;
    const author = req.user.sub;

    let imageURL = "";

    // ================== first option
    if (req.file) {
      const result: any = await new Promise((resolve, reject) => {
        const upload_stream = cloudinary.uploader.upload_stream(
          { folder: "posts" },
          (error, result) => {
            if (error) {
              return reject(error);
            }
            resolve(result); // Fixed typo: resole -> resolve
          }
        );
        upload_stream.end(req.file?.buffer);
      });
      imageURL = result.secure_url;
    }

    const newPost = new Post({
      title,
      content,
      tags: tags.split(","),
      imageURL,
      author: req.user.sub, // from auth middleware
    });

    await newPost.save();

    // ================== second option
    // if (req.file) {
    //   const base64Image = data:${req.file.mimetype};base64,${req.file.buffer.toString("base64")};
    //
    //   // Upload to Cloudinary
    //   const uploadResult = await cloudinary.uploader.upload(base64Image, {
    //     resource_type: "image",
    //     folder: "posts",
    //   });
    //
    //   imageURL = uploadResult.secure_url;
    // }

    resp.status(201).json({
      message: "Post created successfully!",
      data: newPost,
    });
  } catch (error) {
    console.error(error);
    resp.status(500).json({
      message: "Internal server error occurred",
    });
  }
};

// api/v1/post/
export const getAllPosts = async (req: Request, resp: Response) => {
  try {
    // pagination
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    // Fixed: Added await and assigned to posts variable
    const posts = await Post.find()
      .populate("author", "firstname email")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    // Fixed: Added await
    const total = await Post.countDocuments();
    
    resp.status(200).json({
      message: "Posts fetched successfully",
      data: posts,
      totalPages: Math.ceil(total / limit),
      totalCount: total,
      page,
    });
  } catch (err) {
    console.error(err);
    resp.status(500).json({ message: "Failed to fetch posts" });
  }
};

// api/v1/post/me
export const getMyPost = async (req: AUthRequest, resp: Response) => {
  try {
    const userId = req.user.sub;
    
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    const posts = await Post.find({ author: userId })
      .populate("author", "firstname email")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Post.countDocuments({ author: userId });

    resp.status(200).json({
      message: "Your posts fetched successfully",
      data: posts,
      totalPages: Math.ceil(total / limit),
      totalCount: total,
      page,
    });
  } catch (err) {
    console.error(err);
    resp.status(500).json({ message: "Failed to fetch your posts" });
  }
};