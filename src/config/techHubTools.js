import {
  FileJson, KeyRound, Type, QrCode, ImageDown, Ruler, FileText, Binary, DollarSign, 
  Hash, Percent, Palette, FileImage, FileStack
} from 'lucide-react'

// ✅ Add a new tool here and it automatically shows up on the Tech Hub
// landing page in the right category. slug becomes the URL:
// /tech-hub/:slug
export const techHubTools = [
  {
    slug: 'json-formatter',
    name: 'JSON Formatter',
    description: 'Format, validate and beautify JSON instantly.',
    category: 'Developer Tools',
    icon: FileJson,
    live: true, // ✅ set to true once the tool page actually exists
  },
  {
    slug: 'password-generator',
    name: 'Password Generator',
    description: 'Create strong, random passwords in one click.',
    category: 'Security',
    icon: KeyRound,
    live: true,
  },
  {
    slug: 'word-counter',
    name: 'Word & Character Counter',
    description: 'Count words, characters and reading time.',
    category: 'Student & Writing',
    icon: Type,
    live: true,
  },
  {
    slug: 'qr-generator',
    name: 'QR Code Generator',
    description: 'Turn any link or text into a scannable QR code.',
    category: 'Image & Media',
    icon: QrCode,
    live: true,
  },
  {
    slug: 'image-compressor',
    name: 'Image Compressor',
    description: 'Shrink image file size without losing quality.',
    category: 'Image & Media',
    icon: ImageDown,
    live: true,
  },
  {
    slug: 'unit-converter',
    name: 'Unit Converter',
    description: 'Convert length, weight, temperature and more.',
    category: 'Calculators',
    icon: Ruler,
    live: true,
  },
  {
  slug: 'cv-builder',
  name: 'CV Builder',
  description: 'Build a polished CV/resume and download as PDF.',
  category: 'Student & Career',
  icon: FileText,
  live: true,
},
{
  slug: 'base64-tool',
  name: 'Base64 Encoder / Decoder',
  description: 'Convert text to and from Base64 instantly.',
  category: 'Developer Tools',
  icon: Binary,
  live: true,
},
{
  slug: 'currency-converter',
  name: 'Currency Converter',
  description: 'Convert between currencies with live exchange rates.',
  category: 'Calculators',
  icon: DollarSign,
  live: true,
},
{
  slug: 'hash-uuid-generator',
  name: 'Hash & UUID Generator',
  description: 'Generate UUIDs or hash text with SHA algorithms.',
  category: 'Developer Tools',
  icon: Hash,
  live: true,
},
{
  slug: 'percentage-vat-calculator',
  name: 'Percentage & VAT Calculator',
  description: 'Quick percentage math and VAT calculations.',
  category: 'Calculators',
  icon: Percent,
  live: true,
},
{
  slug: 'color-converter',
  name: 'Color Converter',
  description: 'Convert between HEX, RGB and HSL.',
  category: 'Developer Tools',
  icon: Palette,
  live: true,
},
{
  slug: 'image-pdf-converter',
  name: 'Image ⇄ PDF Converter',
  description: 'Convert images to PDF, or PDF pages to images.',
  category: 'File Tools',
  icon: FileImage,
  live: true,
},
{
  slug: 'pdf-toolkit',
  name: 'PDF Toolkit',
  description: 'Merge, split, or compress PDF files.',
  category: 'File Tools',
  icon: FileStack,
  live: true,
},
]

// ✅ Groups tools by category for the landing page grid
export const groupedTechHubTools = () => {
  const groups = {}
  techHubTools.forEach((tool) => {
    if (!groups[tool.category]) groups[tool.category] = []
    groups[tool.category].push(tool)
  })
  return groups
}