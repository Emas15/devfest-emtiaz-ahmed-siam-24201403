import { useEffect, useReducer, useRef, useState } from 'react'
import { getDocument, GlobalWorkerOptions } from 'pdfjs-dist'
import pdfWorker from 'pdfjs-dist/build/pdf.worker.min.mjs?url'
import { createTenderPackage } from './pdfPackage'

GlobalWorkerOptions.workerSrc = pdfWorker

const MAX_FILES = 30
const MAX_TOTAL_BYTES = 50 * 1024 * 1024

const copy = {
  en: {
    eyebrow: 'Tender package command center', title: 'Make every submission', accent: 'submission-ready.',
    subtitle: 'Import tender requirements, trace every document, and build a verified package — entirely in your browser.',
    import: 'Import requirements.json', language: 'বাংলা',
    homeLabel: 'TenderPulse home', systemLabel: 'SYSTEM / 01', importHint: 'JSON stays on this device. Nothing is uploaded.', noTender: 'Start with the tender requirements', noTenderEyebrow: 'Step 1 of 4', noTenderCopy: 'Choose the requirements.json file supplied with the tender. We will check it before showing the document checklist.', noTenderExpected: 'Expected file: requirements.json',
    tender: 'Tender intelligence', entity: 'Procuring entity', bidder: 'Bidder', deadline: 'Submission deadline',
    checklist: 'Document checklist', requirement: 'requirement', requirements: 'requirements', order: 'Order', status: 'Status', mandatory: 'Mandatory', optional: 'Optional', expiry: 'Expiry check', noExpiry: 'No expiry',
    missing: 'Missing', notProvided: 'Not provided', dateNeeded: 'Expiry date needed', expired: 'Expired', ok: 'OK', duplicate: 'Duplicate', enterExpiry: 'Enter expiry date',
    scan: 'Package readiness', clear: 'blocking items', readyText: 'Ready to assemble', progressOne: 'requirement OK', progress: 'requirements OK', next: 'Next: upload source PDFs', generate: 'Generate package', generating: 'Generating package…', blockingReasons: 'Blocking reasons', noBlockers: 'No blocking requirements', packageFailed: 'The package could not be generated. Please review the matched PDFs and try again.', packageInvalid: 'The generated package failed validation and was not downloaded. Please review the matched PDFs and try again.',
    invalid: 'This requirements file could not be opened', errors: 'Fix the items below or choose the correct file.', chooseAnother: 'Choose another file', dismiss: 'Dismiss message', downloadReady: 'Package validated. Download it below.', downloadPackage: 'Download package PDF', page: 'page', local: 'Local-only workspace', localCopy: 'Tender data and PDFs are processed in this browser only. Nothing is sent to a server.',
    invalidJson: 'The selected file is not valid JSON.', rootObject: 'The file must contain one JSON object.', missingTender: 'The tender details section is missing.', requiredField: '{field} must contain text.', invalidDeadline: 'tender.submission_deadline must be a real date in YYYY-MM-DD format.', requirementsArray: 'The requirements list must contain at least one item.', requirementObject: '{item} must be an object.', positiveOrder: '{item}.order must be a positive whole number.', booleanField: '{item}.{field} must be true or false.', duplicateId: 'Requirement ID {value} is used more than once.', duplicateOrder: 'Order number {value} is used more than once.',
    workflowLabel: 'Package workflow', workflowTitle: 'Four steps to a submission-ready package', complete: 'Complete', current: 'Do this now', upcoming: 'Up next', workflowSteps: [{ title: 'Import tender', copy: 'Open requirements.json' }, { title: 'Add PDFs', copy: 'Choose all source documents' }, { title: 'Match and check', copy: 'Link files and add expiry dates' }, { title: 'Generate package', copy: 'Download the verified PDF' }],
    blockedLabel: 'BLOCKED', readyLabel: 'READY', footer: 'TenderPulse / precision in every page', liveLocal: 'LIVE · LOCAL', noTenderSignal: 'NO TENDER', privacySignal: '100% PRIVATE', footerState: 'EN · BN · LOCAL FIRST', upload: 'Source PDF intake', drop: 'Drop PDF files here', browse: 'Choose PDFs', uploadHint: 'PDF only · up to 30 files · 50 MB total', queue: 'Upload queue', files: 'files', pages: 'pages', remove: 'Remove', rejected: 'Rejected', processing: 'Reading pages…', corrupt: 'Unreadable or corrupt PDF', protected: 'Password-protected PDF', nonPdf: 'Only PDF files are accepted', fileLimit: 'Maximum of 30 files reached', sizeLimit: 'Total file size cannot exceed 50 MB', emptyQueue: 'No source PDFs selected yet.', emptyQueueHelp: 'Add the tender documents above. Page counts and file safety checks happen automatically.', mapping: 'File mapping', match: 'Match file', chooseFile: 'Choose a PDF file', undo: 'Undo', unmatched: 'Unmatched', mappedTo: 'Mapped to', change: 'Change file', ignore: 'Ignore', accept: 'Accept match', suggestion: 'Match suggestion', highConfidence: 'High confidence', mediumConfidence: 'Medium confidence', filenameReason: 'Filename matches {count} requirement words', identifierReason: 'Filename includes the requirement ID', mapHint: 'Choose one PDF for each requirement. Suggestions are never applied without your approval.'
  },
  bn: {
    eyebrow: 'টেন্ডার প্যাকেজ কমান্ড সেন্টার', title: 'প্রতিটি জমা দিন', accent: 'নির্ভুলভাবে।',
    subtitle: 'টেন্ডারের শর্ত আমদানি করুন, প্রতিটি নথি ট্র্যাক করুন এবং যাচাইকৃত প্যাকেজ তৈরি করুন — সম্পূর্ণ আপনার ব্রাউজারে।',
    import: 'requirements.json আমদানি করুন', language: 'English',
    homeLabel: 'TenderPulse হোম', systemLabel: 'সিস্টেম / ০১', importHint: 'JSON আপনার ডিভাইসেই থাকে। কিছুই আপলোড করা হয় না।', noTender: 'টেন্ডারের শর্ত দিয়ে শুরু করুন', noTenderEyebrow: '৪ ধাপের মধ্যে ধাপ ১', noTenderCopy: 'টেন্ডারের সঙ্গে দেওয়া requirements.json ফাইলটি বেছে নিন। নথির চেকলিস্ট দেখানোর আগে আমরা ফাইলটি যাচাই করব।', noTenderExpected: 'প্রয়োজনীয় ফাইল: requirements.json',
    tender: 'টেন্ডার তথ্য', entity: 'ক্রয়কারী সংস্থা', bidder: 'দরদাতা', deadline: 'জমার শেষ তারিখ',
    checklist: 'নথির চেকলিস্ট', requirement: 'টি শর্ত', requirements: 'টি শর্ত', order: 'ক্রম', status: 'অবস্থা', mandatory: 'আবশ্যিক', optional: 'ঐচ্ছিক', expiry: 'মেয়াদ পরীক্ষা', noExpiry: 'মেয়াদ নেই',
    missing: 'অনুপস্থিত', notProvided: 'প্রদান করা হয়নি', dateNeeded: 'মেয়াদ তারিখ প্রয়োজন', expired: 'মেয়াদ শেষ', ok: 'ঠিক আছে', duplicate: 'ডুপ্লিকেট', enterExpiry: 'মেয়াদের তারিখ দিন',
    scan: 'প্যাকেজ প্রস্তুতি', clear: 'টি বাধা', readyText: 'সংযোজনের জন্য প্রস্তুত', progressOne: 'টি শর্ত ঠিক আছে', progress: 'টি শর্ত ঠিক আছে', next: 'পরবর্তী: উৎস PDF আপলোড করুন', generate: 'প্যাকেজ তৈরি করুন', generating: 'প্যাকেজ তৈরি হচ্ছে…', blockingReasons: 'বাধার কারণ', noBlockers: 'কোনো বাধা নেই', packageFailed: 'প্যাকেজ তৈরি করা যায়নি। মিলানো PDF দেখে আবার চেষ্টা করুন।', packageInvalid: 'তৈরি করা প্যাকেজ যাচাইয়ে ব্যর্থ হয়েছে এবং ডাউনলোড করা হয়নি। মিলানো PDF দেখে আবার চেষ্টা করুন।',
    invalid: 'শর্তের ফাইলটি খোলা যায়নি', errors: 'নিচের সমস্যাগুলো ঠিক করুন অথবা সঠিক ফাইলটি বেছে নিন।', chooseAnother: 'অন্য ফাইল বেছে নিন', dismiss: 'বার্তাটি বন্ধ করুন', downloadReady: 'প্যাকেজ যাচাই হয়েছে। নিচে ডাউনলোড করুন।', downloadPackage: 'প্যাকেজ PDF ডাউনলোড করুন', page: 'পৃষ্ঠা', local: 'শুধু স্থানীয় ওয়ার্কস্পেস', localCopy: 'টেন্ডারের তথ্য ও PDF শুধু এই ব্রাউজারেই প্রক্রিয়াকৃত হয়। কোনো সার্ভারে পাঠানো হয় না।',
    invalidJson: 'বাছাই করা ফাইলটি সঠিক JSON নয়।', rootObject: 'ফাইলটিতে একটি JSON অবজেক্ট থাকতে হবে।', missingTender: 'টেন্ডারের তথ্য অংশটি নেই।', requiredField: '{field}-এ লেখা থাকতে হবে।', invalidDeadline: 'tender.submission_deadline-এ YYYY-MM-DD বিন্যাসে একটি সঠিক তারিখ থাকতে হবে।', requirementsArray: 'শর্তের তালিকায় অন্তত একটি আইটেম থাকতে হবে।', requirementObject: '{item} একটি অবজেক্ট হতে হবে।', positiveOrder: '{item}.order একটি ধনাত্মক পূর্ণসংখ্যা হতে হবে।', booleanField: '{item}.{field} true অথবা false হতে হবে।', duplicateId: 'শর্তের ID {value} একাধিকবার ব্যবহার করা হয়েছে।', duplicateOrder: 'ক্রম নম্বর {value} একাধিকবার ব্যবহার করা হয়েছে।',
    workflowLabel: 'প্যাকেজ তৈরির ধাপ', workflowTitle: 'জমা দেওয়ার প্যাকেজ তৈরি করুন চার ধাপে', complete: 'সম্পন্ন', current: 'এখন এটি করুন', upcoming: 'পরবর্তী', workflowSteps: [{ title: 'টেন্ডার আমদানি', copy: 'requirements.json খুলুন' }, { title: 'PDF যোগ করুন', copy: 'সব উৎস নথি বেছে নিন' }, { title: 'মিলিয়ে যাচাই করুন', copy: 'ফাইল মিলিয়ে মেয়াদের তারিখ দিন' }, { title: 'প্যাকেজ তৈরি করুন', copy: 'যাচাইকৃত PDF ডাউনলোড করুন' }],
    blockedLabel: 'বাধা আছে', readyLabel: 'প্রস্তুত', footer: 'TenderPulse / প্রতিটি পাতায় নির্ভুলতা', liveLocal: 'লাইভ · স্থানীয়', noTenderSignal: 'কোনো টেন্ডার নেই', privacySignal: '১০০% ব্যক্তিগত', footerState: 'ইং · বা · শুধু স্থানীয়', upload: 'উৎস PDF গ্রহণ', drop: 'এখানে PDF ফাইল রাখুন', browse: 'PDF বেছে নিন', uploadHint: 'শুধু PDF · সর্বোচ্চ ৩০ ফাইল · মোট ৫০ MB', queue: 'আপলোড সারি', files: 'ফাইল', pages: 'পৃষ্ঠা', remove: 'মুছুন', rejected: 'প্রত্যাখ্যাত', processing: 'পৃষ্ঠা পড়া হচ্ছে…', corrupt: 'PDF পড়া যায়নি বা নষ্ট', protected: 'পাসওয়ার্ড-সুরক্ষিত PDF', nonPdf: 'শুধু PDF গ্রহণ করা হয়', fileLimit: 'সর্বোচ্চ ৩০টি ফাইল গ্রহণযোগ্য', sizeLimit: 'মোট ফাইলের আকার ৫০ MB-এর বেশি হতে পারে না', emptyQueue: 'এখনও কোনো উৎস PDF বাছাই করা হয়নি।', emptyQueueHelp: 'উপরে টেন্ডারের নথি যোগ করুন। পৃষ্ঠা গণনা ও ফাইলের নিরাপত্তা যাচাই স্বয়ংক্রিয়ভাবে হবে।', mapping: 'ফাইল মিলকরণ', match: 'ফাইল মিলান', chooseFile: 'একটি PDF ফাইল বেছে নিন', undo: 'পূর্বাবস্থায় নিন', unmatched: 'অমিল', mappedTo: 'মিলেছে', change: 'ফাইল বদলান', ignore: 'উপেক্ষা করুন', accept: 'মিল গ্রহণ করুন', suggestion: 'মিলের পরামর্শ', highConfidence: 'উচ্চ আস্থা', mediumConfidence: 'মাঝারি আস্থা', filenameReason: 'ফাইলনামে শর্তের {count}টি শব্দ মিলে গেছে', identifierReason: 'ফাইলনামে শর্তের ID রয়েছে', mapHint: 'প্রতিটি শর্তের জন্য একটি PDF বেছে নিন। আপনার অনুমতি ছাড়া কোনো পরামর্শ প্রয়োগ হয় না।'
  }
}

