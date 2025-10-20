const mongoose=require("mongoose");
const review = require("./review");
const Schema=mongoose.Schema;
const Review=require("./review.js");

const listingSchema=new Schema({
    title:{
        type:String,
    required:true,
},
    description:{
        type:String,
        
   },
//     image:{
//         type:String,
//         default:"https://plus.unsplash.com/premium_photo-1666286163385-abe05f0326c4?q=80&w=1075&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
//         set: (v)=>v===""
//         ? "https://plus.unsplash.com/premium_photo-1666286163385-abe05f0326c4?q=80&w=1075&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
//         :v,
//    },
   image: {
  filename: {
    type: String,
    default: "listingimage"
  },
  url: {
    type: String,
    default: "https://plus.unsplash.com/...default.jpg",
    set: (v) =>
      v === ""
        ? "https://plus.unsplash.com/...default.jpg"
        : v,
  }
}
,
    price:{
        type:Number,
        
   },
    location:{
        type:String,
        
   },
    country:{
        type:String,
        
   },
   reviews:[
    {
      type:Schema.Types.ObjectId,
      ref:"Review",
    },
   ],
   owner:{
    type: Schema.Types.ObjectId,
    ref:"User",
   },
    geometry: {
    type: {
      type: String,
      enum: ['Point'], // must be 'Point'
      
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      
    }
  },
});

listingSchema.post("findOneAndDelete", async(listing)=>{
  if(listing){
    await Review.deleteMany({_id: {$in: listing.reviews}});
  }
});


const Listing=mongoose.model("Listing", listingSchema);
module.exports=Listing;
