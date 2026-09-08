/**
 * categoryHighlights.js
 *
 * Picks 2-3 of a product's category-specific attributes (see
 * CATEGORY_FIELDS in listingCategoryFields.js) to surface prominently
 * on the storefront card and product detail page — e.g. a hotel room
 * shows "2 Guests · ₦45,000/night" instead of a generic spec grid.
 * Falls back to an empty array for categories with no special
 * treatment (Product Seller, Other) — those just show price as usual.
 */
export function getCategoryHighlights(product) {
  const a = product?.attributes || {}
  const category = product?.category

  switch (category) {
    case 'Hotel & Short-Let Accommodation':
      return [
        a.roomType,
        a.maxGuests ? `${a.maxGuests} guest${a.maxGuests > 1 ? 's' : ''}` : null,
        a.pricePerNight ? `₦${Number(a.pricePerNight).toLocaleString()}/night` : null,
      ].filter(Boolean)

    case 'Property & Real Estate':
      return [
        a.listingType,
        a.bedrooms ? `${a.bedrooms} bed${a.bedrooms > 1 ? 's' : ''}` : null,
        a.bathrooms ? `${a.bathrooms} bath${a.bathrooms > 1 ? 's' : ''}` : null,
        a.furnishing,
      ].filter(Boolean)

    case 'Restaurant & Food':
      return [a.menuCategory, a.prepTime ? `Ready in ${a.prepTime}` : null].filter(Boolean)

    case 'Home & Local Services':
      return [a.serviceArea, a.rateType].filter(Boolean)

    case 'Digital & Freelance Services':
      return [a.deliveryTime ? `Delivery: ${a.deliveryTime}` : null, a.revisions].filter(Boolean)

    case 'Transportation & Logistics':
      return [a.vehicleType, a.coverageArea].filter(Boolean)

    case 'Events & Entertainment':
      return [a.capacity ? `Capacity: ${a.capacity}` : null].filter(Boolean)

    case 'Travel & Tour Booking':
      return [a.destination, a.duration].filter(Boolean)

    default:
      return []
  }
}