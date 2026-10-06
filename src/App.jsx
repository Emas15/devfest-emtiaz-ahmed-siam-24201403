import { useReducer, useRef, useState } from 'react'
import { getDocument, GlobalWorkerOptions } from 'pdfjs-dist'
import pdfWorker from 'pdfjs-dist/build/pdf.worker.min.mjs?url'

GlobalWorkerOptions.workerSrc = pdfWorker

const MAX_FILES = 30
const MAX_TOTAL_BYTES = 50 * 1024 * 1024

const copy = {
  en: {
    eyebrow: 'Tender package command center', title: 'Make every submission', accent: 'submission-ready.',
    subtitle: 'Import tender requirements, trace every document, and build a verified package — entirely in your browser.',
    import: 'Import requirements.json', language: 'বাংলা',
    importHint: 'JSON stays on this device. Nothing is uploaded.', noTender: 'Awaiting tender brief', noTenderCopy: 'Start by importing the tender requirements file to unlock the package checklist.',
    tender: 'Tender intelligence', entity: 'Procuring entity', bidder: 'Bidder', deadline: 'Submission deadline',
    checklist: 'Document checklist', requirements: 'requirements', order: 'Order', mandatory: 'Mandatory', optional: 'Optional', expiry: 'Expiry check', noExpiry: 'No expiry',
    missing: 'Missing', notProvided: 'Not provided', dateNeeded: 'Expiry date needed', expired: 'Expired', ok: 'OK', duplicate: 'Duplicate', enterExpiry: 'Enter expiry date',
    scan: 'Package readiness', clear: 'blocking items', readyText: 'Ready to assemble', progress: 'requirements OK', next: 'Next: upload source PDFs', generate: 'Generate package', blockingReasons: 'Blocking reasons', noBlockers: 'No blocking requirements',
    invalid: 'Could not import this file', errors: 'Review the JSON schema and try again.', local: 'Local-only workspace', localCopy: 'Tender data is processed in this browser only.',
    footer: 'TenderPulse / precision in every page', upload: 'Source PDF intake', drop: 'Drop PDF files here', browse: 'Choose PDFs', uploadHint: 'PDF only · up to 30 files · 50 MB total', queue: 'Upload queue', files: 'files', pages: 'pages', remove: 'Remove', rejected: 'Rejected', processing: 'Reading pages…', corrupt: 'Unreadable or corrupt PDF', protected: 'Password-protected PDF', nonPdf: 'Only PDF files are accepted', fileLimit: 'Maximum of 30 files reached', sizeLimit: 'Total file size cannot exceed 50 MB', emptyQueue: 'No source PDFs selected yet.', mapping: 'File mapping', match: 'Match file', chooseFile: 'Choose a PDF file', undo: 'Undo', unmatched: 'Unmatched', mappedTo: 'Mapped to', change: 'Change file', mapHint: 'Each PDF can be mapped to one requirement only.'
  },
  bn: {
    eyebrow: 'টেন্ডার প্যাকেজ কমান্ড সেন্টার', title: 'প্রতিটি জমা দিন', accent: 'নির্ভুলভাবে।',
    subtitle: 'টেন্ডারের শর্ত আমদানি করুন, প্রতিটি নথি ট্র্যাক করুন এবং যাচাইকৃত প্যাকেজ তৈরি করুন — সম্পূর্ণ আপনার ব্রাউজারে।',
    import: 'requirements.json আমদানি করুন', language: 'English',
    importHint: 'JSON আপনার ডিভাইসেই থাকে। কিছুই আপলোড করা হয় না।', noTender: 'টেন্ডার ব্রিফের অপেক্ষায়', noTenderCopy: 'প্যাকেজ চেকলিস্ট চালু করতে টেন্ডারের requirements ফাইল আমদানি করুন।',
    tender: 'টেন্ডার তথ্য', entity: 'ক্রয়কারী সংস্থা', bidder: 'দরদাতা', deadline: 'জমার শেষ তারিখ',
    checklist: 'নথির চেকলিস্ট', requirements: 'টি শর্ত', order: 'ক্রম', mandatory: 'আবশ্যিক', optional: 'ঐচ্ছিক', expiry: 'মেয়াদ পরীক্ষা', noExpiry: 'মেয়াদ নেই',
    missing: 'অনুপস্থিত', notProvided: 'প্রদান করা হয়নি', dateNeeded: 'মেয়াদ তারিখ প্রয়োজন', expired: 'মেয়াদ শেষ', ok: 'ঠিক আছে', duplicate: 'ডুপ্লিকেট', enterExpiry: 'মেয়াদের তারিখ দিন',
    scan: 'প্যাকেজ প্রস্তুতি', clear: 'টি বাধা', readyText: 'সংযোজনের জন্য প্রস্তুত', progress: 'টি শর্ত ঠিক আছে', next: 'পরবর্তী: উৎস PDF আপলোড করুন', generate: 'প্যাকেজ তৈরি করুন', blockingReasons: 'বাধার কারণ', noBlockers: 'কোনো বাধা নেই',
    invalid: 'এই ফাইলটি আমদানি করা যায়নি', errors: 'JSON কাঠামো দেখে আবার চেষ্টা করুন।', local: 'শুধু স্থানীয় ওয়ার্কস্পেস', localCopy: 'টেন্ডারের তথ্য কেবল এই ব্রাউজারেই প্রক্রিয়াকৃত হয়।',
    footer: 'TenderPulse / প্রতিটি পাতায় নির্ভুলতা', upload: 'উৎস PDF গ্রহণ', drop: 'এখানে PDF ফাইল রাখুন', browse: 'PDF বেছে নিন', uploadHint: 'শুধু PDF · সর্বোচ্চ ৩০ ফাইল · মোট ৫০ MB', queue: 'আপলোড সারি', files: 'ফাইল', pages: 'পৃষ্ঠা', remove: 'মুছুন', rejected: 'প্রত্যাখ্যাত', processing: 'পৃষ্ঠা পড়া হচ্ছে…', corrupt: 'PDF পড়া যায়নি বা নষ্ট', protected: 'পাসওয়ার্ড-সুরক্ষিত PDF', nonPdf: 'শুধু PDF গ্রহণ করা হয়', fileLimit: 'সর্বোচ্চ ৩০টি ফাইল গ্রহণযোগ্য', sizeLimit: 'মোট ফাইলের আকার ৫০ MB-এর বেশি হতে পারে না', emptyQueue: 'এখনও কোনো উৎস PDF বাছাই করা হয়নি।', mapping: 'ফাইল মিলকরণ', match: 'ফাইল মিলান', chooseFile: 'একটি PDF ফাইল বেছে নিন', undo: 'পূর্বাবস্থায় নিন', unmatched: 'অমিল', mappedTo: 'মিলেছে', change: 'ফাইল বদলান', mapHint: 'প্রতিটি PDF কেবল একটি শর্তের সঙ্গে মিলানো যায়।'
  }
}

