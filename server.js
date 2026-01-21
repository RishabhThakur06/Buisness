// server.js — simple local JSON-backed API for the showroom demo
// Usage: `node server.js` (install dependencies: express, cors, nodemailer)
const express = require('express')
const fs = require('fs')
const path = require('path')
const cors = require('cors')
const nodemailer = require('nodemailer')
const crypto = require('crypto')

const app = express()
app.use(express.json())
app.use(cors())

// Simple in-memory session store (for production, use Redis or a database)
const sessions = new Map()

// Default admin credentials (in production, use environment variables and hashed passwords)
const ADMIN_CREDENTIALS = {
  username: process.env.ADMIN_USERNAME || 'admin',
  password: process.env.ADMIN_PASSWORD || 'admin123'
}

// Authentication middleware
function requireAuth(req, res, next) {
  const token = req.headers.authorization?.replace('Bearer ', '') || req.body.token || req.query.token
  
  if (!token || !sessions.has(token)) {
    return res.status(401).json({ error: 'Unauthorized', message: 'Please log in to access this resource' })
  }
  
  req.user = sessions.get(token)
  next()
}

const DATA_DIR = path.join(__dirname, 'data')
const DATA_FILE = path.join(DATA_DIR, 'inventory.json')
const LEADS_FILE = path.join(DATA_DIR, 'leads.json')

const SAMPLE = [
  { id: 'v1', year: 2023, make: 'Mercedes-Benz', model: 'S-Class S 580', mileage: 5800, transmission: 'Automatic 9G-TRONIC', fuel: 'Petrol', price: 124900, image: '/assets/car1.jpg', featured: true, color: 'Obsidian Black', features: ['Night Package', 'Air Balance', 'Rear Executive Seats', 'Burmester 4D Sound'] },
  { id: 'v2', year: 2023, make: 'Porsche', model: '911 Turbo S', mileage: 3200, transmission: 'PDK', fuel: 'Petrol', price: 229800, image: '/assets/car2.jpg', featured: true, color: 'Guards Red', features: ['Sport Chrono', 'PASM', 'PCCB', 'Bose Surround Sound'] },
  { id: 'v3', year: 2023, make: 'BMW', model: 'i7 xDrive60', mileage: 4500, transmission: 'Automatic', fuel: 'Electric', price: 119300, image: '/assets/car3.jpg', featured: true, color: 'Mineral White', features: ['Sky Lounge Roof', 'Bowers & Wilkins', 'Executive Lounge', 'Laserlight'] },
  { id: 'v4', year: 2023, make: 'Audi', model: 'RS e-tron GT', mileage: 5200, transmission: '2-Speed Auto', fuel: 'Electric', price: 143500, image: '/assets/car4.jpg', color: 'Kemora Gray', features: ['Carbon Ceramic Brakes', 'RS Sport Suspension', '21" Wheels', 'Matrix LED'] },
  { id: 'v5', year: 2022, make: 'Bentley', model: 'Continental GT Speed', mileage: 8200, transmission: '8-Speed DCT', fuel: 'Petrol', price: 289900, image: '/assets/car5.jpg', color: 'Dragon Red II', features: ['Mulliner Driving Spec', 'Touring Spec', 'Naim Audio', '22" Alloy Wheels'] },
  { id: 'v6', year: 2023, make: 'Rolls-Royce', model: 'Ghost Black Badge', mileage: 3500, transmission: '8-Speed Auto', fuel: 'Petrol', price: 420000, image: '/assets/car6.jpg', featured: true, color: 'Temple of Heaven Blue', features: ['Starlight Headliner', 'Lounge Seats', 'Illuminated Grille', 'Air Purification'] },
  { id: 'v7', year: 2023, make: 'Range Rover', model: 'SVAutobiography', mileage: 6800, transmission: '8-Speed Auto', fuel: 'Petrol', price: 187500, image: '/assets/car7.jpg', color: 'Santorini Black', features: ['SV Bespoke Interior', 'Executive Class Seating', 'Meridian 3D Audio', 'Terrain Response 2'] },
  { id: 'v8', year: 2023, make: 'Aston Martin', model: 'DBX 707', mileage: 2900, transmission: '9-Speed Auto', fuel: 'Petrol', price: 245000, image: '/assets/car8.jpg', color: 'Satin Titanium Grey', features: ['Carbon Ceramic Brakes', '23" Alloy Wheels', 'Alcantara Headliner', 'Bowers & Wilkins'] },
  { id: 'v9', year: 2022, make: 'Lamborghini', model: 'Urus Performante', mileage: 5100, transmission: '8-Speed Auto', fuel: 'Petrol', price: 298500, image: '/assets/car9.jpg', color: 'Arancio Borealis', features: ['Carbon Package', 'ADAS', 'Lamborghini Infotainment', 'Alcantara Interior'] },
  { id: 'v10', year: 2023, make: 'Ferrari', model: 'Purosangue', mileage: 1200, transmission: '8-Speed DCT', fuel: 'Petrol', price: 425000, image: '/assets/car10.jpg', featured: true, color: 'Rosso Fiorano', features: ['4WS', 'Active Suspension', 'Burmester Audio', 'Carbon Fiber Interior'] },
  { id: 'v11', year: 2023, make: 'McLaren', model: 'GT', mileage: 3800, transmission: '7-Speed SSG', fuel: 'Petrol', price: 218000, image: '/assets/car11.jpg', color: 'Vega Blue', features: ['MSO Defined', 'Bowers & Wilkins', 'Carbon Fiber Pack', 'Front Lift System'] },
  { id: 'v12', year: 2023, make: 'Bentley', model: 'Flying Spur Hybrid', mileage: 2900, transmission: '8-Speed DCT', fuel: 'Hybrid', price: 245000, image: '/assets/car12.jpg', color: 'Emerald', features: ['Mulliner Driving Spec', 'Touring Spec', 'Naim Audio', '22" Alloy Wheels'] }
]

