import sharedModels from '../models/index.js'
import fs from "fs";
import fastCsv from "fast-csv";
import path from "path";  

const capitalizeFirstLetter = (string) => {
  if (!string) return '';
  return string.charAt(0).toUpperCase() + string.slice(1);
};

const exportCsv = async (req, res) => {

  try {
      const name = req.params.name;
      const capitalizedModel = capitalizeFirstLetter(name); // Capitalizing the model name
  
    if (!sharedModels[capitalizedModel]) {
      return res.status(400).json({ message: "Invalid model specified" });
    }

    const products = await sharedModels[capitalizedModel].find().lean();
      const filePath = path.resolve('public', 'temp', `${capitalizedModel}s.csv`);
      console.log(filePath)
      const ws = fs.createWriteStream(filePath);
  
      fastCsv
        .write(products, { headers: true })
        .pipe(ws)
        .on("finish", () => res.download(filePath, `${name}.csv`));
    } catch (error) { 
      res.status(500).json({ message: "Error exporting CSV", error });
    }
};

 const importCsv = async (req, res) => {
    if (!req.file) return res.status(400).json({ message: "No file uploaded" });
  
    const filePath = req.file.path;
    
    const productsArray = [];
  // res.json("ol")
    fs.createReadStream(filePath)
      .pipe(fastCsv.parse({ headers: true }))
      .on("data",async (row) => {
        const categories = row.category
        ? await Promise.all(
            row.category.split(",").map(async (c) => {
              c = c.trim();
              if (!c) return null; // Skip empty category names
    
              let categoryDoc = await sharedModels.Category.findOne({ name: c.toLowerCase() });
              if (!categoryDoc) {
                categoryDoc = await sharedModels.Category.create({ name: c.toLowerCase(), description: c }); // Create if not found
              }
              return categoryDoc._id; // Return ObjectId
            })
          )
        : [];

        productsArray.push({
          name: row.name,
          sku: row.sku,
          description: row.description,
          price: parseFloat(row.price),
          stock: parseInt(row.stock),
          category: categories.filter((id) => id !== null),  
          createdBy: req.user,  
        });
      })
      .on("end", async () => {
        // fs.unlinkSync(filePath);
        try {
          await sharedModels.Product.insertMany(productsArray);
          res.json({ message: "CSV Imported", products: productsArray });
        } catch (error) {
          res.status(500).json({ message: "Error saving data", error });
        }
      });
  };
export const CSV = {
    exportCsv,
    importCsv
}