// Brand definitions with context for AI classification
const BRANDS = {
  aurapets: {
    id: 'aurapets',
    name: 'Aurapets',
    website: 'shopaurapets.com',
    description: 'Dog eye health nano drops supplement',
    target_audience: 'Dog owners with senior dogs experiencing cloudy eyes or vision problems',
    valid_topics: [
      'dogs', 'dog health', 'dog eyes', 'dog vision', 'cloudy eyes in dogs',
      'senior dogs', 'pet care', 'pet health', 'dog supplements',
      'nano drops for dogs', 'cellular debris in dog eyes',
      'dog eye health', 'canine vision', 'pet eye care',
      'AuraPets', 'dog owner testimonials', 'veterinary content about dogs',
      'guide dogs', 'working dogs', 'dog aging', 'dog wellness'
    ],
    invalid_examples: [
      'human health products', 'weight loss', 'crypto', 'finance',
      'human eye health', 'human supplements', 'other animals besides dogs',
      'unrelated products', 'other brands'
    ],
    key_ingredients: [
      'Lutein', 'Zeaxanthin', 'Bilberry', 'Curcumin', 'NAC',
      'Grape Seed Extract', 'Blueberry Extract', 'Astaxanthin'
    ],
    content_style: 'UGC testimonials, veterinary authority figures, emotional dog owner stories, before/after transformations',
    editors: ['james', 'john', 'antoni', 'daniel_aurapets', 'eyasu', 'eugene']
  },

  lumineye: {
    id: 'lumineye',
    name: 'LuminEye',
    website: 'lumindrops.co',
    description: 'Human eye health nano drops supplement',
    target_audience: 'Adults 40-65+ experiencing age-related vision issues like floaters, blurry vision, dry eyes',
    valid_topics: [
      'human eye health', 'human vision', 'floaters', 'blurry vision',
      'dry eyes', 'night vision', 'macular degeneration', 'aging eyes',
      'stem cell activation', 'sublingual absorption', 'eye supplements for humans',
      'reading difficulties', 'screen strain', 'driving at night',
      'LuminEye', 'vision testimonials', 'eye health for seniors',
      'cellular debris in human eyes', 'eye drops for people'
    ],
    invalid_examples: [
      'pet products', 'dog health', 'animal care', 'crypto', 'finance',
      'weight loss', 'unrelated products', 'other brands'
    ],
    key_ingredients: [
      'Astaxanthin', 'Lutein', 'Zeaxanthin', 'Bilberry Extract',
      'Vitamin C', 'Vitamin E', 'Zinc', 'B vitamins',
      'Sea Mustard', 'Ecklonia Cava', 'Sea Buckthorn'
    ],
    content_style: 'UGC testimonials from women 50-65, authority figures, emotional family stories (grandchildren), before/after transformations',
    editors: ['santanu', 'daniel_lumineye']
  }
};

// Get brand by editor name
function getBrandByEditor(editorName) {
  const normalizedName = editorName.toLowerCase().trim();

  for (const [brandId, brand] of Object.entries(BRANDS)) {
    if (brand.editors.includes(normalizedName)) {
      return brand;
    }
  }
  return null;
}

// Get brand by ID
function getBrandById(brandId) {
  return BRANDS[brandId] || null;
}

// Get all brands
function getAllBrands() {
  return BRANDS;
}

module.exports = { BRANDS, getBrandByEditor, getBrandById, getAllBrands };
