import { useState } from 'react'
import Head from 'next/head'

const TAG_STYLES = {
  'New':        { bg: '#eef3fa', color: '#1e3a5f' },
  'In review':  { bg: '#fdf6e3', color: '#7a4f00' },
  'Pass':       { bg: '#fdf0f0', color: '#8b2e2e' },
  'Invested':   { bg: '#e8f0eb', color: '#1a3a2a' },
  'Follow-up':  { bg: '#f3f0fb', color: '#3d2e7a' },
  'New contact':{ bg: '#eef3fa', color: '#1e3a5f' },
  'Met':        { bg: '#e8f0eb', color: '#1a3a2a' },
  'Intro':      { bg: '#f3f0fb', color: '#3d2e7a' },
  'In touch':   { bg: '#fdf6e3', color: '#7a4f00' },
  'Done':       { bg: '#e8f0eb', color: '#1a3a2a' },
  'In progress':{ bg: '#fdf6e3', color: '#7a4f00' },
  'Planned':    { bg: '#eef3fa', color: '#1e3a5f' },
  'Published':  { bg: '#e8f0eb', color: '#1a3a2a' },
  'Draft':      { bg: '#fdf6e3', color: '#7a4f00' },
  'LinkedIn':   { bg: '#eef3fa', color: '#1e3a5f' },
  'Twitter/X':  { bg: '#f3f0fb', color: '#3d2e7a' },
  '小红书':     { bg: '#fdf0f0', color: '#8b2e2e' },
  'Newsletter': { bg: '#fdf6e3', color: '#7a4f00' },
  'Other':      { bg: '#f2f0ec', color: '#3d3b38' },
  'High':       { bg: '#fdf0f0', color: '#8b2e2e' },
  'Med':        { bg: '#fdf6e3', color: '#7a4f00' },
  'Low':        { bg: '#f2f0ec', color: '#3d3b38' },
}

function Tag({ label }) {
  const s = TAG_STYLES[label] || { bg: '#f2f0ec', color: '#3d3b38' }
  return (
    <span style={{
      background: s.bg, color: s.color,
      fontSize: '11px', padding: '2px 9px', borderRadius: '20px',
      fontWeight: 500, whiteSpace: 'nowrap', flexShrink: 0,
    }}>{label}</span>
  )
}

function Section({ icon, title, count, children }) {
  return (
    <div style={{ marginBottom: '2rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px', paddingBottom: '10px', borderBottom: '0.5px solid #e8e5df' }}>
        <span style={{ fontSize: '16px' }}>{icon}</span>
        <span style={{ fontFamily: 'DM Serif Display, serif', fontSize: '16px', color: '#0f0e0d' }}>{title}</span>
        {count !== undefined && (
          <span style={{ marginLeft: 'auto', fontSize: '11px', color: '#7a7670', background: '#f2f0ec', borderRadius: '20px', padding: '2px 9px' }}>
            {count} {count === 1 ? 'item' : 'items'}
          </span>
        )}
      </div>
      {children}
    </div>
  )
}

function Card({ children, style = {} }) {
  return (
    <div style={{
      background: '#fff', border: '0.5px solid #e8e5df', borderRadius: '10px',
      padding: '12px 14px', marginBottom: '8px', ...style
    }}>
      {children}
    </div>
  )
}

function Input({ label, value, onChange, placeholder = '', type = 'text', multiline = false, style = {} }) {
  const base = {
    width: '100%', fontSize: '13px', color: '#0f0e0d',
    background: '#faf9f7', border: '0.5px solid #ddd9d2',
    borderRadius: '6px', padding: '6px 10px',
    fontFamily: 'DM Sans, sans-serif', outline: 'none',
    resize: 'vertical', ...style,
  }
  return (
    <div style={{ marginBottom: '8px' }}>
      {label && <div style={{ fontSize: '11px', color: '#7a7670', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>{label}</div>}
      {multiline
        ? <textarea value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} style={{ ...base, minHeight: '60px' }} />
        : <input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} style={{ ...base, height: '32px' }} />
      }
    </div>
  )
}

