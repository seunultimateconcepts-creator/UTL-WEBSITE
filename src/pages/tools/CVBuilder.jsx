import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, FileText, Plus, Trash2, Download, Upload, Copy, Check, Loader2 } from 'lucide-react'
import * as pdfjsLib from 'pdfjs-dist/build/pdf'
import mammoth from 'mammoth'

pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`

function CVBuilder() {
  const [personal, setPersonal] = useState({
    fullName: '',
    title: '',
    email: '',
    phone: '',
    location: '',
    linkedin: '',
  })
  const [summary, setSummary] = useState('')
  const [experience, setExperience] = useState([
    { id: 1, role: '', company: '', duration: '', description: '' },
  ])
  const [education, setEducation] = useState([
    { id: 1, degree: '', school: '', duration: '' },
  ])
  const [skills, setSkills] = useState('')
  const [additionalSections, setAdditionalSections] = useState([])

  const [extractedText, setExtractedText] = useState('')
  const [extracting, setExtracting] = useState(false)
  const [extractError, setExtractError] = useState('')
  const [copiedExtracted, setCopiedExtracted] = useState(false)

  const updatePersonal = (field, value) => {
    setPersonal((prev) => ({ ...prev, [field]: value }))
  }

  const addExperience = () => {
    setExperience((prev) => [...prev, { id: Date.now(), role: '', company: '', duration: '', description: '' }])
  }
  const updateExperience = (id, field, value) => {
    setExperience((prev) => prev.map((exp) => (exp.id === id ? { ...exp, [field]: value } : exp)))
  }
  const removeExperience = (id) => {
    setExperience((prev) => prev.filter((exp) => exp.id !== id))
  }

  const addEducation = () => {
    setEducation((prev) => [...prev, { id: Date.now(), degree: '', school: '', duration: '' }])
  }
  const updateEducation = (id, field, value) => {
    setEducation((prev) => prev.map((ed) => (ed.id === id ? { ...ed, [field]: value } : ed)))
  }
  const removeEducation = (id) => {
    setEducation((prev) => prev.filter((ed) => ed.id !== id))
  }

  const addSection = () => {
    setAdditionalSections((prev) => [...prev, { id: Date.now(), title: '', content: '' }])
  }
  const updateSection = (id, field, value) => {
    setAdditionalSections((prev) => prev.map((s) => (s.id === id ? { ...s, [field]: value } : s)))
  }
  const removeSection = (id) => {
    setAdditionalSections((prev) => prev.filter((s) => s.id !== id))
  }

  const skillsList = skills.split(',').map((s) => s.trim()).filter(Boolean)

  const handleDownload = () => {
    window.print()
  }

  const extractPdfText = async (file) => {
    const arrayBuffer = await file.arrayBuffer()
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise
    let fullText = ''
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i)
      const content = await page.getTextContent()
      const pageText = content.items.map((item) => item.str).join(' ')
      fullText += pageText + '\n\n'
    }
    return fullText.trim()
  }

  const extractDocxText = async (file) => {
    const arrayBuffer = await file.arrayBuffer()
    const result = await mammoth.extractRawText({ arrayBuffer })
    return result.value.trim()
  }

  const handleFileUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    setExtracting(true)
    setExtractError('')
    setExtractedText('')
    setCopiedExtracted(false)

    try {
      let text = ''
      if (file.type === 'application/pdf') {
        text = await extractPdfText(file)
      } else if (file.name.toLowerCase().endsWith('.docx')) {
        text = await extractDocxText(file)
      } else {
        throw new Error('Please upload a PDF or DOCX file (.doc is not supported).')
      }

      if (!text) {
        throw new Error('No readable text found — this might be a scanned/image-based CV.')
      }

      setExtractedText(text)
    } catch (err) {
      setExtractError(err.message || 'Could not read this file.')
    } finally {
      setExtracting(false)
      e.target.value = ''
    }
  }

  const handleCopyExtracted = () => {
    if (!extractedText) return
    navigator.clipboard.writeText(extractedText)
    setCopiedExtracted(true)
    setTimeout(() => setCopiedExtracted(false), 2000)
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-16">

      <style>{`
        @media print {
          body * { visibility: hidden; }
          #cv-preview, #cv-preview * { visibility: visible; }
          #cv-preview {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            box-shadow: none !important;
            border: none !important;
          }
        }
      `}</style>

      <div className="bg-[#0a0f2c] py-10 px-4 sm:px-6 lg:px-8 print:hidden">
        <div className="max-w-6xl mx-auto flex items-center justify-between flex-wrap gap-4">
          <div>
            <Link
              to="/tech-hub"
              className="inline-flex items-center gap-1.5 text-gray-400 hover:text-white text-sm mb-4 transition-colors"
            >
              <ArrowLeft size={14} /> Back to Tech Hub
            </Link>
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-amber-400/10 border border-amber-400/30 flex items-center justify-center">
                <FileText size={22} className="text-amber-400" />
              </div>
              <div>
                <h1 className="text-2xl font-black text-white">CV Builder</h1>
                <p className="text-gray-400 text-sm">Fill in your details and download a polished PDF</p>
              </div>
            </div>
          </div>
          <button
            onClick={handleDownload}
            className="flex items-center gap-2 px-5 py-3 bg-amber-500 hover:bg-amber-400 text-[#0a0f2c] font-bold rounded-xl transition-all"
          >
            <Download size={18} /> Download PDF
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 grid lg:grid-cols-2 gap-8">

        <div className="space-y-6 print:hidden">

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h3 className="font-bold text-gray-900 mb-1">Have an existing CV?</h3>
            <p className="text-gray-500 text-xs mb-4">
              Upload it to extract the text, then copy the parts you want into the fields below to rebuild a cleaner, corrected version.
            </p>

            <label className="flex flex-col items-center justify-center gap-2 border-2 border-dashed border-gray-200 hover:border-amber-300 rounded-xl p-6 cursor-pointer transition-colors">
              {extracting ? (
                <Loader2 size={22} className="text-amber-500 animate-spin" />
              ) : (
                <Upload size={22} className="text-gray-400" />
              )}
              <span className="text-sm text-gray-500">
                {extracting ? 'Reading your file...' : 'Click to upload a PDF or DOCX'}
              </span>
              <input
                type="file"
                accept=".pdf,.docx"
                onChange={handleFileUpload}
                disabled={extracting}
                className="hidden"
              />
            </label>

            {extractError && (
              <p className="text-red-500 text-xs mt-3">{extractError}</p>
            )}

            {extractedText && (
              <div className="mt-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Extracted Text</span>
                  <button
                    onClick={handleCopyExtracted}
                    className="flex items-center gap-1 text-amber-600 hover:text-amber-700 text-xs font-semibold"
                  >
                    {copiedExtracted ? <Check size={12} /> : <Copy size={12} />}
                    {copiedExtracted ? 'Copied!' : 'Copy All'}
                  </button>
                </div>
                <textarea
                  value={extractedText}
                  onChange={(e) => setExtractedText(e.target.value)}
                  className="w-full h-48 p-3 bg-gray-50 border border-gray-200 rounded-lg text-xs text-gray-700 font-mono resize-none focus:outline-none focus:border-amber-400"
                />
              </div>
            )}
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h3 className="font-bold text-gray-900 mb-4">Personal Info</h3>
            <div className="grid grid-cols-2 gap-3">
              <input placeholder="Full Name" value={personal.fullName}
                onChange={(e) => updatePersonal('fullName', e.target.value)}
                className="col-span-2 px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-amber-400" />
              <input placeholder="Professional Title" value={personal.title}
                onChange={(e) => updatePersonal('title', e.target.value)}
                className="col-span-2 px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-amber-400" />
              <input placeholder="Email" value={personal.email}
                onChange={(e) => updatePersonal('email', e.target.value)}
                className="px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-amber-400" />
              <input placeholder="Phone" value={personal.phone}
                onChange={(e) => updatePersonal('phone', e.target.value)}
                className="px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-amber-400" />
              <input placeholder="Location" value={personal.location}
                onChange={(e) => updatePersonal('location', e.target.value)}
                className="px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-amber-400" />
              <input placeholder="LinkedIn / Portfolio URL" value={personal.linkedin}
                onChange={(e) => updatePersonal('linkedin', e.target.value)}
                className="px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-amber-400" />
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h3 className="font-bold text-gray-900 mb-4">Professional Summary</h3>
            <textarea
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              placeholder="2-3 sentences summarizing your experience and strengths..."
              className="w-full h-24 px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm resize-none focus:outline-none focus:border-amber-400"
            />
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-gray-900">Experience</h3>
              <button onClick={addExperience} className="flex items-center gap-1 text-amber-600 hover:text-amber-700 text-xs font-semibold">
                <Plus size={14} /> Add
              </button>
            </div>
            <div className="space-y-4">
              {experience.map((exp) => (
                <div key={exp.id} className="border border-gray-100 rounded-xl p-4 relative">
                  {experience.length > 1 && (
                    <button onClick={() => removeExperience(exp.id)} className="absolute top-3 right-3 text-gray-300 hover:text-red-500">
                      <Trash2 size={14} />
                    </button>
                  )}
                  <div className="grid grid-cols-2 gap-2 mb-2">
                    <input placeholder="Role / Job Title" value={exp.role}
                      onChange={(e) => updateExperience(exp.id, 'role', e.target.value)}
                      className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-amber-400" />
                    <input placeholder="Company" value={exp.company}
                      onChange={(e) => updateExperience(exp.id, 'company', e.target.value)}
                      className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-amber-400" />
                  </div>
                  <input placeholder="Duration (e.g. Jan 2023 - Present)" value={exp.duration}
                    onChange={(e) => updateExperience(exp.id, 'duration', e.target.value)}
                    className="w-full mb-2 px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-amber-400" />
                  <textarea placeholder="What did you do / achieve?" value={exp.description}
                    onChange={(e) => updateExperience(exp.id, 'description', e.target.value)}
                    className="w-full h-16 px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm resize-none focus:outline-none focus:border-amber-400" />
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-gray-900">Education</h3>
              <button onClick={addEducation} className="flex items-center gap-1 text-amber-600 hover:text-amber-700 text-xs font-semibold">
                <Plus size={14} /> Add
              </button>
            </div>
            <div className="space-y-4">
              {education.map((ed) => (
                <div key={ed.id} className="border border-gray-100 rounded-xl p-4 relative">
                  {education.length > 1 && (
                    <button onClick={() => removeEducation(ed.id)} className="absolute top-3 right-3 text-gray-300 hover:text-red-500">
                      <Trash2 size={14} />
                    </button>
                  )}
                  <input placeholder="Degree / Certificate" value={ed.degree}
                    onChange={(e) => updateEducation(ed.id, 'degree', e.target.value)}
                    className="w-full mb-2 px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-amber-400" />
                  <input placeholder="School / Institution" value={ed.school}
                    onChange={(e) => updateEducation(ed.id, 'school', e.target.value)}
                    className="w-full mb-2 px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-amber-400" />
                  <input placeholder="Duration (e.g. 2019 - 2023)" value={ed.duration}
                    onChange={(e) => updateEducation(ed.id, 'duration', e.target.value)}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-amber-400" />
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h3 className="font-bold text-gray-900 mb-4">Skills</h3>
            <input
              value={skills}
              onChange={(e) => setSkills(e.target.value)}
              placeholder="React, Node.js, Project Management, ... (comma separated)"
              className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-amber-400"
            />
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-bold text-gray-900">Additional Sections</h3>
                <p className="text-gray-400 text-xs mt-0.5">Certifications, Projects, Languages, References, etc.</p>
              </div>
              <button
                onClick={addSection}
                className="flex items-center gap-1 text-amber-600 hover:text-amber-700 text-xs font-semibold flex-shrink-0"
              >
                <Plus size={14} /> Add Section
              </button>
            </div>

            {additionalSections.length === 0 && (
              <p className="text-gray-300 text-sm italic">No additional sections yet — click "Add Section" to create one.</p>
            )}

            <div className="space-y-4">
              {additionalSections.map((section) => (
                <div key={section.id} className="border border-gray-100 rounded-xl p-4 relative">
                  <button onClick={() => removeSection(section.id)} className="absolute top-3 right-3 text-gray-300 hover:text-red-500">
                    <Trash2 size={14} />
                  </button>
                  <input placeholder="Section Title (e.g. Certifications)" value={section.title}
                    onChange={(e) => updateSection(section.id, 'title', e.target.value)}
                    className="w-full mb-2 px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm font-semibold focus:outline-none focus:border-amber-400" />
                  <textarea placeholder="Content for this section..." value={section.content}
                    onChange={(e) => updateSection(section.id, 'content', e.target.value)}
                    className="w-full h-20 px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm resize-none focus:outline-none focus:border-amber-400" />
                </div>
              ))}
            </div>
          </div>

        </div>

        <div>
          <div
            id="cv-preview"
            className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 lg:sticky lg:top-24"
          >
            <div className="border-b-2 border-[#0a0f2c] pb-4 mb-4">
              <h2 className="text-2xl font-black text-gray-900">{personal.fullName || 'Your Name'}</h2>
              <p className="text-amber-600 font-semibold text-sm mb-2">{personal.title || 'Professional Title'}</p>
              <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-gray-500">
                {personal.email && <span>{personal.email}</span>}
                {personal.phone && <span>• {personal.phone}</span>}
                {personal.location && <span>• {personal.location}</span>}
                {personal.linkedin && <span>• {personal.linkedin}</span>}
              </div>
            </div>

            {summary && (
              <div className="mb-4">
                <h3 className="text-xs font-black text-gray-900 uppercase tracking-wider mb-1.5">Summary</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{summary}</p>
              </div>
            )}

            {experience.some(e => e.role || e.company) && (
              <div className="mb-4">
                <h3 className="text-xs font-black text-gray-900 uppercase tracking-wider mb-2">Experience</h3>
                <div className="space-y-3">
                  {experience.filter(e => e.role || e.company).map((exp) => (
                    <div key={exp.id}>
                      <div className="flex items-baseline justify-between">
                        <p className="text-sm font-bold text-gray-800">{exp.role}</p>
                        <p className="text-xs text-gray-400">{exp.duration}</p>
                      </div>
                      <p className="text-xs text-amber-600 font-semibold mb-1">{exp.company}</p>
                      {exp.description && <p className="text-xs text-gray-600 leading-relaxed">{exp.description}</p>}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {education.some(e => e.degree || e.school) && (
              <div className="mb-4">
                <h3 className="text-xs font-black text-gray-900 uppercase tracking-wider mb-2">Education</h3>
                <div className="space-y-2">
                  {education.filter(e => e.degree || e.school).map((ed) => (
                    <div key={ed.id}>
                      <div className="flex items-baseline justify-between">
                        <p className="text-sm font-bold text-gray-800">{ed.degree}</p>
                        <p className="text-xs text-gray-400">{ed.duration}</p>
                      </div>
                      <p className="text-xs text-gray-500">{ed.school}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {skillsList.length > 0 && (
              <div className="mb-4">
                <h3 className="text-xs font-black text-gray-900 uppercase tracking-wider mb-2">Skills</h3>
                <div className="flex flex-wrap gap-1.5">
                  {skillsList.map((skill) => (
                    <span key={skill} className="text-xs bg-amber-50 text-amber-700 px-2.5 py-1 rounded-full">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {additionalSections.filter(s => s.title || s.content).map((section) => (
              <div key={section.id} className="mb-4">
                <h3 className="text-xs font-black text-gray-900 uppercase tracking-wider mb-1.5">
                  {section.title || 'Section'}
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-wrap">{section.content}</p>
              </div>
            ))}
          </div>

          <p className="text-gray-400 text-xs text-center mt-4 print:hidden">
            This is your live preview — click "Download PDF" above to save it.
          </p>
        </div>

      </div>
    </div>
  )
}

export default CVBuilder