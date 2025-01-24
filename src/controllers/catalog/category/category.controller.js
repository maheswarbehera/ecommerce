import { Category } from "../../../models/catalog/category/category.model.js";

const createCategory = async (req, res) => {
    try {
        const category = await Category.create(req.body)
        return res.status(201).json({ category, status: true, message: "Category created successfully" });
    } catch (error) {
        res.status(500).json({ status: false, message: "An error occurred while creating category" });
    }
}

const getAllCategories = async (req, res) => {
    try {
        const category = await Category.find() 
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

export const categoryController = {
    createCategory,
    getAllCategories,
    getById
}