import generateBarcode from "../../../core/barCode.js";
import sharedModels from "../../../models/index.js";

const { Category, Product } = sharedModels;
const createProduct = async (req, res) => {
    try {
        const userId = req.user._id;
        const { name, sku, description, price, stock, category } = req.body; 
        
        if (!name || !sku || !description || !price || !stock || !category) {
            return res.status(401).json({message:"All fields are required"  });
        }
        
        const existingProduct = await Product.findOne({ sku });
        if (existingProduct) {
            return res.status(401).json({ message: `Product with this ${sku} already exists` });
        }

        const categories = Array.isArray(category) ? category : [category];
        const categoryIds = await Promise.all(
            categories.map(async (categoryName) => {
                let categoryExists = await Category.findOne({ name: categoryName });
                if (!categoryExists) {
                    categoryExists = await Category.create({ name: categoryName, description: `${categoryName} description` });
                }
                return categoryExists._id;
            })
        );

        // Create product
        const product = await Product.create({
            name,
            sku,
            description,
            price,
            stock,
            category: categoryIds,
            createdBy: userId,
        });

        const populatedProduct = await Product.findById(product._id).populate("category");
        res.status(201).json({ status: true, message: "Product created successfully", product: populatedProduct });
        
    

        // // Generate barcodes only if there are successful products
        // if (createdProducts.length > 0) {
        //     const barcodes = createdProducts.map(product => product.sku.toString());
        //     await generateBarcode(barcodes);
        // }
 
    } catch (error) {
        return res.status(500).json({ status: false, message: "An error occurred while creating products", error: error.message });
    }
}
const getAllProducts = async (req, res) => {
    const page = Math.max(parseInt(req.query.page) || 1, 1);
    const pageSize = Math.max(parseInt(req.query.pageSize) || 10, 1);
    const skip = (page - 1) * pageSize;
  
    try {
      const [totalProducts, products] = await Promise.all([
        Product.countDocuments(),
        Product.find().populate("category").skip(skip).limit(pageSize)
      ]);
  
      return res.status(200).json({
        status: true,
        products,
        total: totalProducts,
        currentPage: page,
        totalPages: Math.ceil(totalProducts / pageSize),
        message: "Products fetched successfully",
      });
    } catch (error) {
      console.error("Error fetching products:", error.message);
      return res.status(500).json({
        status: false,
        message: "An error occurred while fetching products"
      });
    }
  };
  
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
    const { sku } = req.params;
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

const deleteProduct = async (req, res) => {
    const { id } = req.params;
    if (!id) return res.status(422).json({ status: false, message: "Product ID is required" });
    try {
        const product = await Product.findByIdAndDelete(id);
        if (!product) return res.status(404).json({ status: false, message: "Product not found" });
        return res.status(200).json({ status: true, message: "Product deleted successfully" });
    } catch (error) {
        return res.status(500).json({ status: false, message: "An error occurred while deleting product" });
    }
}

export const productController = {
    createProduct,
    getAllProducts,
    getProductByCategory,
    getById,
    sortProduct,
    deleteProduct
}
