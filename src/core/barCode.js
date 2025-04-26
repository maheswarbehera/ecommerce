import bwipJs from "bwip-js";
import fs from "fs";
import path from "path";

const generateBarcode = async (skus) => {
    if (!Array.isArray(skus)) {
        throw new Error("Expected an array of SKU strings");
    }

    for (const sku of skus) {
        try {
            const barcodeBuffer = await bwipJs.toBuffer({
                bcid: "code128", // Barcode type
                text: sku, // SKU as string
                scale: 3, // Scaling factor
                height: 10, // Barcode height
                includetext: true, // Show text below barcode
                textxalign: "center",
            });

            // Save barcode image
            const Repath = path.join('public','barcodes', `${sku}.png`);
            const filePath = path.resolve(Repath);
            fs.writeFileSync(filePath, barcodeBuffer);
            console.log(`Barcode generated for SKU: ${sku}`);
        } catch (error) {
            console.error(`Error generating barcode for ${sku}:`, error);
        }
    }
};

export default generateBarcode;