const initialState = { lang: 'en', package: null, error: null, uploads: [], matches: {}, expiries: {}, suggestionTargets: {}, ignoredSuggestions: {}, isGenerating: false, packageError: null, generatedPackage: null }

function reducer(state, action) {
  switch (action.type) {
    case 'TOGGLE_LANG': return { ...state, lang: state.lang === 'en' ? 'bn' : 'en' }
    case 'LOAD': return { ...state, package: action.payload, error: null, uploads: [], matches: {}, expiries: {}, suggestionTargets: {}, ignoredSuggestions: {}, isGenerating: false, packageError: null, generatedPackage: null }
    case 'ERROR': return { ...state, error: action.payload }
    case 'ADD_UPLOADS': return { ...state, uploads: [...state.uploads, ...action.payload], generatedPackage: null }
    case 'PATCH_UPLOAD': return { ...state, uploads: state.uploads.map((file) => file.id === action.payload.id ? { ...file, ...action.payload } : file) }
    case 'REMOVE_UPLOAD': {
      const suggestionTargets = { ...state.suggestionTargets }, ignoredSuggestions = { ...state.ignoredSuggestions }
      delete suggestionTargets[action.payload]; delete ignoredSuggestions[action.payload]
      return { ...state, uploads: state.uploads.filter((file) => file.id !== action.payload), matches: Object.fromEntries(Object.entries(state.matches).filter(([, uploadId]) => uploadId !== action.payload)), suggestionTargets, ignoredSuggestions, generatedPackage: null }
    }
    case 'MATCH_FILE': {
      const matches = { ...state.matches }
      const expiries = { ...state.expiries }
      const selectedUpload = state.uploads.find((file) => file.id === action.payload.uploadId)
      const duplicateMappedElsewhere = selectedUpload?.hash && Object.entries(matches).some(([requirementId, uploadId]) => requirementId !== action.payload.requirementId && uploadId !== action.payload.uploadId && state.uploads.find((file) => file.id === uploadId)?.hash === selectedUpload.hash)
      if (duplicateMappedElsewhere) return state
      if (matches[action.payload.requirementId] !== action.payload.uploadId) delete expiries[action.payload.requirementId]
      Object.keys(matches).forEach((requirementId) => { if (matches[requirementId] === action.payload.uploadId) delete matches[requirementId] })
      if (action.payload.uploadId) matches[action.payload.requirementId] = action.payload.uploadId
      else delete matches[action.payload.requirementId]
      const suggestionTargets = { ...state.suggestionTargets }, ignoredSuggestions = { ...state.ignoredSuggestions }
      delete suggestionTargets[action.payload.uploadId]; delete ignoredSuggestions[action.payload.uploadId]
      return { ...state, matches, expiries, suggestionTargets, ignoredSuggestions, generatedPackage: null }
    }
    case 'SET_EXPIRY': return { ...state, expiries: { ...state.expiries, [action.payload.requirementId]: action.payload.value }, generatedPackage: null }
    case 'SET_SUGGESTION_TARGET': return { ...state, suggestionTargets: { ...state.suggestionTargets, [action.payload.uploadId]: action.payload.requirementId } }
    case 'IGNORE_SUGGESTION': return { ...state, ignoredSuggestions: { ...state.ignoredSuggestions, [action.payload]: true } }
    case 'GENERATE_START': return { ...state, isGenerating: true, packageError: null, generatedPackage: null }
    case 'GENERATE_SUCCESS': return { ...state, isGenerating: false, generatedPackage: action.payload }
    case 'GENERATE_ERROR': return { ...state, isGenerating: false, packageError: action.payload }
    default: return state
  }
}

