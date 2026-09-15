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
    { key: 'serviceMode', label: 'How do customers book this?', type: 'select', options: ['Scheduled Appointment', 'Request a Callout'] },
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
 * CHECKOUT MODES
 *
 * ✅ Every category checks out one of four ways. This replaces the
 * older BOOKING_CATEGORIES-only split (kept below for anything still
 * importing it directly) with a single function every checkout
 * surface (ProductDetail.jsx, VendorCartDrawer.jsx, AddProduct.jsx)
 * calls instead of re-deriving the same category list in three
 * places — one source of truth for "what kind of listing is this."
 *
 * - 'buy-now'         — quantity + delivery address (physical goods)
 * - 'book-dates'      — a date or date range + guests (a stay, a
 *                        viewing, an event, a trip)
 * - 'time-slot'       — a specific day + a fixed time slot (a
 *                        haircut, a fitting, a table)
 * - 'service-request' — no fixed date/time at all — a description of
 *                        what's needed + location + urgency, the
 *                        vendor responds directly (a callout, a
 *                        freelance gig, a delivery pickup)
 *
 * 'Home & Local Services' is genuinely two different businesses under
 * one category label — a barber who takes appointments and a
 * plumber who takes callouts check out completely differently. That
 * split is a vendor-chosen field (serviceMode, above), not something
 * the category name alone can decide — see getCheckoutMode below.
 */
export const CHECKOUT_MODES = {
  BUY_NOW: 'buy-now',
  BOOK_DATES: 'book-dates',
  TIME_SLOT: 'time-slot',
  SERVICE_REQUEST: 'service-request',
}

const CATEGORY_MODE_MAP = {
  'Product Seller': CHECKOUT_MODES.BUY_NOW,
  'Restaurant & Food': CHECKOUT_MODES.BUY_NOW,
  'Other': CHECKOUT_MODES.BUY_NOW,
  'Hotel & Short-Let Accommodation': CHECKOUT_MODES.BOOK_DATES,
  'Property & Real Estate': CHECKOUT_MODES.BOOK_DATES,
  'Events & Entertainment': CHECKOUT_MODES.BOOK_DATES,
  'Travel & Tour Booking': CHECKOUT_MODES.BOOK_DATES,
  'Digital & Freelance Services': CHECKOUT_MODES.SERVICE_REQUEST,
  'Transportation & Logistics': CHECKOUT_MODES.SERVICE_REQUEST,
  // 'Home & Local Services' deliberately absent — resolved below by
  // serviceMode, not by category alone.
}

/**
 * getCheckoutMode(product)
 *
 * Takes a Product (needs `category` and `attributes`) and returns one
 * of CHECKOUT_MODES. This is THE function every checkout surface
 * should call — never re-check BOOKING_CATEGORIES.includes(category)
 * directly, since that only covers one of the four modes.
 */
export function getCheckoutMode(product) {
  const category = product?.category
  if (category === 'Home & Local Services') {
    const mode = product?.attributes?.serviceMode
    return mode === 'Scheduled Appointment' ? CHECKOUT_MODES.TIME_SLOT : CHECKOUT_MODES.SERVICE_REQUEST
  }
  return CATEGORY_MODE_MAP[category] || CHECKOUT_MODES.BUY_NOW
}

/**
 * BOOKING_CATEGORIES
 *
 * ✅ Kept for backward compatibility with anything still importing it
 * directly — but prefer getCheckoutMode(product) === CHECKOUT_MODES.BOOK_DATES
 * for new code, since this list alone can't express the
 * Home & Local Services split.
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

// ✅ Simple fixed daily slots — NOT vendor-configurable availability.
// A real scheduling system (per-vendor working hours, breaks, existing
// bookings blocking specific slots) is a distinctly bigger feature;
// this is the honest MVP version: one shared set of hourly slots,
// double-booking prevention still applies per exact slot (see
// TimeSlotForm.jsx and the booked-slots check in orderController.js).
export const DAILY_TIME_SLOTS = [
  '09:00', '10:00', '11:00', '12:00', '13:00',
  '14:00', '15:00', '16:00', '17:00', '18:00',
]