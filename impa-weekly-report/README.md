# Impa Ventures — Analyst Weekly Report

A Next.js web app for analysts to submit weekly reports directly to Notion.

## Setup

### 1. Clone and install

```bash
git clone <your-repo>
cd weekly-report
npm install
```

### 2. Create a Notion integration

1. Go to https://www.notion.so/my-integrations
2. Click **New integration**
3. Name it "Weekly Report" — select your workspace
4. Copy the **Internal Integration Token** (starts with `secret_`)

### 3. Connect integration to the database

1. Open the **Analyst Weekly Reports** database in Notion
   (it's inside "Impa Ventures — 基金建设工作记录")
2. Click **···** (top right) → **Connections** → Add your integration

### 4. Configure environment variables

Copy `.env.example` to `.env.local`:

```bash
cp .env.example .env.local
```

Fill in:
```
NOTION_TOKEN=secret_xxxxxxxxxxxxxxxxxxxx       # from step 2
NOTION_DATABASE_ID=866952ab6442436191d6560016aa2d53  # already set
```

### 5. Run locally

```bash
npm run dev
```

Open http://localhost:3000

---

## Deploy to Vercel (free, ~5 minutes)

1. Push this repo to GitHub
2. Go to https://vercel.com → **New Project** → import the repo
3. In **Environment Variables**, add:
   - `NOTION_TOKEN` = your secret token
   - `NOTION_DATABASE_ID` = `866952ab6442436191d6560016aa2d53`
4. Click **Deploy**
5. Share the Vercel URL with your analysts

---

## How it works

```
Analyst fills form → clicks Submit
         ↓
/api/submit (Next.js API route)
         ↓
Notion API → creates page in "Analyst Weekly Reports" database
         ↓
Page appears in Notion with full structured content
```

Each submitted report creates:
- A **database row** with all metrics and structured data (queryable, filterable)
- A **formatted page** with readable content blocks (headings, bullets, checkboxes)

## Database fields

| Field | Type | Description |
|-------|------|-------------|
| Report Title | Title | Auto-generated: "Name — Week N (date)" |
| Analyst | Text | Analyst name |
| Week Of | Date | Week start date |
| Status | Select | Draft / Submitted / Reviewed |
| Deals Sourced | Number | Count of deals |
| Contacts Added | Number | Count of contacts |
| Research Topics | Number | Count of research items |
| Tasks Completed | Number | Count of completed tasks |
| Sourcing Deals | Text | JSON (all deal details) |
| Sourcing Contacts | Text | JSON (all contact details) |
| Research | Text | JSON (all research details) |
| Events | Text | JSON (all events) |
| Content Output | Text | JSON (all content pieces) |
| Tasks | Text | JSON (all tasks with status) |
| Summary | Text | Weekly narrative |
| Blockers | Text | Blockers text |