function SelectInput({ label, value, onChange, options }) {
  return (
    <div style={{ marginBottom: '8px' }}>
      {label && <div style={{ fontSize: '11px', color: '#7a7670', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>{label}</div>}
      <select value={value} onChange={e => onChange(e.target.value)} style={{
        width: '100%', fontSize: '13px', color: '#0f0e0d', background: '#faf9f7',
        border: '0.5px solid #ddd9d2', borderRadius: '6px', padding: '6px 10px',
        fontFamily: 'DM Sans, sans-serif', height: '32px', outline: 'none',
      }}>
        {options.map(o => <option key={o}>{o}</option>)}
      </select>
    </div>
  )
}

function AddButton({ onClick, label }) {
  return (
    <button onClick={onClick} style={{
      width: '100%', background: 'none', border: '0.5px dashed #c8c4bd',
      borderRadius: '8px', padding: '7px', fontSize: '12px', color: '#7a7670',
      cursor: 'pointer', fontFamily: 'DM Sans, sans-serif', marginTop: '4px',
    }}>{label}</button>
  )
}

function RemoveButton({ onClick }) {
  return (
    <button onClick={onClick} style={{
      background: 'none', border: 'none', color: '#b8b4ad', cursor: 'pointer',
      fontSize: '16px', padding: '0 4px', lineHeight: 1, flexShrink: 0,
    }}>×</button>
  )
}

const emptyDeal = () => ({ name: '', sector: '', stage: '', source: '', status: 'New', notes: '' })
const emptyContact = () => ({ name: '', role: '', type: 'New contact', purpose: '' })
const emptyResearch = () => ({ title: '', sector: '', status: 'In progress', output: '' })
const emptyEvent = () => ({ name: '', date: '', notes: '' })
const emptyContent = () => ({ title: '', platform: 'LinkedIn', link: '' })
const emptyTask = () => ({ text: '', priority: 'Med', done: false })

function MetricCard({ label, value }) {
  return (
    <div style={{ background: '#f2f0ec', borderRadius: '8px', padding: '10px 12px', textAlign: 'center' }}>
      <div style={{ fontSize: '22px', fontWeight: 500, fontFamily: 'DM Serif Display, serif' }}>{value}</div>
      <div style={{ fontSize: '11px', color: '#7a7670', marginTop: '2px' }}>{label}</div>
    </div>
  )
}

export default function WeeklyReport() {
  const [analyst, setAnalyst] = useState('')
  const [weekOf, setWeekOf] = useState('')
  const [weekNumber, setWeekNumber] = useState('')
  const [deals, setDeals] = useState([emptyDeal()])
  const [contacts, setContacts] = useState([emptyContact()])
  const [research, setResearch] = useState([emptyResearch()])
  const [events, setEvents] = useState([emptyEvent()])
  const [contentOutput, setContentOutput] = useState([emptyContent()])
  const [tasks, setTasks] = useState([emptyTask()])
  const [summary, setSummary] = useState('')
  const [blockers, setBlockers] = useState('')
  const [status, setStatus] = useState('idle') // idle | loading | success | error
  const [errorMsg, setErrorMsg] = useState('')

  const update = (setter, index, field, value) => {
    setter(prev => prev.map((item, i) => i === index ? { ...item, [field]: value } : item))
  }
  const add = (setter, empty) => setter(prev => [...prev, empty()])
  const remove = (setter, index) => setter(prev => prev.filter((_, i) => i !== index))

  const tasksCompleted = tasks.filter(t => t.done).length

  const handleSubmit = async () => {
    if (!analyst || !weekOf) {
      setErrorMsg('Please fill in Analyst name and Week Of date.')
      return
    }
    setStatus('loading')
    setErrorMsg('')
    try {
      const res = await fetch('/api/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ analyst, weekOf, weekNumber, deals, contacts, research, events, contentOutput, tasks, summary, blockers }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Submission failed')
      setStatus('success')
    } catch (err) {
      setErrorMsg(err.message)
      setStatus('error')
    }
  }

  if (status === 'success') {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '16px' }}>
        <div style={{ fontSize: '48px' }}>✓</div>
        <h2 style={{ fontFamily: 'DM Serif Display, serif', fontWeight: 400, fontSize: '24px' }}>Report submitted</h2>
        <p style={{ color: '#7a7670', fontSize: '14px' }}>Your weekly report has been saved to Notion.</p>
        <button onClick={() => { setStatus('idle') }} style={{
          marginTop: '8px', background: '#1a3a2a', color: '#fff', border: 'none',
          borderRadius: '8px', padding: '9px 20px', fontSize: '13px', cursor: 'pointer',
          fontFamily: 'DM Sans, sans-serif',
        }}>Submit another</button>
      </div>
    )
  }

  return (
    <>
      <Head>
        <title>Weekly Report — Impa Ventures</title>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=DM+Serif+Display&family=DM+Sans:wght@300;400;500&display=swap" rel="stylesheet" />
      </Head>

      <div style={{ maxWidth: '680px', margin: '0 auto', padding: '48px 24px 80px' }}>

        {/* Header */}
        <div style={{ marginBottom: '36px' }}>
          <div style={{ fontSize: '12px', color: '#7a7670', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '8px' }}>Impa Ventures</div>
          <h1 style={{ fontSize: '32px', fontFamily: 'DM Serif Display, serif', fontWeight: 400, color: '#0f0e0d', marginBottom: '20px' }}>Weekly Report</h1>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 80px', gap: '12px' }}>
            <Input label="Analyst" value={analyst} onChange={setAnalyst} placeholder="Your name" />
            <Input label="Week of" value={weekOf} onChange={setWeekOf} type="date" />
            <Input label="Week #" value={weekNumber} onChange={setWeekNumber} placeholder="19" />
          </div>
        </div>

        {/* Metrics summary */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px', marginBottom: '32px' }}>
          <MetricCard label="deals" value={deals.filter(d => d.name).length} />
          <MetricCard label="contacts" value={contacts.filter(c => c.name).length} />
          <MetricCard label="research" value={research.filter(r => r.title).length} />
          <MetricCard label="tasks done" value={`${tasksCompleted}/${tasks.length}`} />
        </div>

        <div style={{ height: '0.5px', background: '#e8e5df', marginBottom: '32px' }} />

        {/* Sourcing — Deals */}
        <Section icon="◈" title="Sourcing — Deals" count={deals.filter(d => d.name).length}>
          {deals.map((d, i) => (
            <Card key={i}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px' }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 100px', gap: '8px' }}>
                    <Input label="Company" value={d.name} onChange={v => update(setDeals, i, 'name', v)} placeholder="Aether Labs" />
                    <SelectInput label="Stage" value={d.stage} onChange={v => update(setDeals, i, 'stage', v)} options={['Pre-seed', 'Seed', 'Series A', 'Series B+']} />
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                    <Input label="Sector" value={d.sector} onChange={v => update(setDeals, i, 'sector', v)} placeholder="AI infra" />
                    <Input label="Source / via" value={d.source} onChange={v => update(setDeals, i, 'source', v)} placeholder="a16z intro" />
                  </div>
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-end' }}>
                    <div style={{ flex: 1 }}>
                      <Input label="Notes" value={d.notes} onChange={v => update(setDeals, i, 'notes', v)} placeholder="Key observations, next steps..." multiline />
                    </div>
                    <div style={{ marginBottom: '8px' }}>
                      <SelectInput label="Status" value={d.status} onChange={v => update(setDeals, i, 'status', v)} options={['New', 'In review', 'Pass', 'Invested', 'Follow-up']} />
                    </div>
                  </div>
                </div>
                <RemoveButton onClick={() => remove(setDeals, i)} />
              </div>
            </Card>
          ))}
          <AddButton onClick={() => add(setDeals, emptyDeal)} label="+ Add deal" />
        </Section>

        {/* Sourcing — Contacts */}
        <Section icon="◇" title="Sourcing — Contacts" count={contacts.filter(c => c.name).length}>
          {contacts.map((c, i) => (
            <Card key={i}>
              <div style={{ display: 'flex', gap: '8px' }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                    <Input label="Name" value={c.name} onChange={v => update(setContacts, i, 'name', v)} placeholder="James Kim" />
                    <Input label="Role / Firm" value={c.role} onChange={v => update(setContacts, i, 'role', v)} placeholder="Partner, Sequoia" />
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '130px 1fr', gap: '8px' }}>
                    <SelectInput label="Type" value={c.type} onChange={v => update(setContacts, i, 'type', v)} options={['New contact', 'Met', 'Intro', 'In touch', 'Follow-up']} />
                    <Input label="Purpose / context" value={c.purpose} onChange={v => update(setContacts, i, 'purpose', v)} placeholder="Potential co-invest, deal flow..." />
                  </div>
                </div>
                <RemoveButton onClick={() => remove(setContacts, i)} />
              </div>
            </Card>
          ))}
          <AddButton onClick={() => add(setContacts, emptyContact)} label="+ Add contact" />
        </Section>

        {/* Research */}
        <Section icon="▲" title="Research" count={research.filter(r => r.title).length}>
          {research.map((r, i) => (
            <Card key={i}>
              <div style={{ display: 'flex', gap: '8px' }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 120px', gap: '8px' }}>
                    <Input label="Topic / Title" value={r.title} onChange={v => update(setResearch, i, 'title', v)} placeholder="Embodied AI data landscape" />
                    <SelectInput label="Status" value={r.status} onChange={v => update(setResearch, i, 'status', v)} options={['In progress', 'Done', 'Planned']} />
                  </div>
                  <Input label="Sector / linked thesis" value={r.sector} onChange={v => update(setResearch, i, 'sector', v)} placeholder="Robotics / Proof of Data" />
                  <Input label="Output / key finding" value={r.output} onChange={v => update(setResearch, i, 'output', v)} placeholder="Memo shared with partners..." multiline />
                </div>
                <RemoveButton onClick={() => remove(setResearch, i)} />
              </div>
            </Card>
          ))}
          <AddButton onClick={() => add(setResearch, emptyResearch)} label="+ Add research topic" />
        </Section>

        {/* Events */}
        <Section icon="🎤" title="Events attended" count={events.filter(e => e.name).length}>
          {events.map((e, i) => (
            <Card key={i}>
              <div style={{ display: 'flex', gap: '8px' }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 140px', gap: '8px' }}>
                    <Input label="Event name" value={e.name} onChange={v => update(setEvents, i, 'name', v)} placeholder="SF AI Summit" />
                    <Input label="Date" value={e.date} onChange={v => update(setEvents, i, 'date', v)} type="date" />
                  </div>
                  <Input label="Key takeaways / contacts made" value={e.notes} onChange={v => update(setEvents, i, 'notes', v)} placeholder="Met 3 founders, key themes were..." multiline />
                </div>
                <RemoveButton onClick={() => remove(setEvents, i)} />
              </div>
            </Card>
          ))}
          <AddButton onClick={() => add(setEvents, emptyEvent)} label="+ Add event" />
        </Section>

        {/* Content Output */}
        <Section icon="✍️" title="Content output" count={contentOutput.filter(c => c.title).length}>
          {contentOutput.map((c, i) => (
            <Card key={i}>
              <div style={{ display: 'flex', gap: '8px' }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 120px', gap: '8px' }}>
                    <Input label="Title / topic" value={c.title} onChange={v => update(setContentOutput, i, 'title', v)} placeholder="Why embodied AI needs ego-view data" />
                    <SelectInput label="Platform" value={c.platform} onChange={v => update(setContentOutput, i, 'platform', v)} options={['LinkedIn', 'Twitter/X', '小红书', 'Newsletter', 'Other']} />
                  </div>
                  <Input label="Link (optional)" value={c.link} onChange={v => update(setContentOutput, i, 'link', v)} placeholder="https://..." />
                </div>
                <RemoveButton onClick={() => remove(setContentOutput, i)} />
              </div>
            </Card>
          ))}
          <AddButton onClick={() => add(setContentOutput, emptyContent)} label="+ Add content" />
        </Section>

        {/* Tasks */}
        <Section icon="✦" title="Other tasks" count={tasks.length}>
          {tasks.map((t, i) => (
            <Card key={i} style={{ padding: '10px 14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <input
                  type="checkbox"
                  checked={t.done}
                  onChange={e => update(setTasks, i, 'done', e.target.checked)}
                  style={{ width: '16px', height: '16px', accentColor: '#1a3a2a', cursor: 'pointer', flexShrink: 0 }}
                />
                <input
                  type="text"
                  value={t.text}
                  onChange={e => update(setTasks, i, 'text', e.target.value)}
                  placeholder="Task description..."
                  style={{
                    flex: 1, border: 'none', background: 'none', fontSize: '13px',
                    fontFamily: 'DM Sans, sans-serif', color: t.done ? '#b8b4ad' : '#0f0e0d',
                    textDecoration: t.done ? 'line-through' : 'none', outline: 'none',
                  }}
                />
                <select
                  value={t.priority}
                  onChange={e => update(setTasks, i, 'priority', e.target.value)}
                  style={{
                    fontSize: '11px', border: '0.5px solid #e8e5df', borderRadius: '20px',
                    padding: '2px 8px', background: '#f2f0ec', color: '#3d3b38',
                    fontFamily: 'DM Sans, sans-serif', cursor: 'pointer', outline: 'none',
                  }}
                >
                  <option>High</option>
                  <option>Med</option>
                  <option>Low</option>
                </select>
                <RemoveButton onClick={() => remove(setTasks, i)} />
              </div>
            </Card>
          ))}
          <AddButton onClick={() => add(setTasks, emptyTask)} label="+ Add task" />
        </Section>

        {/* Summary & Blockers */}
        <Section icon="▾" title="Summary & blockers">
          <Input label="Weekly summary" value={summary} onChange={setSummary} multiline
            placeholder="Key highlights this week, what moved forward, what's next..." style={{ minHeight: '80px' }} />
          <Input label="Blockers" value={blockers} onChange={setBlockers} multiline
            placeholder="What's slowing you down? What do you need?" style={{ minHeight: '60px' }} />
        </Section>

        {/* Submit */}
        {errorMsg && (
          <div style={{ background: '#fdf0f0', border: '0.5px solid #e8c0c0', borderRadius: '8px', padding: '10px 14px', fontSize: '13px', color: '#8b2e2e', marginBottom: '16px' }}>
            {errorMsg}
          </div>
        )}

        <button
          onClick={handleSubmit}
          disabled={status === 'loading'}
          style={{
            width: '100%', background: status === 'loading' ? '#7a7670' : '#1a3a2a',
            color: '#fff', border: 'none', borderRadius: '10px', padding: '14px',
            fontSize: '14px', fontWeight: 500, cursor: status === 'loading' ? 'default' : 'pointer',
            fontFamily: 'DM Sans, sans-serif', letterSpacing: '0.02em', transition: 'background 0.2s',
          }}
        >
          {status === 'loading' ? 'Submitting to Notion...' : 'Submit weekly report →'}
        </button>

        <p style={{ textAlign: 'center', fontSize: '12px', color: '#b8b4ad', marginTop: '16px' }}>
          Report will be saved to Notion · Impa Ventures
        </p>

      </div>
    </>
  )
}
