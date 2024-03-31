import mongoose, { Schema } from "mongoose";

const RequestShema = new Schema({
  employee: {
    type: Schema.Types.ObjectId,
    ref: 'Employee'
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  status: {
    type: String,
    enum : ['pending', 'approved', 'rejected'],
    default: 'pending'
  }
});

export default mongoose.model('Request', RequestShema);