function ensureDataFile() {
  try {
    if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true })
    if (!fs.existsSync(DATA_FILE)) fs.writeFileSync(DATA_FILE, JSON.stringify(SAMPLE, null, 2), 'utf8')
  } catch (err) {
    console.error('Could not ensure data file:', err)
    process.exit(1)
  }
}

function readData() {
  try {
    const raw = fs.readFileSync(DATA_FILE, 'utf8')
    return JSON.parse(raw || '[]')
  } catch (err) {
    console.warn('Failed reading data, returning sample', err)
    return SAMPLE.slice()
  }
}

function writeData(list) {
  // atomic-ish write
  const tmp = DATA_FILE + '.tmp'
  fs.writeFileSync(tmp, JSON.stringify(list, null, 2), 'utf8')
  fs.renameSync(tmp, DATA_FILE)
}

function readLeads() {
  try {
    if (!fs.existsSync(LEADS_FILE)) return []
    const raw = fs.readFileSync(LEADS_FILE, 'utf8')
    return JSON.parse(raw || '[]')
  } catch (err) {
    console.warn('Failed reading leads, returning empty', err)
    return []
  }
}

function writeLeads(leads) {
  try {
    if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true })
    const tmp = LEADS_FILE + '.tmp'
    fs.writeFileSync(tmp, JSON.stringify(leads, null, 2), 'utf8')
    fs.renameSync(tmp, LEADS_FILE)
  } catch (err) {
    console.error('Failed writing leads:', err)
  }
}

ensureDataFile()

// API routes must come BEFORE static file serving to avoid conflicts
// All API endpoints are registered here first
app.post('/api/login', (req, res) => {
  try {
    const { username, password } = req.body
    
    console.log('Login attempt:', { username, hasPassword: !!password })
    
    if (!username || !password) {
      return res.status(400).json({ success: false, message: 'Username and password are required' })
    }
    
    if (username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password) {
      // Generate session token
      const token = crypto.randomBytes(32).toString('hex')
      sessions.set(token, { username, loginTime: Date.now() })
      
      // Clean up old sessions (older than 24 hours)
      const now = Date.now()
      for (const [t, session] of sessions.entries()) {
        if (now - session.loginTime > 24 * 60 * 60 * 1000) {
          sessions.delete(t)
        }
      }
      
      console.log('Login successful for:', username)
      res.json({ 
        success: true, 
        token, 
        username,
        message: 'Login successful' 
      })
    } else {
      console.log('Login failed: Invalid credentials')
      res.status(401).json({ 
        success: false, 
        message: 'Invalid username or password' 
      })
    }
  } catch (error) {
    console.error('Login endpoint error:', error)
    res.status(500).json({ 
      success: false, 
      message: 'Server error during login' 
    })
  }
})

