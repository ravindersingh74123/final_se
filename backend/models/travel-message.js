import mongoose from "mongoose";

const CourseSchema = new mongoose.Schema({
    // Schema definition here
    sender: String,
    text: String,
    room: String,
    iD: Number,
    timestamp: { type: Date, default: Date.now },
      
    
   
},
{
    collection: "travel-message",
  }
);


export const tMessage = mongoose.model('travel-Message', CourseSchema);

// module.exports = {
    
//     Course
// }