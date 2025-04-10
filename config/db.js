const mongoose = require("mongoose")

const connectDB = async() =>{
    try{
        await mongoose.connect(process.env.DATABASE_DEPLOY)
        console.log("Database connection successful")  // เชื่อมต่อฐานข้อมูลสำเร็จ
    }catch(err){
        console.log(err)
        process.exit(1)
    }
}

module.exports = connectDB;