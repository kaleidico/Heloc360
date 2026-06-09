#!/usr/bin/env node
// Uploads every asset in _archive/assets/ to Sanity.
// Writes _archive/asset-map.json: { [contentfulAssetId]: { _id, url } }.
// Idempotent: re-running skips assets already in the map.

import { readFileSync, existsSync, writeFileSync, mkdirSync, createReadStream } from 'node:fs'
import { resolve, dirname, basename, extname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { createClient } from '@sanity/client'

const __dirname = dirname(fileURLToPath(import.meta.url))
const repoRoot = resolve(__dirname, '..', '..')
const archiveDir = resolve(__dirname, '_archive')
const assetMapPath = resolve(archiveDir, 'asset-map.json')

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

const required = ['NEXT_PUBLIC_SANITY_PROJECT_ID', 'NEXT_PUBLIC_SANITY_DATASET', 'SANITY_API_WRITE_TOKEN']
for (const key of required) {
  if (!process.env[key]) {
    console.error(`Missing env var: ${key}. Set it in .env.local.`)
    process.exit(1)
  }
}

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: process.env.SANITY_API_VERSION || '2024-12-01',
  token: process.env.SANITY_API_WRITE_TOKEN,
  useCdn: false,
})

const exportPath = resolve(archiveDir, 'contentful-export.json')
if (!existsSync(exportPath)) {
  console.error(`Missing ${exportPath}. Run 01-export.mjs first.`)
  process.exit(1)
}

const exportData = JSON.parse(readFileSync(exportPath, 'utf8'))
const assets = exportData.assets || []
console.log(`Found ${assets.length} assets to upload.`)

const existingMap = existsSync(assetMapPath) ? JSON.parse(readFileSync(assetMapPath, 'utf8')) : {}

for (const asset of assets) {
  const contentfulId = asset.sys.id
  if (existingMap[contentfulId]) {
    console.log(`SKIP ${contentfulId} (already uploaded as ${existingMap[contentfulId]._id})`)
    continue
  }

  // contentful-export writes assets under _archive/assets/{spaceId}/{envId}/{assetId}/{filename}.
  // The exported asset's fields.file.url has the original CDN path; we need the local download.
  const file = asset.fields?.file?.['en-US'] || Object.values(asset.fields?.file || {})[0]
  if (!file?.url) {
    console.warn(`SKIP ${contentfulId} (no file url)`)
    continue
  }

  // contentful-export downloads to <archiveDir>/images.ctfassets.net/<space>/<asset>/<rev>/<filename>
  // We can read it from the path constructed off the url.
  const urlPath = file.url.replace(/^\/\//, 'https://').replace(/^https?:\/\//, '')
  const localPath = resolve(archiveDir, urlPath)
  if (!existsSync(localPath)) {
    console.warn(`SKIP ${contentfulId} (local file missing at ${localPath})`)
    continue
  }

  const filename = basename(localPath)
  const contentType = file.contentType || 'application/octet-stream'
  const stream = createReadStream(localPath)

  const isImage = contentType.startsWith('image/')
  console.log(`UPLOAD ${contentfulId} (${filename}, ${contentType})`)
  const uploaded = await client.assets.upload(isImage ? 'image' : 'file', stream, {
    filename,
    contentType,
  })

  existingMap[contentfulId] = { _id: uploaded._id, url: uploaded.url }
  // Persist after every upload so a crash mid-run doesn't lose progress.
  mkdirSync(archiveDir, { recursive: true })
  writeFileSync(assetMapPath, JSON.stringify(existingMap, null, 2))
}

console.log(`\nAsset upload complete. Map written to ${assetMapPath}`)
console.log(`Total mapped: ${Object.keys(existingMap).length}`)
