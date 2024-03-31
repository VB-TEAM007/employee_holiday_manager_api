import mongoose, { Schema } from "mongoose";

const TokenShema = new Schema({
  refreshToken: {
    type: String,
    required: true
  },
  employee: {
    type: Schema.Types.ObjectId,
    ref: 'Employee'
  },
});

export default mongoose.model('Token', TokenShema);
