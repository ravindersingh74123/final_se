import mongoose from "mongoose";

const CourseSchema = new mongoose.Schema({
    // Schema definition here
    destination:String,
    user:String,
    username:String,
    
    
    date:String
      
    
   
},
{
    collection: "travelDetails",
  }
);


export const Travel = mongoose.model('travel', CourseSchema);

// module.exports = {
    
//     Course
// }
