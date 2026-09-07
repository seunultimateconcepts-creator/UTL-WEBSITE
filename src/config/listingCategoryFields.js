/**
 * listingCategoryFields.js
 *
 * ✅ Declares what EXTRA fields each business category needs, beyond
 * the standard name/description/price/images every listing already
 * has. AddProduct.jsx reads a vendor's businessCategory, looks up
 * their fields here, and renders them dynamically — adding a new
 * category later means editing this file, not building a new form.
 *
 * Every field's value gets stored in Product.attributes (a flexible
 * map), keyed by `key`. `type` drives which input renders:
 * 'text' | 'number' | 'select' | 'date'
 */
export const CATEGORY_FIELDS = {
  'Product Seller': [],

  'Hotel & Short-Let Accommodation': [
    { key: 'roomType', label: 'Room Type', type: 'text', placeholder: 'e.g. Deluxe Room, Studio, 2-Bed Suite' },
    { key: 'pricePerNight', label: 'Price per Night (₦)', type: 'number' },
    { key: 'maxGuests', label: 'Max Guests', type: 'number' },
    { key: 'amenities', label: 'Amenities', type: 'text', placeholder: 'WiFi, AC, Pool, Generator, etc.' },
  ],

  'Restaurant & Food': [
    { key: 'menuCategory', label: 'Menu Category', type: 'select', options: ['Starters', 'Main Course', 'Drinks', 'Desserts', 'Combo/Packages'] },
    { key: 'prepTime', label: 'Preparation Time', type: 'text', placeholder: 'e.g. 30 mins' },
  ],

  'Property & Real Estate': [
    { key: 'listingType', label: 'Listing Type', type: 'select', options: ['For Rent', 'For Sale'] },
    { key: 'bedrooms', label: 'Bedrooms', type: 'number' },
    { key: 'bathrooms', label: 'Bathrooms', type: 'number' },
    { key: 'furnishing', label: 'Furnishing', type: 'select', options: ['Furnished', 'Semi-Furnished', 'Unfurnished'] },
    { key: 'priceFrequency', label: 'Price Frequency', type: 'select', options: ['Per Year', 'One-Time (Sale)'] },
  ],

  'Home & Local Services': [
    { key: 'serviceArea', label: 'Service Area / Coverage', type: 'text', placeholder: 'e.g. Lagos Mainland, Benin City' },
    { key: 'rateType', label: 'Rate Type', type: 'select', options: ['Fixed Price', 'Per Hour', 'Quote on Request'] },
  ],

  'Digital & Freelance Services': [
    { key: 'deliveryTime', label: 'Typical Delivery Time', type: 'text', placeholder: 'e.g. 3-5 business days' },
    { key: 'revisions', label: 'Revisions Included', type: 'text', placeholder: 'e.g. 2 free revisions' },
  ],

  'Transportation & Logistics': [
    { key: 'vehicleType', label: 'Vehicle Type', type: 'text', placeholder: 'e.g. Truck, Bus, Sedan, Bike' },
    { key: 'coverageArea', label: 'Coverage Area', type: 'text', placeholder: 'e.g. Within Lagos, Interstate' },
  ],

  'Events & Entertainment': [
    { key: 'eventDate', label: 'Availability Date', type: 'date' },
    { key: 'capacity', label: 'Capacity (if a venue)', type: 'number' },
  ],

  'Travel & Tour Booking': [
    { key: 'destination', label: 'Destination / Route', type: 'text' },
    { key: 'duration', label: 'Duration', type: 'text', placeholder: 'e.g. 3 days 2 nights' },
  ],

  'Other': [],
}

/**
 * BOOKING_CATEGORIES
 *
 * ✅ Categories where checkout needs DATES (a stay, a viewing, an
 * event date) instead of a delivery address. ProductDetail.jsx reads
 * this to decide which form to show — BookingDateForm vs AddressForm
 * — and which field (bookingDetails vs deliveryAddress) to send to
 * POST /orders. See Order.bookingDetails in the backend model.
 */
export const BOOKING_CATEGORIES = [
  'Hotel & Short-Let Accommodation',
  'Property & Real Estate',
  'Events & Entertainment',
  'Travel & Tour Booking',
]

// ✅ Hotel needs a checkout date (range); Property/Events/Travel just
// need one date (a viewing, an event day, a departure). Read by
// BookingDateForm.jsx to decide whether to show the second date field.
export const RANGE_DATE_CATEGORIES = ['Hotel & Short-Let Accommodation']