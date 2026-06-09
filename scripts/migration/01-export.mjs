#!/usr/bin/env node
// Exports all entries + assets from the HELOC360 Contentful space.
// Writes to scripts/migration/_archive/{contentful-export.json, assets/}.
// Reads env from .env.local via dotenv-style parsing (no dotenv dep).

import { readFileSync, mkdirSync, existsSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import contentfulExport from 'contentful-export'

const __dirname = dirname(fileURLToPath(import.meta.url))
const repoRoot = resolve(__dirname, '..', '..')
const archiveDir = resolve(__dirname, '_archive')

function loadEnvLocal() {
  const envPath = resolve(repoRoot, '.env.local')
  if (!existsSync(envPath)) return
  const lines = readFileSync(envPath, 'utf8').split('\n')
  for (const line of lines) {
    const m = line.match(/^([A-Z0-9_]+)=(.*)$/)
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2].trim()
  }
}

loadEnvLocal()

const required = ['CONTENTFUL_MANAGEMENT_TOKEN', 'CONTENTFUL_EXPORT_SPACE_ID']
for (const key of required) {
  if (!process.env[key]) {
    console.error(`Missing env var: ${key}. Set it in .env.local.`)
    process.exit(1)
  }
}

mkdirSync(archiveDir, { recursive: true })

await contentfulExport({
  spaceId: process.env.CONTENTFUL_EXPORT_SPACE_ID,
  environmentId: process.env.CONTENTFUL_EXPORT_ENVIRONMENT || 'master',
  managementToken: process.env.CONTENTFUL_MANAGEMENT_TOKEN,
  exportDir: archiveDir,
  contentFile: 'contentful-export.json',
  downloadAssets: true,
  saveFile: true,
  errorLogFile: resolve(archiveDir, 'export-errors.log'),
  // Only blog posts + team members, not editor users or webhooks.
  skipContentModel: false,
  skipContent: false,
  skipRoles: true,
  skipWebhooks: true,
  skipEditorInterfaces: true,
})

console.log(`\nExport complete. Files in ${archiveDir}/`)
