import { notion, DATABASE_ID } from '../../lib/notion'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const {
      analyst,
      weekOf,
      weekNumber,
      deals,
      contacts,
      research,
      events,
      contentOutput,
      tasks,
      summary,
      blockers,
    } = req.body

    // Filter out empty items
    const cleanDeals = deals.filter(d => d.name?.trim())
    const cleanContacts = contacts.filter(c => c.name?.trim())
    const cleanResearch = research.filter(r => r.title?.trim())
    const cleanEvents = events.filter(e => e.name?.trim())
    const cleanContent = contentOutput.filter(c => c.title?.trim())
    const cleanTasks = tasks.filter(t => t.text?.trim())
    const tasksCompleted = cleanTasks.filter(t => t.done).length

    const weekLabel = weekNumber ? `Week ${weekNumber}` : ''
    const reportTitle = `${analyst} — ${weekLabel} (${weekOf})`

    await notion.pages.create({
      parent: { database_id: DATABASE_ID },
      properties: {
        'Report Title': {
          title: [{ text: { content: reportTitle } }],
        },
        'Analyst': {
          rich_text: [{ text: { content: analyst } }],
        },
        'Week Of': {
          date: { start: weekOf },
        },
        'Week Number': {
          number: parseInt(weekNumber) || 0,
        },
        'Status': {
          select: { name: 'Submitted' },
        },
        'Deals Sourced': {
          number: cleanDeals.length,
        },
        'Contacts Added': {
          number: cleanContacts.length,
        },
        'Research Topics': {
          number: cleanResearch.length,
        },
        'Tasks Completed': {
          number: tasksCompleted,
        },
        'Summary': {
          rich_text: [{ text: { content: summary || '' } }],
        },
        'Blockers': {
          rich_text: [{ text: { content: blockers || '' } }],
        },
      },
      children: buildPageContent({
        analyst, weekOf, weekNumber,
        deals: cleanDeals,
        contacts: cleanContacts,
        research: cleanResearch,
        events: cleanEvents,
        contentOutput: cleanContent,
        tasks: cleanTasks,
        summary,
        blockers,
      }),
    })

    return res.status(200).json({ success: true })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ error: err.message })
  }
}

function buildPageContent({ analyst, weekOf, weekNumber, deals, contacts, research, events, contentOutput, tasks, summary, blockers }) {
  const blocks = []

  const heading = (text, level = 2) => ({
    type: `heading_${level}`,
    [`heading_${level}`]: { rich_text: [{ type: 'text', text: { content: text } }] },
  })

  const para = (text) => ({
    type: 'paragraph',
    paragraph: { rich_text: [{ type: 'text', text: { content: text || '—' } }] },
  })

  const divider = () => ({ type: 'divider', divider: {} })

  const bullet = (text, bold = false) => ({
    type: 'bulleted_list_item',
    bulleted_list_item: {
      rich_text: [{ type: 'text', text: { content: text }, annotations: { bold } }],
    },
  })

  const todo = (text, checked = false) => ({
    type: 'to_do',
    to_do: {
      rich_text: [{ type: 'text', text: { content: text } }],
      checked,
    },
  })

  // Header
  blocks.push(para(`Analyst: ${analyst}  |  Week ${weekNumber || '—'}  |  ${weekOf}`))
  blocks.push(divider())

  // Sourcing — Deals
  blocks.push(heading('📊 Sourcing — Deals'))
  if (deals.length === 0) {
    blocks.push(para('No deals this week.'))
  } else {
    deals.forEach(d => {
      const meta = [d.stage, d.sector, d.source ? `via ${d.source}` : ''].filter(Boolean).join(' · ')
      blocks.push(bullet(`${d.name}${meta ? '  ·  ' + meta : ''}`, true))
      if (d.status) blocks.push(bullet(`Status: ${d.status}`))
      if (d.notes) blocks.push(bullet(`Notes: ${d.notes}`))
    })
  }
  blocks.push(divider())

  // Sourcing — Contacts
  blocks.push(heading('👤 Sourcing — Contacts'))
  if (contacts.length === 0) {
    blocks.push(para('No contacts this week.'))
  } else {
    contacts.forEach(c => {
      const meta = [c.role, c.type].filter(Boolean).join(' · ')
      blocks.push(bullet(`${c.name}${meta ? '  ·  ' + meta : ''}`, true))
      if (c.purpose) blocks.push(bullet(`Context: ${c.purpose}`))
    })
  }
  blocks.push(divider())

  // Research
  blocks.push(heading('🔬 Research'))
  if (research.length === 0) {
    blocks.push(para('No research this week.'))
  } else {
    research.forEach(r => {
      const meta = [r.sector, r.status].filter(Boolean).join(' · ')
      blocks.push(bullet(`${r.title}${meta ? '  ·  ' + meta : ''}`, true))
      if (r.output) blocks.push(bullet(`Output: ${r.output}`))
    })
  }
  blocks.push(divider())

  // Events
  blocks.push(heading('🎤 Events'))
  if (events.length === 0) {
    blocks.push(para('No events this week.'))
  } else {
    events.forEach(e => {
      blocks.push(bullet(`${e.name}${e.date ? '  ·  ' + e.date : ''}`, true))
      if (e.notes) blocks.push(bullet(`Notes: ${e.notes}`))
    })
  }
  blocks.push(divider())

  // Content Output
  blocks.push(heading('✍️ Content Output'))
  if (contentOutput.length === 0) {
    blocks.push(para('No content this week.'))
  } else {
    contentOutput.forEach(c => {
      blocks.push(bullet(`${c.title}${c.platform ? '  ·  ' + c.platform : ''}`, true))
      if (c.link) blocks.push(bullet(`Link: ${c.link}`))
    })
  }
  blocks.push(divider())

  // Tasks
  blocks.push(heading('✅ Tasks'))
  if (tasks.length === 0) {
    blocks.push(para('No tasks this week.'))
  } else {
    tasks.forEach(t => {
      blocks.push(todo(`[${t.priority || 'Med'}] ${t.text}`, t.done))
    })
  }
  blocks.push(divider())

  // Summary & Blockers
  blocks.push(heading('📝 Summary'))
  blocks.push(para(summary))
  if (blockers?.trim()) {
    blocks.push(heading('🚧 Blockers', 3))
    blocks.push(para(blockers))
  }

  return blocks
}
