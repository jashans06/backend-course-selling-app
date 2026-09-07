const { Router } = require("express");
const adminRouter = Router();
const { adminModel } = require("../db");
const { courseModel } = require("../db");
const { z } = require('zod');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { JWT_ADMIN_SECRET } = require("../config");
const { adminMiddleware } = require("../middlewares/admin");


const signupSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
    firstName: z.string().min(1),
    lastName: z.string().min(1)
});

adminRouter.post("/signup", async function (req, res) {
    try {
        //  Validate request body
        const parsedData = signupSchema.parse(req.body);
        console.log(parsedData);
        const { email, password, firstName, lastName } = parsedData;

        //  Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);
        console.log(hashedPassword);

        //  Save admin in DB
        await adminModel.create({
            email,
            password: hashedPassword,
            firstName,
            lastName,
        });

        res.json({
            message: "Signup successful",
        });
    } catch (err) {
        //  Handle validation errors separately
        if (err instanceof z.ZodError) {
            return res.status(400).json({
                message: "Validation failed",
                errors: err.errors,
            });
        }

        console.error(err);
        res.status(500).json({
            message: "Internal server error",
        });
    }
})


const signinSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
});

adminRouter.post("/signin", async function (req, res) {
    try {
        const parsedData = signinSchema.parse(req.body);
        const { email, password } = parsedData;

        // Find admin in db
        const admin = await adminModel.findOne({ email });
        if (!admin) {
            return res.status(401).json({ message: "Invalid email or password" })
        }

        const isMatch = await bcrypt.compare(password, admin.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid password" });
        }

        // Generating token
        const token = jwt.sign({
            id: admin._id, email: admin.email
        }, JWT_ADMIN_SECRET);
        res.json({
            message: "Signin successful",
            token,
        })
    } catch (err) {
        if (err instanceof z.ZodError) {
            return res.status(400).json({
                message: "Validation failed",
                errors: err.errors,
            });
        }
        console.error(err);
        res.status(500).json({
            message: "Internal server error",
        });
    }

})


adminRouter.post("/course", adminMiddleware, async function (req, res) {
    const adminId = req.userId;
    const { title, description, imageUrl, price } = req.body;

    const course = await courseModel.create({
        title, description, imageUrl, price, creatorId: adminId
    })

    res.json({
        message: "Course Created",
        courseId: course._id
    })
})

adminRouter.put("/course", function (req, res) {

    
    res.json({
        message: "signup endpoint"
    })
})

adminRouter.get("/course/bulk", function (req, res) {
    res.json({
        message: "signup endpoint"
    })
})

module.exports = {
    adminRouter: adminRouter
}