function fillMessage(message, values) {
  return Object.entries(values).reduce((text, [key, value]) => text.replace(`{${key}}`, value), message)
}

function isIsoDate(value) {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false
  const date = new Date(`${value}T00:00:00Z`)
  return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value
}

function validateRequirements(data, t) {
  const errors = []
  if (!data || typeof data !== 'object' || Array.isArray(data)) return [t.rootObject]
  const tenderFields = ['tender_id', 'title', 'procuring_entity', 'bidder', 'submission_deadline']
  if (!data.tender || typeof data.tender !== 'object') errors.push(t.missingTender)
  else {
    tenderFields.forEach((field) => { if (typeof data.tender[field] !== 'string' || !data.tender[field].trim()) errors.push(fillMessage(t.requiredField, { field: `tender.${field}` })) })
    if (typeof data.tender.submission_deadline === 'string' && data.tender.submission_deadline.trim() && !isIsoDate(data.tender.submission_deadline)) errors.push(t.invalidDeadline)
  }
  if (!Array.isArray(data.requirements) || !data.requirements.length) errors.push(t.requirementsArray)
  else {
    const ids = new Set(), orders = new Set()
    data.requirements.forEach((item, index) => {
      const at = `requirements[${index}]`
      if (!item || typeof item !== 'object') return errors.push(fillMessage(t.requirementObject, { item: at }))
      ;['id', 'title_en', 'title_bn'].forEach((field) => { if (typeof item[field] !== 'string' || !item[field].trim()) errors.push(fillMessage(t.requiredField, { field: `${at}.${field}` })) })
      if (!Number.isInteger(item.order) || item.order < 1) errors.push(fillMessage(t.positiveOrder, { item: at }))
      if (typeof item.mandatory !== 'boolean') errors.push(fillMessage(t.booleanField, { item: at, field: 'mandatory' }))
      if (typeof item.has_expiry !== 'boolean') errors.push(fillMessage(t.booleanField, { item: at, field: 'has_expiry' }))
      if (ids.has(item.id)) errors.push(fillMessage(t.duplicateId, { value: item.id })); ids.add(item.id)
      if (orders.has(item.order)) errors.push(fillMessage(t.duplicateOrder, { value: item.order })); orders.add(item.order)
    })
  }
  return errors
}

