import sharedModels from "../../../models/index.js";
import sharedUtils from "../../../utils/index.js";

const { Category } = sharedModels;
const { asyncHandler, ApiErrorResponse, ApiSuccessResponse } = sharedUtils;

const saveOrUpdate = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description } = req.body;

        if (!id) { 
            const exCategory = await Category.findOne({ name });
            if (exCategory) {
                return res.status(409).json({ status: false, message: "Category already exists" });
            }
            if (!name || !description) {
                return res.status(400).json({ status: false, message: "All fields are required" });
            }
            
            const category = await Category.create(
                { name, description }
            )
            return res.status(201).json({ category, status: true, message: "Category created successfully" });
        }else {
            if (!id) {
                return res.status(400).json({ status: false, message: "Category ID is required" });
            }
            // const exCategory = await Category.findOne({ name });
            // if (exCategory) {
            //     return res.status(409).json({ status: false, message: "Category already exists" });
            // }

            const category = await Category.findByIdAndUpdate({_id: id}, { name, description }, { new: true });
            if (!category) {
                return res.status(404).json({ status: false, message: "Category not found" });
            }
            res.status(200).json({ status: true, category, message: "Category updated successfully" });
        }
    } catch (error) {
        res.status(500).json({ status: false, message: "An error occurred while creating category" });
    }
}

const getAllCategories = async (req, res) => {
    try {
        const category = await Category.find().maxTimeMS(1000);
            return res.status(200).json({ status: true, category })
        
    } catch (error) {
        console.error("Error fetching categories:", error.message);
        res.status(500).json({ status: false, message: "An error occurred while fetching categories" });
    }
}

const getById = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({ status: false, message: "Category ID is required" });
        }
        const category = await Category.findById(id);
        if (!category) {
            return res.status(404).json({ status: false, message: "Category not found" });
        }
        res.status(200).json({ status: true, category, message: "Category fetched successfully" });
    } catch (error) {
        console.error("Error fetching category by ID:", error.message);
        res.status(500).json({ status: false, message: "An error occurred while fetching the category" });
    }
}


const deleteCategory = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({ status: false, message: "Category ID is required" });
        }
        const category = await Category.findByIdAndDelete({_id: id});
        if (!category) {
            return res.status(404).json({ status: false, message: "Category not found" });
        }
        res.status(200).json({ status: true, message: "Category deleted successfully" });
    } catch (error) {
        console.error("Error deleting category:", error.message);
        res.status(500).json({ status: false, message: "An error occurred while deleting the category" });
    }
}

const updateCategory = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const { name } = req.body;
    if (!id) return ApiErrorResponse(422, "Category ID is required", next);
    if (!name) return ApiErrorResponse(422, "Category name is required", next);
    const excategory = await Category.findOne({ name });
    if (excategory) return ApiErrorResponse(409, `Category ${name} already exists`, next);
    const category = await Category.findByIdAndUpdate(id)
    if (!category) return ApiErrorResponse(404, "Category not found", next);
    category.name = name;
    await category.save();
    return ApiSuccessResponse(res, 200, {category}, "Category updated successfully");

})

export const categoryController = {
    // createCategory,
    getAllCategories,
    getById,
    deleteCategory,
    saveOrUpdate,
    updateCategory
}