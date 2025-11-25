import { CategoryValidFields } from "../constant/category.constant";
import asyncHandler from "../utils/asyncHandler";
import pickValidFields from "../utils/pickValidFields";
import UpdateBlogCategoryService from "../services/blogCategory/UpdateBlogCategoryService";
import GetBlogCategoriesService from "../services/blogCategory/GetBlogCategoriesService";
import GetBlogCategoryDropDownService from "../services/blogCategory/GetBlogCategoryDropDownService";
import DeleteBlogCategoryService from "../services/blogCategory/DeleteBlogCategoryService";
import CreateBlogService from "../services/blog/CreateBlogService";


const createBlog = asyncHandler(async (req, res) => {
    const result = await CreateBlogService(req, req.body);
    res.status(200).json({
        success: true,
        message: "Blog is published successfully",
        data: result
    })
})

const getBlogs = asyncHandler(async (req, res) => {
    const validatedQuery = pickValidFields(req.query, CategoryValidFields);
    const result = await GetBlogCategoriesService(validatedQuery);
    res.status(200).json({
        success: true,
        message: 'Blogs are retrieved successfully',
        meta: result.meta,
        data: result.data
    })
})

const getSingleBlog = asyncHandler(async (req, res) => {
    const result = await GetBlogCategoryDropDownService();
    res.status(200).json({
        success: true,
        message: 'Blog-category drop-down are retrieved successfully',
        data: result
    })
})


const updateBlog = asyncHandler(async (req, res) => {
    const { categoryId } = req.params;
    const result = await UpdateBlogCategoryService(categoryId as string, req.body);
    res.status(200).json({
        success: true,
        message: "Blog-category is updated successfully",
        data: result
    })
})

const deleteBlog = asyncHandler(async (req, res) => {
    const { categoryId } = req.params;
    const result = await DeleteBlogCategoryService(categoryId as string);
    res.status(200).json({
        success: true,
        message: "Blog-category is deleted successfully",
        data: result
    })
})


const BlogController = {
    createBlog,
    getBlogs,
    getSingleBlog,
    updateBlog,
    deleteBlog,
}

export default BlogController