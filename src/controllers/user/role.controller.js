import sharedUtils from "../../utils/index.js";
import sharedModels from "../../models/index.js";

const { Role, Permission } = sharedModels;
const { ApiSuccessResponse, ApiErrorResponse, asyncHandler } = sharedUtils;

const createRole = asyncHandler(async (req, res, next) => {
    const { permission, roleName } = req.body; 
    if (!roleName || typeof roleName !== "string") return ApiErrorResponse(422, "Role name is required", next);
    
    const exRole = await Role.findOne({ name: roleName.toLowerCase() });
    if (exRole) return ApiErrorResponse(404, "Role already exists", next); 
    
    // Validate permissions
    const validatedPermission = {
        read: permission?.read || false,
        write: permission?.write || false,
        update: permission?.update || false,
        delete: permission?.delete || false, // Ensure default value
    }; 

    // Check if permission set already exists
    let existingPermission = await Permission.findOne(validatedPermission);
    if (!existingPermission) {
        existingPermission = new Permission(validatedPermission);
        await existingPermission.save();
    }

    // Create a new role with permissions
    const newRole = new Role({
        name: roleName.toLowerCase(),
        permissions: [existingPermission._id]
    });

    await newRole.save();
    return ApiSuccessResponse(res,201, { role: newRole}, "Role and permission created successfully"); 
});

const getRole = asyncHandler(async (req, res) => {
    const roles = await Role.find().populate('permissions');
    if (!roles) return ApiErrorResponse(404, "Roles not found", next);
    return ApiSuccessResponse(res, 200, { roles }, "Roles fetched successfully"); 
});

const getPermission = asyncHandler(async (req, res, next) => {
    const { id } = req.body;
    if (!id) return ApiErrorResponse(422, "ID is required", next); 

    const role = await Role.findById(id).populate('permissions');
    if (!role) return ApiErrorResponse(404, "Role not found", next);
    return ApiSuccessResponse(res, 200, { role }, "Permissions fetched successfully");
});

export const roleController = {
    createRole,
    getRole,
    getPermission
};
