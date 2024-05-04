import mongoose from "mongoose";

const CourseSchema = new mongoose.Schema({
    // Schema definition here
    sender: String,
    text: String,
    room: String,
    timestamp: { type: Date, default: Date.now },
      
    
   
},
{
    collection: "business-message",
  }
);


export const bMessage = mongoose.model('business-Message', CourseSchema);

// module.exports = {
    
//     Course
// }