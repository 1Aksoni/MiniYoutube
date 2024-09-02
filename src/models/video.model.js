import mongoose ,{ Schema, Types} from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const VideoSchema  = new Schema(
    {
       videoFile :{
        type : String, //Cloudinary url
        required: true
       },
       thumbnail :{
        type : String, //Cloudinary url
        required: true
       },
       title :{
        type : String, 
        required: true
       },
       description :{
        type : String, 
        required: true
       },
       duration :{
        type : Number, // From Cloudinary 
        required: true
       },
       views :{
        type : Number, 
        default: 0
       },
       isPublished :{
        type : Boolean, 
        default: true
       },
       title :{
        type : String, 
        required: true
       },
       owner :{
        type : Schema.Types.ObjectId, 
        ref :"User"
       }
    },
    {
        timestamps: true
    }
)

VideoSchema.plugin(mongooseAggregatePaginate)
export const Video = mongoose.model("Vidoe", VideoSchema)