const initialState = { lang: 'en', package: null, error: null, uploads: [], matches: {}, expiries: {} }

function reducer(state, action) {
  switch (action.type) {
    case 'TOGGLE_LANG': return { ...state, lang: state.lang === 'en' ? 'bn' : 'en' }
    case 'LOAD': return { ...state, package: action.payload, error: null, uploads: [], matches: {}, expiries: {} }
    case 'ERROR': return { ...state, error: action.payload }
    case 'ADD_UPLOADS': return { ...state, uploads: [...state.uploads, ...action.payload] }
    case 'PATCH_UPLOAD': return { ...state, uploads: state.uploads.map((file) => file.id === action.payload.id ? { ...file, ...action.payload } : file) }
    case 'REMOVE_UPLOAD': return { ...state, uploads: state.uploads.filter((file) => file.id !== action.payload), matches: Object.fromEntries(Object.entries(state.matches).filter(([, uploadId]) => uploadId !== action.payload)) }
    case 'MATCH_FILE': {
      const matches = { ...state.matches }
      const expiries = { ...state.expiries }
      const selectedUpload = state.uploads.find((file) => file.id === action.payload.uploadId)
      const duplicateMappedElsewhere = selectedUpload?.hash && Object.entries(matches).some(([requirementId, uploadId]) => requirementId !== action.payload.requirementId && state.uploads.find((file) => file.id === uploadId)?.hash === selectedUpload.hash)
      if (duplicateMappedElsewhere) return state
      if (matches[action.payload.requirementId] !== action.payload.uploadId) delete expiries[action.payload.requirementId]
      Object.keys(matches).forEach((requirementId) => { if (matches[requirementId] === action.payload.uploadId) delete matches[requirementId] })
      if (action.payload.uploadId) matches[action.payload.requirementId] = action.payload.uploadId
      else delete matches[action.payload.requirementId]
      return { ...state, matches, expiries }
    }
    case 'SET_EXPIRY': return { ...state, expiries: { ...state.expiries, [action.payload.requirementId]: action.payload.value } }
    default: return state
  }
}

