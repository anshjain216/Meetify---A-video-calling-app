import mongoose, {Schema} from "mongoose";

const meetingSchema = new Schema({
    user_id:{type:mongoose.Schema.Types.ObjectId,ref:"user"},
    meetingId:{type:String,required:true},
    date: {type:Date,default:Date.now,required:true}
})

const meetingModel = mongoose.model("meeting",meetingSchema);

export default meetingModel;