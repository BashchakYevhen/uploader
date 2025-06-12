import mongoose from "mongoose";
const Schema = mongoose.Schema;
const fileSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
 
  url: {
    type: Array,
    required: true,
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});
const File = mongoose.model("File", fileSchema);
export default File;