function getStatus(requirement, matchedUpload, expiryDate, deadline) {
  if (matchedUpload) {
    if (requirement.has_expiry && !expiryDate) return 'dateNeeded'
    if (requirement.has_expiry && expiryDate < deadline) return 'expired'
    return 'ok'
  }
  return requirement.mandatory ? 'missing' : 'notProvided'
}

function getDuplicateIds(uploads) {
  const counts = uploads.reduce((all, file) => ({ ...all, ...(file.hash ? { [file.hash]: (all[file.hash] ?? 0) + 1 } : {}) }), {})
  return new Set(uploads.filter((file) => file.hash && counts[file.hash] > 1).map((file) => file.id))
}

function ownerOfHash(file, uploads, matches) {
  if (!file.hash) return null
  return Object.entries(matches).find(([, uploadId]) => uploads.find((upload) => upload.id === uploadId)?.hash === file.hash)?.[0] ?? null
}

function filenameTokens(filename) {
  const aliases = { cert: 'certificate', fin: 'financial', tech: 'technical', auth: 'authorization' }
  return filename.toLowerCase().replace(/\.pdf$/i, '').split(/[^\p{L}\p{N}]+/u).filter((token) => token.length > 1 && !['document', 'copy', 'scan', 'final', 'signed', 'file', 'pdf'].includes(token)).map((token) => aliases[token] ?? token)
}

