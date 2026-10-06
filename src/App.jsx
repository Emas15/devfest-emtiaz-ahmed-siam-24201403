import { useReducer, useRef } from 'react'

const copy = {
  en: {
    eyebrow: 'Tender package command center', title: 'Make every submission', accent: 'submission-ready.',
    subtitle: 'Import tender requirements, trace every document, and build a verified package — entirely in your browser.',
    import: 'Import requirements.json', language: 'বাংলা',
    importHint: 'JSON stays on this device. Nothing is uploaded.', noTender: 'Awaiting tender brief', noTenderCopy: 'Start by importing the tender requirements file to unlock the package checklist.',
    tender: 'Tender intelligence', entity: 'Procuring entity', bidder: 'Bidder', deadline: 'Submission deadline',
    checklist: 'Document checklist', requirements: 'requirements', order: 'Order', mandatory: 'Mandatory', optional: 'Optional', expiry: 'Expiry check', noExpiry: 'No expiry',
    missing: 'Missing', notProvided: 'Not provided', dateNeeded: 'Expiry date needed', expired: 'Expired', ready: 'Ready',
    scan: 'Package readiness', clear: 'blocking items', readyText: 'Ready to assemble', progress: 'requirements ready', next: 'Next: upload source PDFs',
    invalid: 'Could not import this file', errors: 'Review the JSON schema and try again.', local: 'Local-only workspace', localCopy: 'Tender data is processed in this browser only.',
    footer: 'TenderPulse / precision in every page'
  },
  bn: {
    eyebrow: 'টেন্ডার প্যাকেজ কমান্ড সেন্টার', title: 'প্রতিটি জমা দিন', accent: 'নির্ভুলভাবে।',
    subtitle: 'টেন্ডারের শর্ত আমদানি করুন, প্রতিটি নথি ট্র্যাক করুন এবং যাচাইকৃত প্যাকেজ তৈরি করুন — সম্পূর্ণ আপনার ব্রাউজারে।',
    import: 'requirements.json আমদানি করুন', language: 'English',
    importHint: 'JSON আপনার ডিভাইসেই থাকে। কিছুই আপলোড করা হয় না।', noTender: 'টেন্ডার ব্রিফের অপেক্ষায়', noTenderCopy: 'প্যাকেজ চেকলিস্ট চালু করতে টেন্ডারের requirements ফাইল আমদানি করুন।',
    tender: 'টেন্ডার তথ্য', entity: 'ক্রয়কারী সংস্থা', bidder: 'দরদাতা', deadline: 'জমার শেষ তারিখ',
    checklist: 'নথির চেকলিস্ট', requirements: 'টি শর্ত', order: 'ক্রম', mandatory: 'আবশ্যিক', optional: 'ঐচ্ছিক', expiry: 'মেয়াদ পরীক্ষা', noExpiry: 'মেয়াদ নেই',
    missing: 'অনুপস্থিত', notProvided: 'প্রদান করা হয়নি', dateNeeded: 'মেয়াদ তারিখ প্রয়োজন', expired: 'মেয়াদ শেষ', ready: 'প্রস্তুত',
    scan: 'প্যাকেজ প্রস্তুতি', clear: 'টি বাধা', readyText: 'সংযোজনের জন্য প্রস্তুত', progress: 'টি শর্ত প্রস্তুত', next: 'পরবর্তী: উৎস PDF আপলোড করুন',
    invalid: 'এই ফাইলটি আমদানি করা যায়নি', errors: 'JSON কাঠামো দেখে আবার চেষ্টা করুন।', local: 'শুধু স্থানীয় ওয়ার্কস্পেস', localCopy: 'টেন্ডারের তথ্য কেবল এই ব্রাউজারেই প্রক্রিয়াকৃত হয়।',
    footer: 'TenderPulse / প্রতিটি পাতায় নির্ভুলতা'
  }
}

const initialState = { lang: 'en', package: null, error: null }

function reducer(state, action) {
  switch (action.type) {
    case 'TOGGLE_LANG': return { ...state, lang: state.lang === 'en' ? 'bn' : 'en' }
    case 'LOAD': return { ...state, package: action.payload, error: null }
    case 'ERROR': return { ...state, error: action.payload }
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

function getStatus(requirement) { return requirement.mandatory ? 'missing' : 'notProvided' }

function App() {
  const [state, dispatch] = useReducer(reducer, initialState)
  const inputRef = useRef(null)
  const t = copy[state.lang]
  const requirements = state.package?.requirements ?? []
  const blocking = requirements.filter((item) => item.mandatory).length
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
    {!state.package ? <section className="empty card"><div className="empty-radar"><span>⌁</span></div><h2>{t.noTender}</h2><p>{t.noTenderCopy}</p><button className="text-button" onClick={() => inputRef.current?.click()}>{t.import} <span>→</span></button></section> : <Workspace tender={state.package.tender} requirements={requirements} t={t} lang={state.lang} blocking={blocking}/>} 
    <footer><span>{t.footer}</span><span>EN · BN · LOCAL FIRST</span></footer>
  </main>
}

function Workspace({ tender, requirements, t, lang, blocking }) {
  return <section className="workspace">
    <div className="tender-card card"><div className="section-kicker">01 / {t.tender}</div><div className="tender-heading"><span className="id-chip">{tender.tender_id}</span><h2>{tender.title}</h2></div><div className="facts"><Fact label={t.entity} value={tender.procuring_entity}/><Fact label={t.bidder} value={tender.bidder}/><Fact label={t.deadline} value={new Date(`${tender.submission_deadline}T00:00:00`).toLocaleDateString(lang === 'bn' ? 'bn-BD' : 'en-GB', { day:'2-digit', month:'short', year:'numeric' })}/></div></div>
    <aside className="readiness card"><div className="section-kicker">02 / {t.scan}</div><div className="readiness-number"><span>{blocking}</span><small>{t.clear}</small></div><div className="meter"><i style={{width: '0%'}} /></div><p>0 / {requirements.length} {t.progress}</p><button disabled>{t.next} <span>→</span></button></aside>
    <section className="checklist card"><div className="checklist-top"><div><div className="section-kicker">03 / {t.checklist}</div><h2>{requirements.length} <span>{t.requirements}</span></h2></div><div className="legend"><span><i className="dot red" />{t.missing}</span><span><i className="dot dim" />{t.notProvided}</span></div></div><div className="table"><div className="row row-head"><span>{t.order}</span><span>{t.checklist}</span><span>{t.expiry}</span><span>STATUS</span></div>{requirements.map((item) => { const status = getStatus(item); return <div className="row" key={item.id}><span className="order">{String(item.order).padStart(2, '0')}</span><div className="doc"><strong>{lang === 'bn' ? item.title_bn : item.title_en}</strong><small>{item.id} · {item.mandatory ? t.mandatory : t.optional}</small></div><span className={item.has_expiry ? 'expiry yes' : 'expiry'}>{item.has_expiry ? `◷ ${t.expiry}` : `— ${t.noExpiry}`}</span><span className={`status ${status}`}>{status === 'missing' ? t.missing : t.notProvided}</span></div>})}</div></section>
    <section className="privacy"><span className="lock">⌑</span><div><strong>{t.local}</strong><p>{t.localCopy}</p></div><span className="privacy-line" /></section>
  </section>
}
function Fact({ label, value }) { return <div><small>{label}</small><strong>{value}</strong></div> }
export default App
