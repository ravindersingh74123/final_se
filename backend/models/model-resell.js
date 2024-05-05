import mongoose from "mongoose";

const CourseSchema = new mongoose.Schema({
    // Schema definition here
    title:String,
    name:String,
    username:String,
    price:String,
    
    image:String
      
    
   
},
{
    collection: "Resell",
  }
);


export const Resell = mongoose.model('Resell', CourseSchema);

// module.exports = {
    
//     Course
// }
