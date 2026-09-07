const { Router } = require("express");
const { userModel } = require("../db");
const { z } = require('zod');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const JWT_SECRET = "secr3t";

const userRouter = Router();

const signupSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
    firstName: z.string().min(1),
    lastName: z.string().min(1)
});

userRouter.post("/signup", async function (req, res) {
    try {
        //  Validate request body
        const parsedData = signupSchema.parse(req.body);
        console.log(parsedData);
        const { email, password, firstName, lastName } = parsedData;

        //  Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);
        console.log(hashedPassword);

        //  Save user in DB
        await userModel.create({
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
});




// ✅ Zod schema for signin
const signinSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
});



userRouter.post("/signin", async function (req, res) {
    try {
        const parsedData = signinSchema.parse(req.body);
        const { email, password } = parsedData;

        // Find user in db
        const user = await userModel.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: "Invalid email or password" })
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid password" });
        }

        // Generating token
        const token = jwt.sign({
            id: user._id, email: user.email
        }, JWT_SECRET);
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

userRouter.get("/purchases", function (req, res) {
    res.json({
        message: "signup endpoint"
    })
})

module.exports = {
    userRouter: userRouter
}