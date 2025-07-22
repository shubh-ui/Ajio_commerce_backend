const Product = require('../models/Product');
const Joi = require('joi');

const imageSchema = Joi.object({
  altText: Joi.string().allow(null, ''),
  format: Joi.string().allow(null, ''),
  imageType: Joi.string().allow(null, ''),
  url: Joi.string().uri().required()
});

const extraImageSchema = Joi.object({
  model: Joi.string().required(),
  images: Joi.array().items(
    Joi.object({
      format: Joi.string().required(),
      url: Joi.string().uri().required()
    })
  ).required()
});

const priceSchema = Joi.object({
  currencyIso: Joi.string().default('INR'),
  formattedValue: Joi.string().allow(null, ''),
  displayformattedValue: Joi.string().allow(null, ''),
  value: Joi.number().required()
});

const offerPriceSchema = Joi.object({
  currencyIso: Joi.string().default('INR'),
  value: Joi.number().required(),
  formattedValue: Joi.string().allow(null, ''),
  displayformattedValue: Joi.string().allow(null, ''),
  priceReveal: Joi.alternatives().try(Joi.string(), Joi.boolean(), Joi.object(), Joi.number()),
  giftAvailable: Joi.boolean().default(false)
});

const fnlColorVariantDataSchema = Joi.object({
  brandName: Joi.string().allow(null, ''),
  outfitPictureURL: Joi.string().uri().allow(null, ''),
  allPromotions: Joi.boolean().default(false),
  colorGroup: Joi.string().allow(null, '')
});

const fnlProductDataSchema = Joi.object({
  planningCategory: Joi.string().allow(null, '')
});

const productValidationSchema = Joi.object({
  code: Joi.string().required(),
  couponStatus: Joi.string().valid('ACTIVE', 'AVAILABLE', 'EXPIRED').optional(),
  fnlColorVariantData: fnlColorVariantDataSchema.optional(),
  averageRating: Joi.number().min(0).max(5).optional(),
  ratingCount: Joi.string().optional(),

  images: Joi.array().items(imageSchema).optional(),
  extraImages: Joi.array().items(extraImageSchema).optional(),

  fnlProductData: fnlProductDataSchema.optional(),
  discountPercent: Joi.string().optional(),

  price: priceSchema.required(),
  wasPriceData: priceSchema.optional(),

  name: Joi.string().required(),
  brickName: Joi.string().optional(),
  verticalName: Joi.string().optional(),
  segmentName: Joi.string().optional(),
  catalogName: Joi.string().optional(),
  brandTypeName: Joi.string().optional(),
  url: Joi.string().optional(),

  offerPrice: offerPriceSchema.optional(),

  segmentNameText: Joi.string().optional(),
  verticalNameText: Joi.string().optional(),
  brickNameText: Joi.string().optional(),

  isActive: Joi.boolean().default(true)
});


// Get all products with pagination and filtering
exports.getProducts = async (req, res) => {
  try {
    const {
      page = 0,
      limit = 45,
      sort = 'relevance',
      search,
      category,
      brand,
      minPrice,
      maxPrice,
      minRating
    } = req.query;

    // Build query object
    const query = { isActive: true };

    if (search) {
      query.$text = { $search: search };
    }

    if (category) {
      query.brickName = category;
    }

    if (brand) {
      query.brandTypeName = brand;
    }

    if (minPrice || maxPrice) {
      query['price.value'] = {};
      if (minPrice) query['price.value'].$gte = Number(minPrice);
      if (maxPrice) query['price.value'].$lte = Number(maxPrice);
    }

    if (minRating) {
      query.averageRating = { $gte: Number(minRating) };
    }

    // Build sort object
    let sortObj = {};
    switch (sort) {
      case 'price_low':
        sortObj = { 'price.value': 1 };
        break;
      case 'price_high':
        sortObj = { 'price.value': -1 };
        break;
      case 'rating':
        sortObj = { averageRating: -1 };
        break;
      case 'newest':
        sortObj = { createdAt: -1 };
        break;
      default:
        sortObj = { createdAt: -1 };
    }

    const skip = page * limit;
    const products = await Product.find(query)
      .sort(sortObj)
      .skip(skip)
      .limit(Number(limit));

    const totalResults = await Product.countDocuments(query);
    const totalPages = Math.ceil(totalResults / limit);

    res.json({
      products,
      pagination: {
        pageSize: Number(limit),
        currentPage: Number(page),
        totalResults,
        totalPages,
        sort
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get product by ID or code
exports.getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findOne({
      $or: [{ _id: id }, { code: id }],
      isActive: true
    });

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

