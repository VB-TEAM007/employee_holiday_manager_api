import mongoose, { Schema } from "mongoose";

const EmployeeShema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  password: {
      type: String,
      required: true
  },
  remainingHolidays: {
    type: String,
    default: 20
  },
  role: {
    type: String,
    enum : ['employee', 'admin'],
    default: 'employee'
  }
});

export default mongoose.model('Employee', EmployeeShema);
