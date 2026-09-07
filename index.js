require('dotenv').config()
console.log(process.env.MONGO_URL);
const express = require('express');
const mongoose=require('mongoose');
const { userRouter } = require("./routes/user");
const { adminRouter } = require("./routes/admin");
const { courseRouter } = require("./routes/course");
const app = express();
app.use(express.json());

app.use("/user", userRouter);
app.use("/admin", adminRouter);
app.use("/course", courseRouter);

// createUserRoutes(app);
// createCourseRoutes(app);
async function main(){
    await mongoose.connect(process.env.MONGO_URL);
app.listen(3000);
console.log("Listening on port 3000");
}

main();