import mongoose from "mongoose";
import { Permission } from "../../models/user/permission.model.js";
import { Role } from "../../models/user/role.model.js";

const createRole = async (req, res) => {
    try { 
        const userRole = req.user.role;  // Adjust based on authentication

        // Validate role existence
        if (!mongoose.Types.ObjectId.isValid(userRole)) {
            return res.status(400).json({ status: false, message: "Invalid user role ID" });
        }

        const exrole = await Role.findById(userRole);
        if (!exrole) {
            return res.status(404).json({ status: false, message: "Role not found" });
        }

        // Only allow 'admin' to create roles
        if (exrole.name !== 'admin') {
            return res.status(403).json({
                status: false,
                message: "You do not have permission to create roles. Admin access required."
            });
        }

        const { permission, roleName } = req.body;
 
        // Validate role name
        if (!roleName || typeof roleName !== "string") {
            return res.status(400).json({ status: false, message: "Invalid or missing role name" });
        }

        // Validate permissions
        const validatedPermission = {
            read: permission?.read || false,
            write: permission?.write || false,
            update: permission?.update || false,
            delete: permission?.delete || false, // Ensure default value
        };

        // Check if the role already exists
        const existingRole = await Role.findOne({ name: roleName });
        if (existingRole) {
            return res.status(400).json({ status: false, message: "Role already exists" });
        }

        // Check if an identical permission set already exists
        let existingPermission = await Permission.findOne(validatedPermission);
        if (!existingPermission) {
            existingPermission = new Permission(validatedPermission);
            await existingPermission.save();
        }

        // Create a new role with associated permissions
        const newRole = new Role({
            name: roleName,
            permissions: [existingPermission._id]
        });

        await newRole.save();

        res.status(201).json({ role: newRole, status: true, message: "Role and permission created successfully" });
    } catch (error) {
        console.error("Error creating role:", error.message);
        res.status(500).json({ status: false, message: "An error occurred while creating the role" });
    }
};

const getRole = async (req, res) => {
    try {
        const roles = await Role.find().populate('permissions');
        res.status(200).json({ roles, status: true, message: "Roles fetched successfully" });
    } catch (error) {
        console.error("Error fetching roles:", error.message);
        res.status(500).json({ status: false, message: "An error occurred while fetching roles" });
    }
};

const getPermission = async (req, res) => {
    try {
        const { roleId } = req.body;

        if (!mongoose.Types.ObjectId.isValid(roleId)) {
            return res.status(400).json({ status: false, message: "Invalid role ID" });
        }

        const role = await Role.findById(roleId).populate('permissions');
        if (!role) {
            return res.status(404).json({ status: false, message: "Role not found" });
        }

        res.status(200).json({ role, status: true, message: "Permissions fetched successfully" });
    } catch (error) {
        console.error("Error fetching permissions:", error.message);
        res.status(500).json({ status: false, message: "An error occurred while fetching permissions" });
    }
};

export const RoleController = {
    createRole,
    getRole,
    getPermission
};
