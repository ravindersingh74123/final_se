import mongoose from "mongoose";

const CourseSchema = new mongoose.Schema({
    // Schema definition here
    sender: String,
    text: String,
    room: String,
    timestamp: { type: Date, default: Date.now },
      
    
   
},
{
    collection: "resell-message",
  }
);


export const rMessage = mongoose.model('resell-Message', CourseSchema);

// module.exports = {
    
//     Course
// }