app.post('/api/logout', requireAuth, (req, res) => {
  const token = req.headers.authorization?.replace('Bearer ', '') || req.body.token
  if (token && sessions.has(token)) {
    sessions.delete(token)
  }
  res.json({ success: true, message: 'Logged out successfully' })
})

app.get('/api/auth/check', requireAuth, (req, res) => {
  res.json({ success: true, username: req.user.username })
})

// API
app.get('/api/inventory', (req, res) => {
  res.json(readData())
})

app.get('/api/inventory/:id', (req, res) => {
  const id = req.params.id
  const item = readData().find(x => x.id === id)
  if (!item) return res.status(404).json({ error: 'Not found' })
  res.json(item)
})

// Protected inventory management endpoints (require authentication)
app.post('/api/inventory', requireAuth, (req, res) => {
  const list = readData()
  const body = req.body || {}
  const id = body.id || ('v' + Date.now())
  const vehicle = Object.assign({ id }, body)
  list.unshift(vehicle)
  writeData(list)
  res.status(201).json(vehicle)
})

app.put('/api/inventory/:id', requireAuth, (req, res) => {
  const id = req.params.id
  const list = readData()
  const idx = list.findIndex(x => x.id === id)
  if (idx === -1) return res.status(404).json({ error: 'Not found' })
  list[idx] = Object.assign({}, list[idx], req.body)
  writeData(list)
  res.json(list[idx])
})

app.delete('/api/inventory/:id', requireAuth, (req, res) => {
  const id = req.params.id
  let list = readData()
  const exists = list.some(x => x.id === id)
  if (!exists) return res.status(404).json({ error: 'Not found' })
  list = list.filter(x => x.id !== id)
  writeData(list)
  res.status(204).end()
})

// Reset endpoint for demo (resets to sample) - requires authentication
app.post('/api/reset', requireAuth, (req, res) => {
  writeData(SAMPLE.slice())
  res.json({ ok: true })
})

// Email configuration
// For production, use environment variables for email credentials
const EMAIL_CONFIG = {
  // Using Gmail as example - replace with your SMTP settings
  // For Gmail, you'll need an "App Password" (not regular password)
  // Set these via environment variables: SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT, 10) || 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER || 'your-email@gmail.com',
    pass: process.env.SMTP_PASS || 'your-app-password'
  }
}

const RECIPIENT_EMAIL = process.env.RECIPIENT_EMAIL || 'sales@prestigemotors.com'

// Create reusable transporter object
let transporter = null
try {
  transporter = nodemailer.createTransport(EMAIL_CONFIG)
} catch (err) {
  console.warn('Email transporter not configured. Email functionality will be disabled.')
  console.warn('Set SMTP_USER, SMTP_PASS, and RECIPIENT_EMAIL environment variables to enable emails.')
}

// Leads/Bookings API
app.get('/api/leads', requireAuth, (req, res) => {
  const leads = readLeads()
  // Return most recent first, limit to last 50
  const sorted = leads.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)).slice(0, 50)
  res.json(sorted)
})

// Mark lead as completed
app.put('/api/leads/:id/complete', requireAuth, (req, res) => {
  const leadId = req.params.id
  const leads = readLeads()
  const leadIndex = leads.findIndex(l => l.id === leadId)
  
  if (leadIndex === -1) {
    return res.status(404).json({ error: 'Lead not found' })
  }
  
  leads[leadIndex].completed = true
  leads[leadIndex].completedAt = new Date().toISOString()
  writeLeads(leads)
  
  res.json({ success: true, lead: leads[leadIndex] })
})

