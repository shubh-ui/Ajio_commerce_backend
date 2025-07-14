const mongoose = require('mongoose');

const imageSchema = new mongoose.Schema({
  altText: String,
  format: String,
  imageType: String,
  url: String
});

const extraImageSchema = new mongoose.Schema({
  model: String,
  images: [{
    format: String,
    url: String
  }]
});

const priceSchema = new mongoose.Schema({
  currencyIso: { type: String, default: 'INR' },
  formattedValue: String,
  displayformattedValue: String,
  value: Number
});

const offerPriceSchema = new mongoose.Schema({
  currencyIso: { type: String, default: 'INR' },
  value: Number,
  formattedValue: String,
  displayformattedValue: String,
  priceReveal: mongoose.Schema.Types.Mixed,
  giftAvailable: { type: Boolean, default: false }
});

const fnlColorVariantDataSchema = new mongoose.Schema({
  brandName: String,
  outfitPictureURL: String,
  allPromotions: { type: Boolean, default: false },
  colorGroup: String
});

const fnlProductDataSchema = new mongoose.Schema({
  planningCategory: String
});

const productSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true },
  couponStatus: String,
  fnlColorVariantData: fnlColorVariantDataSchema,
  averageRating: Number,
  images: [imageSchema],
  extraImages: [extraImageSchema],
  fnlProductData: fnlProductDataSchema,
  discountPercent: String,
  price: priceSchema,
  wasPriceData: priceSchema,
  name: { type: String, required: true },
  brickName: String,
  verticalName: String,
  segmentName: String,
  catalogName: String,
  brandTypeName: String,
  url: String,
  offerPrice: offerPriceSchema,
  ratingCount: String,
  segmentNameText: String,
  verticalNameText: String,
  brickNameText: String,
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Indexes for better performance
productSchema.index({ code: 1 });
productSchema.index({ name: 'text' });
productSchema.index({ brickName: 1 });
productSchema.index({ verticalName: 1 });
productSchema.index({ segmentName: 1 });
productSchema.index({ brandTypeName: 1 });
productSchema.index({ 'price.value': 1 });
productSchema.index({ averageRating: -1 });

module.exports = mongoose.model('Product', productSchema);