import { User } from "../models/user.js";
import { TryCatch } from "../middlewares/error.js";
import ErrorHandler from "../utils/utility-class.js";
import fs from 'fs';
import axios from "axios";
import { Product } from "../models/product.js";
const createCsv = async (_id) => {
    let allUsers = await User.find({});
    let usersAndProductViewed = allUsers.map(singleUser => ({
        [singleUser._id]: singleUser.productViewed
    }));
    const headers = new Set();
    for (const obj of usersAndProductViewed) {
        for (const key in obj) {
            if (obj[key] instanceof Map) {
                obj[key].forEach((value, subKey) => {
                    headers.add(subKey);
                });
            }
        }
    }
    const rows = usersAndProductViewed.map(obj => {
        const row = [];
        for (const key in obj) {
            row.push(key);
            if (obj[key] instanceof Map) {
                headers.forEach((header) => {
                    row.push(obj[key].get(header) || 0); // Use 0 if value not present
                });
            }
        }
        return row;
    });
    // Insert column headers as the first row
    rows.unshift(['users', ...headers]);
    const csvContent = rows.map(row => row.join(',')).join('\n');
    fs.writeFile('../userAndProductsViewedData.csv', csvContent, (err) => {
        if (err) {
            console.error('Error writing to CSV file:', err);
        }
        else {
            console.log('Data written to CSV file');
        }
    });
};
const setRecommendations = async (_id) => {
    const url = 'http://127.0.0.1:5000/recommendations';
    let productIds = [];
    const response = await axios.post(url, { _id });
    productIds = response.data.recommendations;
    console.log("response ", response);
    console.log("productIds ", productIds);
    const products = await Promise.all(productIds.map(async (id) => {
        return await Product.findById(id);
    }));
    let user = await User.findById(_id);
    if (user) {
        user.recommendedProducts = products;
    }
    user?.save();
};
export const newUser = TryCatch(async (req, res, next) => {
    const { name, email, photo, gender, _id, dob } = req.body;
    let user = await User.findById(_id);
    try {
        await createCsv(_id);
        console.log("csv file written");
        await setRecommendations(_id);
        console.log("recommendations updated");
    }
    catch (err) {
        console.log("err", err);
    }
    if (user)
        return res.status(200).json({
            success: true,
            message: `Welcome, ${user.name}`,
        });
    if (!_id || !name || !email || !photo || !gender || !dob)
        return next(new ErrorHandler("Please add all fields", 400));
    user = await User.create({
        name,
        email,
        photo,
        gender,
        _id,
        dob: new Date(dob),
    });
    return res.status(201).json({
        success: true,
        message: `Welcome, ${user.name}`,
    });
});
export const getAllUsers = TryCatch(async (req, res, next) => {
    const users = await User.find({});
    return res.status(200).json({
        success: true,
        users,
    });
});
export const getUser = TryCatch(async (req, res, next) => {
    const id = req.params.id;
    const user = await User.findById(id);
    if (!user)
        return next(new ErrorHandler("Invalid Id", 400));
    return res.status(200).json({
        success: true,
        user,
    });
});
export const deleteUser = TryCatch(async (req, res, next) => {
    const id = req.params.id;
    const user = await User.findById(id);
    if (!user)
        return next(new ErrorHandler("Invalid Id", 400));
    await user.deleteOne();
    return res.status(200).json({
        success: true,
        message: "User Deleted Successfully",
    });
});
export const newlyViewedProduct = TryCatch(async (req, res, next) => {
    const { _id, _product_id } = req.body;
    try {
        await createCsv(_id);
        console.log("csv file written");
        await setRecommendations(_id);
        console.log("recommendations updated");
    }
    catch (err) {
        console.log("err", err);
    }
    try {
        let user = await User.findById(_id);
        if (user) {
            if (user.productViewed.has(_product_id)) {
                user.productViewed.set(_product_id, user.productViewed.get(_product_id) + 1);
            }
            else {
                user.productViewed.set(_product_id, 1);
            }
            await user.save();
        }
        else {
            throw new Error("User not found");
        }
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
});
