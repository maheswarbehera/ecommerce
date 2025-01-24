import { Category } from "../../../models/catalog/category/category.model.js";
import { Product } from "../../../models/catalog/product/product.model.js";

const createProduct = async (req, res) => {
    try {
        const userId = req.user._id;
        const productsData = req.body; // Expecting an array of product objects
        const productsArray = Array.isArray(productsData) ? productsData : [productsData];
        if (productsArray.length === 0) {
            return res.status(400).json({ status: false, message: "At least one product is required" });
        }

        const createdProducts = [];
        for (const productData of productsData) {
            const { name, sku, description, price, stock, category } = productData;
            if (!name || !sku || !description || !price || !stock || !category) {
                return res.status(400).json({ status: false, message: "All fields are required" });
            }

            const existingProduct = await Product.findOne({ sku });
            if (existingProduct) {
                return res.status(409).json({ status: false, message: "Product with this SKU already exists" });
            }

            const categories = Array.isArray(category) ? category : [category];
            let categoryIds =[]
            for(const categoryName of categories) {
                let categoryExists = await Category.findOne({name: categoryName});
                if (!categoryExists) {
                    categoryExists = await Category.create({name: categoryName, description: `${categoryName} description`});
                }
                categoryIds.push(categoryExists._id);
            }

            const product = await Product.create({
                name,
                sku,
                description,
                price,
                stock,
                category: categoryIds,
                createdBy: userId
            });
            const createProduct = await Product.findById(product._id).populate('category');
            if(!createProduct) {
                return res.status(404).json({ status: false, message: "Product not found" });
            }
            createdProducts.push(createProduct);
        }
        return res.status(201).json({ product: createdProducts, status: true, message: "Product created successfully" });
    } catch (error) {
        return res.status(500).json({ status: false, message: "An error occurred while creating product" });
    }
}
const getAllProducts = async (req, res) => { 
    try {
        const products = await Product.find() 
        const totalProducts = await Product.countDocuments();
        return res.status(200).json({ status: true, products , totalProducts, message: "Products fetched successfully" });
    } catch (error) {
        console.error("Error fetching products:", error.message);
        res.status(500).json({ status: false, message: "An error occurred while fetching products" });        
    }
}
const sortProduct = async (req, res) => {
    const {sortValue, pageSize} = req.body
    try {
        const totalProducts = await Product.countDocuments();
        let limit = Math.ceil(totalProducts/pageSize) 
        const products = await Product.find().sort({sku: sortValue}).limit(limit);
        
        return res.status(200).json({ status: true, products , displayProducts: limit, totalProducts, message: "filtered Products fetched successfully" });
    } catch (error) {
        console.error("Error fetching products:", error.message);
        res.status(500).json({ status: false, message: "An error occurred while fetching products" });        
    }
}
const getProductByCategory = async (req, res) => {
    const { categoryName } = req.params;
    if (!categoryName) {
        return res.status(400).json({ status: false, message: "Category name is required" });
    }
    try {

        const products = await Product.aggregate([
            {
                $lookup: {
                    from: 'categories',
                    localField: 'category',
                    foreignField: '_id',
                    as: 'category'
                },
            },
            {
                $match: {
                    'category.name': categoryName
                }
            }
        ]);
        if (!products || products.length === 0) {
            return res.status(404).json({ message: "No products found in this category" }); 
        }
        return res.status(200).json({ status: true, products , message: "Products fetched successfully" });
    } catch (error) {
        return res.status(500).json({ status: false, message: "An error occurred while fetching products" });
    }
}

const getById = async (req, res) => {
    const { sku } = req.body;
    try {
        const product = await Product.findOne({sku})

        if(!product){
            return res.status(404).json({ message: "Product not found" });
        }

        return res.status(200).json({ product, status: true, message: "Product fetched successfully" });
    } catch (error) {
        return res.status(500).json({ status: false, message: "An error occurred while fetching product" });
    }
}

export const productController = {
    createProduct,
    getAllProducts,
    getProductByCategory,
    getById,
    sortProduct
}
