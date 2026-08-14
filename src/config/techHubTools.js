import {
  FileJson, KeyRound, Type, QrCode, ImageDown, Ruler, FileText
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
    live: false,
  },
  {
    slug: 'unit-converter',
    name: 'Unit Converter',
    description: 'Convert length, weight, temperature and more.',
    category: 'Calculators',
    icon: Ruler,
    live: false,
  },
  {
  slug: 'cv-builder',
  name: 'CV Builder',
  description: 'Build a polished CV/resume and download as PDF.',
  category: 'Student & Career',
  icon: FileText,
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