function getFilenameSuggestion(file, requirements, matches) {
  const filename = file.name.toLowerCase()
  const fileTokens = new Set(filenameTokens(file.name))
  const available = requirements.filter((requirement) => !matches[requirement.id])
  const candidates = available.map((requirement) => {
    const titleMatches = [requirement.title_en, requirement.title_bn].map((title) => {
      const tokens = filenameTokens(title)
      const matchedWords = tokens.filter((token) => fileTokens.has(token)).length
      return { score: tokens.length ? matchedWords / tokens.length : 0, matchedWords }
    }).sort((a, b) => b.score - a.score || b.matchedWords - a.matchedWords)
    const idMatch = filename.includes(requirement.id.toLowerCase())
    return { requirementId: requirement.id, score: idMatch ? 0.98 : titleMatches[0].score, idMatch, matchedWords: titleMatches[0].matchedWords }
  }).filter((candidate) => candidate.idMatch || candidate.score >= 0.55)
  return candidates.sort((a, b) => b.score - a.score || b.matchedWords - a.matchedWords)[0] ?? null
}

async function sha256(bytes) {
  const digest = await crypto.subtle.digest('SHA-256', bytes)
  return Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, '0')).join('')
}

function createUpload(file) {
  return { id: `${file.name}-${file.size}-${file.lastModified}-${crypto.randomUUID()}`, file, name: file.name, bytes: file.size, pages: null, error: null, inspecting: true }
}

function getPdfError(error) {
  if (error?.name === 'PasswordException') return 'protected'
  return 'corrupt'
}

function formatBytes(bytes) {
  if (!bytes) return '0 KB'
  if (bytes < 1024 * 1024) return `${Math.max(1, Math.round(bytes / 1024))} KB`
  return `${(bytes / (1024 * 1024)).toFixed(bytes >= 10 * 1024 * 1024 ? 0 : 1)} MB`
}

async function validateGeneratedPackage(bytes, expectedPageCount) {
  let task
  try {
    task = getDocument({ data: bytes.slice(), disableAutoFetch: true, disableStream: true })
    const pdf = await task.promise
    if (pdf.numPages !== expectedPageCount) throw new Error('validation')
  } catch (error) {
    if (error?.message === 'validation') throw error
    throw new Error('validation')
  } finally {
    await task?.destroy().catch(() => {})
  }
}

