import mongoose from "mongoose";
import { Permission } from "../../models/user/permission.model.js";
import { Role } from "../../models/user/role.model.js";

const createRole = async (req, res) => {
    try {
        const userId = req.user._id;
        const { name, permission  } = req.body;

        const existingRole = await Role.findOne({ name });
        if (existingRole) {
            return res.status(400).json({ status: false, message: "Role already exists" });
        }

        const role = new Role({
            name, 
            createdBy: userId
        });
        await role.save();
        const createPermission  = new Permission({
            roleId: role._id,
            name: role.name,
            permission: permission ,
        });
        await createPermission .save();

            res.status(201).json({ role: createPermission  ,status: true, message: "Role and permission created successfully" });
    } catch (error) {
        console.error("Error creating role:", error.message);
        res.status(500).json({ status: false, message: "An error occurred while creating the role" });
    }
}

const getRole = async (req, res) => {
    try {
        const roles = await Role.find()
        console.log(roles)
        res.status(200).json({roles, status: true, message: "Role fetched successfully"})
    } catch (error) {
        console.error("Error creating role:", error.message);
        res.status(500).json({ status: false, message: "An error occurred while creating the role" });
    }
}


const getPermission = async (req, res) => {
    try {
        const {roleId} = req.body
        const validateId = mongoose.Types.ObjectId.isValid(roleId)
        if(!validateId){
            return res.status(400).json({ status: false, message: "Invalid role id"})
        }
        const role = await Permission.find({roleId}).populate('roleId'); 
        console.log(role) 
        res.status(200).json({role, status: true, message: "Permission fetched successfully"})
    } catch (error) {
        console.error("Error creating permission:", error.message);
        res.status(500).json({ status: false, message: "An error occurred while creating the permission" });
    }
}

export const RoleController = {
    createRole,
    getRole,
    getPermission
    
}