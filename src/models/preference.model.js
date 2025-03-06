import mongoose, {Schema} from "mongoose";
const UserPreferenceSchema = new mongoose.Schema({
    userId: {type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    preferences: {
        product: {
          is_display_name: { type: Boolean, default: true },
          is_display_price: { type: Boolean, default: true },
          is_display_sku: { type: Boolean, default: true },
          is_display_stock: { type: Boolean, default: true }
        },
        category: {
          is_display_name: { type: Boolean, default: true },
          is_display_description: { type: Boolean, default: true }
        },
        order: {
          is_display_orderId: { type: Boolean, default: true },
          is_display_totalAmount: { type: Boolean, default: true },
          is_display_status: { type: Boolean, default: true }
        }
      }
  });
 export const UserPreference = mongoose.model("UserPreference", UserPreferenceSchema);