function App() {
  const [state, dispatch] = useReducer(reducer, initialState)
  const inputRef = useRef(null)
  const pdfInputRef = useRef(null)
  const generatedUrl = state.generatedPackage?.url
  useEffect(() => () => { if (generatedUrl) URL.revokeObjectURL(generatedUrl) }, [generatedUrl])
  const t = copy[state.lang]
  const requirements = state.package?.requirements ?? []
  const blocking = requirements.filter((item) => ['missing', 'dateNeeded', 'expired'].includes(getStatus(item, state.uploads.find((file) => file.id === state.matches[item.id]), state.expiries[item.id], state.package?.tender.submission_deadline))).length
  const validUploadCount = state.uploads.filter((file) => !file.error && !file.inspecting).length
  const workflowStep = !state.package ? 0 : validUploadCount === 0 ? 1 : blocking > 0 ? 2 : 3
  const handleFile = async (event) => {
    const file = event.target.files?.[0]
    event.target.value = ''
    if (!file) return
    try {
      const data = JSON.parse(await file.text())
      const errors = { en: validateRequirements(data, copy.en), bn: validateRequirements(data, copy.bn) }
      if (errors.en.length) dispatch({ type: 'ERROR', payload: errors })
      else dispatch({ type: 'LOAD', payload: { tender: data.tender, requirements: [...data.requirements].sort((a, b) => a.order - b.order) } })
    } catch { dispatch({ type: 'ERROR', payload: { en: [copy.en.invalidJson], bn: [copy.bn.invalidJson] } }) }
  }
  const inspectUpload = async (upload) => {
    let task
    try {
      const bytes = new Uint8Array(await upload.file.arrayBuffer())
      const header = String.fromCharCode(...bytes.subarray(0, Math.min(bytes.length, 1024)))
      if (!header.includes('%PDF-')) {
        dispatch({ type: 'PATCH_UPLOAD', payload: { id: upload.id, error: 'nonPdf', inspecting: false } })
        return
      }
      const hash = await sha256(bytes)
      dispatch({ type: 'PATCH_UPLOAD', payload: { id: upload.id, hash } })
      task = getDocument({ data: bytes, disableAutoFetch: true, disableStream: true })
      const pdf = await task.promise
      dispatch({ type: 'PATCH_UPLOAD', payload: { id: upload.id, pages: pdf.numPages, inspecting: false } })
    } catch (error) {
      dispatch({ type: 'PATCH_UPLOAD', payload: { id: upload.id, error: getPdfError(error), inspecting: false } })
    } finally {
      await task?.destroy().catch(() => {})
    }
  }
  const addUploads = (list) => {
    const selected = Array.from(list ?? [])
    if (!selected.length) return
    const accepted = state.uploads.filter((item) => !item.error)
    let count = accepted.length
    let bytes = accepted.reduce((sum, item) => sum + item.bytes, 0)
    const additions = selected.map((file) => {
      const isPdf = file.type === 'application/pdf' || /\.pdf$/i.test(file.name)
      const upload = createUpload(file)
      if (!isPdf) return { ...upload, error: 'nonPdf', inspecting: false }
      if (count >= MAX_FILES) return { ...upload, error: 'fileLimit', inspecting: false }
      if (bytes + file.size > MAX_TOTAL_BYTES) return { ...upload, error: 'sizeLimit', inspecting: false }
      count += 1
      bytes += file.size
      return upload
    })
    dispatch({ type: 'ADD_UPLOADS', payload: additions })
    additions.filter((item) => item.inspecting).forEach(inspectUpload)
  }
  const handlePdfInput = (event) => { addUploads(event.target.files); event.target.value = '' }
  const generatePackage = async () => {
    if (!state.package || blocking) return
    dispatch({ type: 'GENERATE_START' })
    try {
      const bytes = await createTenderPackage({ tender: state.package.tender, requirements, uploads: state.uploads, matches: state.matches })
      const expectedPageCount = 2 + requirements.filter((requirement) => state.matches[requirement.id]).reduce((total, requirement) => total + (state.uploads.find((file) => file.id === state.matches[requirement.id])?.pages ?? 0), 0)
      await validateGeneratedPackage(bytes, expectedPageCount)
      const blob = new Blob([bytes], { type: 'application/pdf' })
      const url = URL.createObjectURL(blob)
      dispatch({ type: 'GENERATE_SUCCESS', payload: { url, filename: `${state.package.tender.tender_id}_Package.pdf` } })
    } catch (error) {
      dispatch({ type: 'GENERATE_ERROR', payload: error?.message === 'validation' ? 'validation' : 'generation' })
    }
  }
  return <main className="shell" lang={state.lang === 'bn' ? 'bn' : 'en'}>
    <div className="orb orb-a" /><div className="orb orb-b" /><div className="grid" />
    <nav className="nav"><a className="brand" href="#top" aria-label={t.homeLabel}><span className="brand-mark">T</span><span>TENDER<span>PULSE</span></span></a><button className="language" onClick={() => dispatch({ type: 'TOGGLE_LANG' })}><span className="globe">◎</span>{t.language}</button></nav>
    <section className="hero" id="top">
      <div className="hero-copy"><p className="eyebrow"><i />{t.eyebrow}</p><h1>{t.title}<br /><em>{t.accent}</em></h1><p className="subtitle">{t.subtitle}</p>
        <div className="actions"><button className="primary" onClick={() => inputRef.current?.click()}>{t.import}<span>↗</span></button><input ref={inputRef} hidden type="file" accept="application/json,.json" onChange={handleFile}/></div><p className="hint">⌁ {t.importHint}</p>
      </div>
      <div className="signal-card" data-system-label={t.systemLabel}><div className="signal-top"><span>{t.liveLocal}</span><span className="pulse" /></div><div className="signal-ring"><span>{requirements.length || '—'}</span><small>{requirements.length ? requirements.length === 1 ? t.requirement : t.requirements : t.noTenderSignal}</small></div><div className="signal-bottom"><span>{state.package?.tender.tender_id || t.noTenderSignal}</span><span>◌ {t.privacySignal}</span></div></div>
    </section>
    <Workflow t={t} activeStep={workflowStep} />
    {state.error && <section className="error card" role="alert"><div className="error-icon">!</div><div className="error-copy"><strong>{t.invalid}</strong><p>{t.errors}</p><ul>{state.error[state.lang].map((error) => <li key={error}>{error}</li>)}</ul><div className="error-actions"><button type="button" onClick={() => inputRef.current?.click()}>{t.chooseAnother}</button><button type="button" onClick={() => dispatch({type:'ERROR', payload:null})}>{t.dismiss}</button></div></div></section>}
    {!state.package ? <section className="empty card"><span className="empty-step">{t.noTenderEyebrow}</span><div className="empty-radar"><span>⌁</span></div><h2>{t.noTender}</h2><p>{t.noTenderCopy}</p><small>{t.noTenderExpected}</small><button className="text-button" onClick={() => inputRef.current?.click()}>{t.import} <span>→</span></button></section> : <Workspace tender={state.package.tender} requirements={requirements} t={t} lang={state.lang} blocking={blocking} uploads={state.uploads} matches={state.matches} expiries={state.expiries} suggestionTargets={state.suggestionTargets} ignoredSuggestions={state.ignoredSuggestions} isGenerating={state.isGenerating} packageError={state.packageError} generatedPackage={state.generatedPackage} onGenerate={generatePackage} onAddUploads={addUploads} onRemoveUpload={(id) => dispatch({ type: 'REMOVE_UPLOAD', payload: id })} onMatch={(requirementId, uploadId) => dispatch({ type: 'MATCH_FILE', payload: { requirementId, uploadId } })} onExpiry={(requirementId, value) => dispatch({ type: 'SET_EXPIRY', payload: { requirementId, value } })} onSuggestionTarget={(uploadId, requirementId) => dispatch({ type: 'SET_SUGGESTION_TARGET', payload: { uploadId, requirementId } })} onIgnoreSuggestion={(uploadId) => dispatch({ type: 'IGNORE_SUGGESTION', payload: uploadId })} pdfInputRef={pdfInputRef} onPdfInput={handlePdfInput}/>}
    <footer><span>{t.footer}</span><span>{t.footerState}</span></footer>
  </main>
}

function Workflow({ t, activeStep }) {
  return <section className="workflow" aria-label={t.workflowLabel}><div className="workflow-heading"><span>{t.workflowLabel}</span><strong>{t.workflowTitle}</strong></div><ol>{t.workflowSteps.map((step, index) => { const state = index < activeStep ? 'complete' : index === activeStep ? 'current' : 'upcoming'; return <li className={state} key={step.title}><span>{String(index + 1).padStart(2, '0')}</span><div><strong>{step.title}</strong><small>{step.copy}</small></div><em>{t[state]}</em></li> })}</ol></section>
}