function validateRequirements(data) {
  const errors = []
  if (!data || typeof data !== 'object' || Array.isArray(data)) return ['Root must be a JSON object.']
  const tenderFields = ['tender_id', 'title', 'procuring_entity', 'bidder', 'submission_deadline']
  if (!data.tender || typeof data.tender !== 'object') errors.push('Missing tender object.')
  else tenderFields.forEach((field) => { if (typeof data.tender[field] !== 'string' || !data.tender[field].trim()) errors.push(`tender.${field} must be a non-empty string.`) })
  if (!Array.isArray(data.requirements) || !data.requirements.length) errors.push('requirements must be a non-empty array.')
  else {
    const ids = new Set(), orders = new Set()
    data.requirements.forEach((item, index) => {
      const at = `requirements[${index}]`
      if (!item || typeof item !== 'object') return errors.push(`${at} must be an object.`)
      ;['id', 'title_en', 'title_bn'].forEach((field) => { if (typeof item[field] !== 'string' || !item[field].trim()) errors.push(`${at}.${field} must be a non-empty string.`) })
      if (!Number.isInteger(item.order) || item.order < 1) errors.push(`${at}.order must be a positive integer.`)
      if (typeof item.mandatory !== 'boolean') errors.push(`${at}.mandatory must be boolean.`)
      if (typeof item.has_expiry !== 'boolean') errors.push(`${at}.has_expiry must be boolean.`)
      if (ids.has(item.id)) errors.push(`Duplicate requirement id: ${item.id}.`); ids.add(item.id)
      if (orders.has(item.order)) errors.push(`Duplicate order: ${item.order}.`); orders.add(item.order)
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

function App() {
  const [state, dispatch] = useReducer(reducer, initialState)
  const inputRef = useRef(null)
  const pdfInputRef = useRef(null)
  const t = copy[state.lang]
  const requirements = state.package?.requirements ?? []
  const blocking = requirements.filter((item) => ['missing', 'dateNeeded', 'expired'].includes(getStatus(item, state.uploads.find((file) => file.id === state.matches[item.id]), state.expiries[item.id], state.package?.tender.submission_deadline))).length
  const handleFile = async (event) => {
    const file = event.target.files?.[0]
    event.target.value = ''
    if (!file) return
    try {
      const data = JSON.parse(await file.text())
      const errors = validateRequirements(data)
      if (errors.length) dispatch({ type: 'ERROR', payload: errors })
      else dispatch({ type: 'LOAD', payload: { tender: data.tender, requirements: [...data.requirements].sort((a, b) => a.order - b.order) } })
    } catch { dispatch({ type: 'ERROR', payload: ['The selected file is not valid JSON.'] }) }
  }
  const inspectUpload = async (upload) => {
    let pdf
    try {
      const bytes = new Uint8Array(await upload.file.arrayBuffer())
      const hash = await sha256(bytes)
      dispatch({ type: 'PATCH_UPLOAD', payload: { id: upload.id, hash } })
      const task = getDocument({ data: bytes, disableAutoFetch: true, disableStream: true })
      pdf = await task.promise
      dispatch({ type: 'PATCH_UPLOAD', payload: { id: upload.id, pages: pdf.numPages, inspecting: false } })
    } catch (error) {
      dispatch({ type: 'PATCH_UPLOAD', payload: { id: upload.id, error: getPdfError(error), inspecting: false } })
    } finally {
      pdf?.destroy().catch(() => {})
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
  return <main className="shell">
    <div className="orb orb-a" /><div className="orb orb-b" /><div className="grid" />
    <nav className="nav"><a className="brand" href="#top" aria-label="TenderPulse home"><span className="brand-mark">T</span><span>TENDER<span>PULSE</span></span></a><button className="language" onClick={() => dispatch({ type: 'TOGGLE_LANG' })}><span className="globe">◎</span>{t.language}</button></nav>
    <section className="hero" id="top">
      <div className="hero-copy"><p className="eyebrow"><i />{t.eyebrow}</p><h1>{t.title}<br /><em>{t.accent}</em></h1><p className="subtitle">{t.subtitle}</p>
        <div className="actions"><button className="primary" onClick={() => inputRef.current?.click()}>{t.import}<span>↗</span></button><input ref={inputRef} hidden type="file" accept="application/json,.json" onChange={handleFile}/></div><p className="hint">⌁ {t.importHint}</p>
      </div>
      <div className="signal-card"><div className="signal-top"><span>LIVE · LOCAL</span><span className="pulse" /></div><div className="signal-ring"><span>{requirements.length || '—'}</span><small>{requirements.length ? t.requirements : 'REQUIREMENTS'}</small></div><div className="signal-bottom"><span>{state.package?.tender.tender_id || 'NO TENDER'}</span><span>◌ 100% PRIVATE</span></div></div>
    </section>
    {state.error && <section className="error card"><div className="error-icon">!</div><div><strong>{t.invalid}</strong><p>{t.errors}</p><ul>{state.error.map((e) => <li key={e}>{e}</li>)}</ul></div><button onClick={() => dispatch({type:'ERROR', payload:null})}>×</button></section>}
    {!state.package ? <section className="empty card"><div className="empty-radar"><span>⌁</span></div><h2>{t.noTender}</h2><p>{t.noTenderCopy}</p><button className="text-button" onClick={() => inputRef.current?.click()}>{t.import} <span>→</span></button></section> : <Workspace tender={state.package.tender} requirements={requirements} t={t} lang={state.lang} blocking={blocking} uploads={state.uploads} matches={state.matches} expiries={state.expiries} onAddUploads={addUploads} onRemoveUpload={(id) => dispatch({ type: 'REMOVE_UPLOAD', payload: id })} onMatch={(requirementId, uploadId) => dispatch({ type: 'MATCH_FILE', payload: { requirementId, uploadId } })} onExpiry={(requirementId, value) => dispatch({ type: 'SET_EXPIRY', payload: { requirementId, value } })} pdfInputRef={pdfInputRef} onPdfInput={handlePdfInput}/>} 
    <footer><span>{t.footer}</span><span>EN · BN · LOCAL FIRST</span></footer>
  </main>
}

function Workspace({ tender, requirements, t, lang, blocking, uploads, matches, expiries, onAddUploads, onRemoveUpload, onMatch, onExpiry, pdfInputRef, onPdfInput }) {
  const duplicateIds = getDuplicateIds(uploads)
  const statuses = requirements.map((item) => getStatus(item, uploads.find((file) => file.id === matches[item.id]), expiries[item.id], tender.submission_deadline))
  const statusCounts = statuses.reduce((counts, status) => ({ ...counts, [status]: (counts[status] ?? 0) + 1 }), {})
  const readyCount = statusCounts.ok ?? 0
  const blockingReasons = ['missing', 'dateNeeded', 'expired'].filter((status) => statusCounts[status])
  return <section className="workspace">
    <div className="tender-card card"><div className="section-kicker">01 / {t.tender}</div><div className="tender-heading"><span className="id-chip">{tender.tender_id}</span><h2>{tender.title}</h2></div><div className="facts"><Fact label={t.entity} value={tender.procuring_entity}/><Fact label={t.bidder} value={tender.bidder}/><Fact label={t.deadline} value={new Date(`${tender.submission_deadline}T00:00:00`).toLocaleDateString(lang === 'bn' ? 'bn-BD' : 'en-GB', { day:'2-digit', month:'short', year:'numeric' })}/></div></div>
    <aside className="readiness card"><div className="section-kicker">02 / {t.scan}</div><div className="readiness-number"><span>{blocking}</span><small>{t.clear}</small></div><div className="meter"><i style={{width: `${requirements.length ? (readyCount / requirements.length) * 100 : 0}%`}} /></div><p>{readyCount} / {requirements.length} {t.progress}</p><div className="blocking-reasons">{blockingReasons.length ? <><strong>{t.blockingReasons}</strong><ul>{blockingReasons.map((status) => <li key={status}><span className={`reason-dot ${status}`} />{t[status]}<b>{statusCounts[status]}</b></li>)}</ul></> : <p className="clear-state">{t.noBlockers}</p>}</div><button disabled={blocking > 0}>{t.generate} <span>→</span></button></aside>
    <section className="checklist card"><div className="checklist-top"><div><div className="section-kicker">03 / {t.checklist}</div><h2>{requirements.length} <span>{t.requirements}</span></h2></div><div className="legend"><span><i className="dot red" />{t.missing}</span><span><i className="dot amber" />{t.dateNeeded}</span><span><i className="dot dim" />{t.notProvided}</span><span><i className="dot cyan" />{t.ok}</span></div></div><p className="mapping-hint">⌁ {t.mapHint}</p><div className="table"><div className="row row-head"><span>{t.order}</span><span>{t.checklist}</span><span>{t.expiry}</span><span>{t.mapping}</span><span>STATUS</span></div>{requirements.map((item) => { const matchedId = matches[item.id]; const matchedUpload = uploads.find((file) => file.id === matchedId); const status = getStatus(item, matchedUpload, expiries[item.id], tender.submission_deadline); const choices = uploads.filter((file) => !file.error && !file.inspecting); return <div className="row" key={item.id}><span className="order">{String(item.order).padStart(2, '0')}</span><div className="doc"><strong>{lang === 'bn' ? item.title_bn : item.title_en}</strong><small>{item.id} · {item.mandatory ? t.mandatory : t.optional}</small></div><span className={item.has_expiry ? 'expiry yes' : 'expiry'}>{item.has_expiry && matchedUpload ? <input aria-label={`${t.enterExpiry} ${item.id}`} type="date" value={expiries[item.id] ?? ''} onChange={(event) => onExpiry(item.id, event.target.value)} /> : item.has_expiry ? `◷ ${t.expiry}` : `— ${t.noExpiry}`}</span><div className="match-control"><select aria-label={`${t.match} ${item.id}`} value={matchedId || ''} onChange={(event) => onMatch(item.id, event.target.value)}><option value="">{t.chooseFile}</option>{choices.map((file) => { const owner = Object.keys(matches).find((requirementId) => matches[requirementId] === file.id); const blockedDuplicate = Boolean(file.hash && duplicateIds.has(file.id) && owner && owner !== item.id); return <option disabled={blockedDuplicate} value={file.id} key={file.id}>{file.name}{owner && owner !== item.id ? ` — ${owner}` : ''}</option> })}</select>{matchedUpload && <button type="button" onClick={() => onMatch(item.id, '')}>{t.undo}</button>}</div><span className={`status ${status}`}>{t[status]}</span></div>})}</div></section>
    <UploadPanel uploads={uploads} matches={matches} requirements={requirements} duplicateIds={duplicateIds} t={t} onAddUploads={onAddUploads} onRemoveUpload={onRemoveUpload} inputRef={pdfInputRef} onInput={onPdfInput} />
    <section className="privacy"><span className="lock">⌑</span><div><strong>{t.local}</strong><p>{t.localCopy}</p></div><span className="privacy-line" /></section>
  </section>
}
function Fact({ label, value }) { return <div><small>{label}</small><strong>{value}</strong></div> }
function UploadPanel({ uploads, matches, requirements, duplicateIds, t, onAddUploads, onRemoveUpload, inputRef, onInput }) {
  const [dragging, setDragging] = useState(false)
  const valid = uploads.filter((file) => !file.error)
  const totalBytes = valid.reduce((sum, file) => sum + file.bytes, 0)
  return <section className="upload-panel card">
    <div className="upload-heading"><div><div className="section-kicker">04 / {t.upload}</div><h2>{t.queue}</h2></div><span>{valid.length} / {MAX_FILES} {t.files} · {formatBytes(totalBytes)} / 50 MB</span></div>
    <div className={`dropzone ${dragging ? 'is-dragging' : ''}`} onDragOver={(event) => { event.preventDefault(); setDragging(true) }} onDragLeave={() => setDragging(false)} onDrop={(event) => { event.preventDefault(); setDragging(false); onAddUploads(event.dataTransfer.files) }}>
      <span className="drop-mark">⇩</span><strong>{t.drop}</strong><small>{t.uploadHint}</small><button type="button" onClick={() => inputRef.current?.click()}>{t.browse}</button><input ref={inputRef} hidden type="file" accept="application/pdf,.pdf" multiple onChange={onInput}/>
    </div>
    <div className="upload-list">{uploads.length ? uploads.map((file) => { const requirement = requirements.find((item) => matches[item.id] === file.id); return <article className={`upload-item ${file.error ? 'has-error' : ''} ${requirement ? 'is-mapped' : ''}`} key={file.id}><div className="file-type">PDF</div><div className="file-meta"><strong>{file.name}{duplicateIds.has(file.id) && <mark>{t.duplicate}</mark>}</strong><small>{formatBytes(file.bytes)} · {file.inspecting ? t.processing : file.error ? t[file.error] : `${file.pages} ${t.pages}`}</small></div><div className="file-state">{file.error ? <span>{t.rejected}</span> : file.inspecting ? <i /> : <b>{file.pages}</b>}</div><div className={`mapping-state ${requirement ? 'mapped' : ''}`}>{requirement ? <><span>{t.mappedTo}</span><strong>{requirement.id}</strong></> : <span>{t.unmatched}</span>}</div><button type="button" aria-label={`${t.remove} ${file.name}`} onClick={() => onRemoveUpload(file.id)}>×</button></article> }) : <p className="queue-empty">{t.emptyQueue}</p>}</div>
  </section>
}
export default App
