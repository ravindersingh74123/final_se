import mongoose from "mongoose";

const CourseSchema = new mongoose.Schema({
    // Schema definition here
    sender: String,
    text: String,
    room: String,
    timestamp: { type: Date, default: Date.now },
      
    
   
},
{
    collection: "lost-message",
  }
);


export const lMessage = mongoose.model('MMessage', CourseSchema);

// module.exports = {
    
//     Course
// }