// Email validation helper
function isValidEmail(email) {
  if (!email || typeof email !== 'string') return false
  const trimmed = email.trim()
  if (!trimmed) return false
  
  // Basic email format check: must contain @ and have text before and after
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(trimmed)) return false
  
  // Ensure it has at least one dot after @ (for domain like .com, .co.uk, etc.)
  const parts = trimmed.split('@')
  if (parts.length !== 2) return false
  const domain = parts[1]
  if (!domain.includes('.')) return false
  
  // Ensure domain has at least 2 characters after the last dot (e.g., .com, .uk)
  const domainParts = domain.split('.')
  if (domainParts.length < 2) return false
  if (domainParts[domainParts.length - 1].length < 2) return false
  
  return true
}

// Contact form / email endpoint
app.post('/api/contact', async (req, res) => {
  const { name, email, phone, vehicle, message, type = 'test-drive' } = req.body

  // Validate required fields
  if (!name) {
    return res.status(400).json({ error: 'Name is required' })
  }

  // Validate email format if provided
  if (email && email.trim() && !isValidEmail(email)) {
    return res.status(400).json({ error: 'Invalid email format. Email must include @ and a valid domain (e.g., .com)' })
  }

  // Save to leads storage
  try {
    const leads = readLeads()
    const newLead = {
      id: 'lead_' + Date.now(),
      name: name.trim(),
      email: email ? email.trim() : null,
      phone: phone ? phone.trim() : null,
      vehicle: vehicle || null,
      vehicleId: vehicle ? vehicle.match(/v\d+/)?.[0] : null,
      message: message || null,
      type: type,
      timestamp: new Date().toISOString()
    }
    leads.push(newLead)
    writeLeads(leads)
    console.log('📝 New lead saved:', newLead.name, newLead.type)
  } catch (err) {
    console.error('Failed to save lead:', err)
  }

  // If email is not configured, return success but log the request
  if (!transporter) {
    console.log('📧 Email request (email not configured):', {
      name,
      email,
      phone,
      vehicle,
      message,
      type
    })
    return res.json({ 
      success: true, 
      message: 'Request received (email not configured - check server logs)',
      note: 'Configure SMTP settings to actually send emails'
    })
  }

  try {
    const emailSubject = type === 'private-viewing' 
      ? 'Private Viewing Request' 
      : `Test Drive Request${vehicle ? ` - ${vehicle}` : ''}`

    const emailHtml = `
      <h2>${emailSubject}</h2>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      ${phone ? `<p><strong>Phone:</strong> ${phone}</p>` : ''}
      ${vehicle ? `<p><strong>Vehicle:</strong> ${vehicle}</p>` : ''}
      ${message ? `<p><strong>Message:</strong><br>${message.replace(/\n/g, '<br>')}</p>` : ''}
      <hr>
      <p style="color: #666; font-size: 12px;">This email was sent from the Prestige Motors website contact form.</p>
    `

    const emailText = `
${emailSubject}

Name: ${name}
Email: ${email}
${phone ? `Phone: ${phone}` : ''}
${vehicle ? `Vehicle: ${vehicle}` : ''}
${message ? `\nMessage:\n${message}` : ''}

---
This email was sent from the Prestige Motors website contact form.
    `.trim()

    const info = await transporter.sendMail({
      from: `"Prestige Motors Website" <${EMAIL_CONFIG.auth.user}>`,
      to: RECIPIENT_EMAIL,
      replyTo: email,
      subject: emailSubject,
      text: emailText,
      html: emailHtml
    })

    console.log('✅ Email sent:', info.messageId)
    res.json({ success: true, message: 'Email sent successfully' })
  } catch (error) {
    console.error('❌ Error sending email:', error)
    res.status(500).json({ 
      error: 'Failed to send email', 
      details: error.message 
    })
  }
})

// Serve static site files AFTER all API routes to avoid conflicts
// This ensures API routes are matched before static file serving
app.use('/', express.static(path.join(__dirname)))

const PORT = parseInt(process.env.PORT, 10) || 3000
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`)
  if (!transporter) {
    console.log('⚠️  Email functionality disabled. Set SMTP environment variables to enable.')
  } else {
    console.log(`📧 Email configured. Emails will be sent to: ${RECIPIENT_EMAIL}`)
  }
})