function Workspace({ tender, requirements, t, lang, blocking, uploads, matches, expiries, suggestionTargets, ignoredSuggestions, isGenerating, packageError, generatedPackage, onGenerate, onAddUploads, onRemoveUpload, onMatch, onExpiry, onSuggestionTarget, onIgnoreSuggestion, pdfInputRef, onPdfInput }) {
  const duplicateIds = getDuplicateIds(uploads)
  const statuses = requirements.map((item) => getStatus(item, uploads.find((file) => file.id === matches[item.id]), expiries[item.id], tender.submission_deadline))
  const statusCounts = statuses.reduce((counts, status) => ({ ...counts, [status]: (counts[status] ?? 0) + 1 }), {})
  const readyCount = statusCounts.ok ?? 0
  const blockingReasons = ['missing', 'dateNeeded', 'expired'].filter((status) => statusCounts[status])
  return <section className="workspace">
    <div className="tender-card card"><div className="section-kicker">01 / {t.tender}</div><div className="tender-heading"><span className="id-chip">{tender.tender_id}</span><h2>{tender.title}</h2></div><div className="facts"><Fact label={t.entity} value={tender.procuring_entity}/><Fact label={t.bidder} value={tender.bidder}/><Fact label={t.deadline} value={new Date(`${tender.submission_deadline}T00:00:00`).toLocaleDateString(lang === 'bn' ? 'bn-BD' : 'en-GB', { day:'2-digit', month:'short', year:'numeric' })}/></div></div>
    <aside className={`readiness card ${blocking ? '' : 'is-ready'}`} data-state-label={blocking ? t.blockedLabel : t.readyLabel}><div className="section-kicker">02 / {t.scan}</div><div className="readiness-number"><span>{blocking}</span><small>{t.clear}</small></div><div className="meter"><i style={{width: `${requirements.length ? (readyCount / requirements.length) * 100 : 0}%`}} /></div><p>{readyCount} / {requirements.length} {requirements.length === 1 ? t.progressOne : t.progress}</p><div className="blocking-reasons">{blockingReasons.length ? <><strong>{t.blockingReasons}</strong><ul>{blockingReasons.map((status) => <li key={status}><span className={`reason-dot ${status}`} />{t[status]}<b>{statusCounts[status]}</b></li>)}</ul></> : <p className="clear-state">{t.noBlockers}</p>}</div>{packageError && <p className="package-error">{packageError === 'validation' ? t.packageInvalid : t.packageFailed}</p>}<button onClick={onGenerate} disabled={blocking > 0 || isGenerating}>{isGenerating ? t.generating : t.generate} <span>→</span></button>{generatedPackage && <div className="download-ready"><p>{t.downloadReady}</p><a href={generatedPackage.url} download={generatedPackage.filename}>{t.downloadPackage} ↓</a></div>}</aside>
    <section className="checklist card">
      <div className="checklist-top"><div><div className="section-kicker">03 / {t.checklist}</div><h2>{requirements.length} <span>{requirements.length === 1 ? t.requirement : t.requirements}</span></h2></div><div className="legend"><span><i className="dot red" />{t.missing}</span><span><i className="dot amber" />{t.dateNeeded}</span><span><i className="dot dim" />{t.notProvided}</span><span><i className="dot cyan" />{t.ok}</span></div></div>
      <p className="mapping-hint">⌁ {t.mapHint}</p>
      <div className="table">
        <div className="row row-head"><span>{t.order}</span><span>{t.checklist}</span><span>{t.expiry}</span><span>{t.mapping}</span><span>{t.status}</span></div>
        {requirements.map((item) => {
          const matchedId = matches[item.id]
          const matchedUpload = uploads.find((file) => file.id === matchedId)
          const status = getStatus(item, matchedUpload, expiries[item.id], tender.submission_deadline)
          const choices = uploads.filter((file) => !file.error && !file.inspecting)
          return <div className="row" key={item.id}>
            <span className="order">{String(item.order).padStart(2, '0')}</span>
            <div className="doc"><strong>{lang === 'bn' ? item.title_bn : item.title_en}</strong><small>{item.id} · {item.mandatory ? t.mandatory : t.optional}</small></div>
            <span className={item.has_expiry ? 'expiry yes' : 'expiry'}>{item.has_expiry && matchedUpload ? <input aria-label={`${t.enterExpiry} ${item.id}`} type="date" value={expiries[item.id] ?? ''} onChange={(event) => onExpiry(item.id, event.target.value)} /> : item.has_expiry ? `◷ ${t.expiry}` : `— ${t.noExpiry}`}</span>
            <div className="match-control"><select aria-label={`${t.match} ${item.id}`} value={matchedId || ''} onChange={(event) => onMatch(item.id, event.target.value)}><option value="">{t.chooseFile}</option>{choices.map((file) => {
              const owner = Object.keys(matches).find((requirementId) => matches[requirementId] === file.id)
              const identicalOwner = duplicateIds.has(file.id) ? ownerOfHash(file, uploads, matches) : null
              const blockedDuplicate = Boolean(identicalOwner && identicalOwner !== item.id && matches[identicalOwner] !== file.id)
              const label = blockedDuplicate ? ` — ${t.duplicate}: ${identicalOwner}` : owner && owner !== item.id ? ` — ${owner}` : ''
              return <option disabled={blockedDuplicate} value={file.id} key={file.id}>{file.name}{label}</option>
            })}</select>{matchedUpload && <button type="button" onClick={() => onMatch(item.id, '')}>{t.undo}</button>}</div>
            <span className={`status ${status}`}>{t[status]}</span>
          </div>
        })}
      </div>
    </section>
    <UploadPanel uploads={uploads} matches={matches} requirements={requirements} duplicateIds={duplicateIds} suggestionTargets={suggestionTargets} ignoredSuggestions={ignoredSuggestions} t={t} lang={lang} onAddUploads={onAddUploads} onRemoveUpload={onRemoveUpload} onMatch={onMatch} onSuggestionTarget={onSuggestionTarget} onIgnoreSuggestion={onIgnoreSuggestion} inputRef={pdfInputRef} onInput={onPdfInput} />
    <section className="privacy"><span className="lock">⌑</span><div><strong>{t.local}</strong><p>{t.localCopy}</p></div><span className="privacy-line" /></section>
  </section>
}
function Fact({ label, value }) { return <div><small>{label}</small><strong>{value}</strong></div> }
function UploadPanel({ uploads, matches, requirements, duplicateIds, suggestionTargets, ignoredSuggestions, t, lang, onAddUploads, onRemoveUpload, onMatch, onSuggestionTarget, onIgnoreSuggestion, inputRef, onInput }) {
  const [dragging, setDragging] = useState(false)
  const valid = uploads.filter((file) => !file.error)
  const totalBytes = valid.reduce((sum, file) => sum + file.bytes, 0)
  return <section className="upload-panel card">
    <div className="upload-heading"><div><div className="section-kicker">04 / {t.upload}</div><h2>{t.queue}</h2></div><span>{valid.length} / {MAX_FILES} {t.files} · {formatBytes(totalBytes)} / 50 MB</span></div>
    <div className={`dropzone ${dragging ? 'is-dragging' : ''}`} onDragOver={(event) => { event.preventDefault(); setDragging(true) }} onDragLeave={() => setDragging(false)} onDrop={(event) => { event.preventDefault(); setDragging(false); onAddUploads(event.dataTransfer.files) }}>
      <span className="drop-mark">⇩</span><strong>{t.drop}</strong><small>{t.uploadHint}</small><button type="button" onClick={() => inputRef.current?.click()}>{t.browse}</button><input ref={inputRef} hidden type="file" accept="application/pdf,.pdf" multiple onChange={onInput}/>
    </div>
    <div className="upload-list">{uploads.length ? uploads.map((file) => {
      const requirement = requirements.find((item) => matches[item.id] === file.id)
      const duplicateMappedElsewhere = file.hash && Object.values(matches).some((uploadId) => uploads.find((upload) => upload.id === uploadId)?.hash === file.hash)
      const suggested = !file.error && !file.inspecting && !requirement && !duplicateMappedElsewhere && !ignoredSuggestions[file.id] ? getFilenameSuggestion(file, requirements, matches) : null
      const availableRequirements = requirements.filter((item) => !matches[item.id])
      const suggestedRequirementId = availableRequirements.some((item) => item.id === suggestionTargets[file.id]) ? suggestionTargets[file.id] : suggested?.requirementId
      const suggestedRequirement = requirements.find((item) => item.id === suggestedRequirementId)
      const reason = suggested?.idMatch ? t.identifierReason : suggested ? t.filenameReason.replace('{count}', suggested.matchedWords) : ''
      return <article className={`upload-item ${file.error ? 'has-error' : ''} ${requirement ? 'is-mapped' : ''} ${suggested ? 'has-suggestion' : ''}`} key={file.id}>
        <div className="file-type">PDF</div><div className="file-meta"><strong>{file.name}{duplicateIds.has(file.id) && <mark>{t.duplicate}</mark>}</strong><small>{formatBytes(file.bytes)} · {file.inspecting ? t.processing : file.error ? t[file.error] : `${file.pages} ${file.pages === 1 ? t.page : t.pages}`}</small></div><div className="file-state">{file.error ? <span>{t.rejected}</span> : file.inspecting ? <i /> : <b>{file.pages}</b>}</div><div className={`mapping-state ${requirement ? 'mapped' : ''}`}>{requirement ? <><span>{t.mappedTo}</span><strong>{requirement.id}</strong></> : <span>{t.unmatched}</span>}</div><button type="button" aria-label={`${t.remove} ${file.name}`} onClick={() => onRemoveUpload(file.id)}>×</button>
        {suggested && <div className="suggestion"><div><span>{t.suggestion}</span><b>{suggested.requirementId} · {suggested.score >= .8 ? t.highConfidence : t.mediumConfidence}</b><small>{reason}</small></div><select aria-label={`${t.change} ${file.name}`} value={suggestedRequirementId} onChange={(event) => onSuggestionTarget(file.id, event.target.value)}>{availableRequirements.map((item) => <option key={item.id} value={item.id}>{item.id} — {lang === 'bn' ? item.title_bn : item.title_en}</option>)}</select><div className="suggestion-actions"><button type="button" onClick={() => onMatch(suggestedRequirementId, file.id)} disabled={!suggestedRequirement}>{t.accept}</button><button type="button" onClick={() => onIgnoreSuggestion(file.id)}>{t.ignore}</button></div></div>}
      </article>
    }) : <div className="queue-empty"><strong>{t.emptyQueue}</strong><span>{t.emptyQueueHelp}</span></div>}</div>
  </section>
}
export default App
