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
    await mongoose.connect("mongodb+srv://jashanps0909_db_user:BTtqmjm7nEWijEEo@cluster0.7vjpndu.mongodb.net/coursera-app")
app.listen(3000);
console.log("Listening on port 3000");
}

main();