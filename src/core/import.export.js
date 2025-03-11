import sharedModels from '../models/index.js'
import fs from "fs";
import fastCsv from "fast-csv";
import path from "path"; 
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// 📤 **Export Products to CSV**
const exportCsv = async (req, res) => {
    try {
      const products = await sharedModels.Product.find().lean();
      const Repath = path.join('public', 'temp', "products.csv");
     console.log(Repath)
      const filePath = path.resolve(Repath)
      const ws = fs.createWriteStream(filePath);
  
      fastCsv
        .write(products, { headers: true })
        .pipe(ws)
        .on("finish", () => res.download(filePath, "products.csv"));
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
      .on("data", (row) => {
        productsArray.push({
          name: row.name,
          sku: row.sku,
          description: row.description,
          price: parseFloat(row.price),
          stock: parseInt(row.stock),
          category: [], // You can update this field dynamically
          createdBy: "65fc92c2e89a0b1234567890", // Example user ID (update dynamically)
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