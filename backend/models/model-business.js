import mongoose from "mongoose";

const CourseSchema = new mongoose.Schema({
    // Schema definition here
    businessName:String,
    user:String,
    username:String,
    
    
    details:String
      
    
   
},
{
    collection: "business",
  }
);


export const Business = mongoose.model('business', CourseSchema);

// module.exports = {
    
//     Course
// }
