const express=require("express");
const router=express.Router();
const wrapAsync=require("../utils/wrapAsync.js");
const Listing=require("../models/listing.js");

const {isLoggedIn, isOwner, validateListing }=require("../views/middleware.js");

const listingController = require("../controllers/listings.js");
const { storage }=require("../cloudConfig.js");

const multer = require('multer');
const upload = multer({ storage}); // basic setup

router
.route("/")
.get(wrapAsync(listingController.index))
.post(isLoggedIn,
upload.single("listing[image]"),
validateListing,
    wrapAsync(listingController.createForm));


//New Route
router.get("/new", isLoggedIn , listingController.renderNewForm);

router
.route("/:id")
.get(wrapAsync(listingController.renderShowForm) )
.put(isLoggedIn,
    isOwner,
    upload.single("listing[image]"),
    validateListing,
     wrapAsync(listingController.updateForm))
.delete(isLoggedIn,isOwner, wrapAsync(listingController.deleteForm));


//EDIT ROUTE
router.get("/:id/edit",isLoggedIn, isOwner, wrapAsync(listingController.renderEditForm));

// router.put("/:id", isLoggedIn, validateListing, wrapAsync(async (req, res) => {
//     const { id } = req.params;

//     // Find the listing first
//     const listing = await Listing.findById(id);

//     if (!listing) {
//         req.flash("error", "Listing not found");
//         return res.redirect("/listings");
//     }

//     // Check ownership
//     if (!req.user || !req.user._id.equals(listing.owner)) {
//         req.flash("error", "You don't have permission to edit");
//         return res.redirect(`/listings/${id}`);
//     }

//     // Update the listing
//     await Listing.findByIdAndUpdate(id, { ...req.body.listing }, { runValidators: true });

//     req.flash("success", "Listing updated!");
//     res.redirect(`/listings/${id}`);
// }));

module.exports=router;
