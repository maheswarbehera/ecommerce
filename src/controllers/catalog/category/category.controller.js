import sharedModels from "../../../models/index.js";
import { clearCacheByKey } from "../../../utils/cache.js";
import sharedUtils from "../../../utils/index.js";

const { Category } = sharedModels;
const { asyncHandler, ApiErrorResponse, ApiSuccessResponse } = sharedUtils; 

const saveOrUpdate = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const { name, description } = req.body;

    if (!name) return ApiErrorResponse( 400, "category name is required", next); 
    const exCategory = await Category.findOne({ name: name.toLowerCase(), _id: { $ne: id }});
    if (exCategory) return ApiErrorResponse(409, `Category ${name} already exists`, next); 

    let category;
    let message;
    if (id) {        
        category = await Category.findByIdAndUpdate( id, { name, description }, { new: true, runValidators: true });
        message = "Category updated successfully"; 
    }else {   
        category = await Category.create({ 
            name: name.toLowerCase(),
            description: description || `${name} Description` 
        })
        message = "Category created successfully" 
    }
    const getCategoryCacheKey = () => 'categoryCache';
    clearCacheByKey(getCategoryCacheKey());
    if (!category) return ApiErrorResponse(500, `An error occurred while processing the request`, next);
    return ApiSuccessResponse(res, id ? 200 : 201, { category }, message);
})

const getAllCategories = asyncHandler(async (req, res, next) => {
    const categories  = await Category.find() 
    if (!categories.length ) return ApiErrorResponse(404, "No categories found", next);
    return ApiSuccessResponse(res, 200, {categories}, "Categories fetched successfully"); 
})

const getById = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    if (!id) return ApiErrorResponse(400, "Category ID is required", next); 
    const category = await Category.findById(id);
    if (!category) return ApiErrorResponse(404, "Category not found", next); 
    return ApiSuccessResponse(res, 200, {category}, "Category fetched successfully"); 
})


const deleteCategory = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    if (!id) return ApiErrorResponse(400, "Category ID is required", next);
    const category = await Category.findByIdAndDelete(id);
    if (!category) return ApiErrorResponse(404, "Category not found", next); 
    const getCategoryCacheKey = () => 'categoryCache';
    clearCacheByKey(getCategoryCacheKey());
    return ApiSuccessResponse(res, 200, null, "Category deleted successfully"); 
})

export const categoryController = {
    getAllCategories,
    getById,
    deleteCategory,
    saveOrUpdate,
}