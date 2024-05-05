import mongoose from "mongoose";

const CourseSchema = new mongoose.Schema({
    // Schema definition here
    title:String,
    name:String,
    username:String,
    
    image:String
      
    
   
},
{
    collection: "ImageDetails",
  }
);


export const Course = mongoose.model('Course', CourseSchema);

// module.exports = {
    
//     Course
// }
