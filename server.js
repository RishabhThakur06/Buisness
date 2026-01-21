

const express = require('express')
const fs = require('fs')
const path = require('path')
const cors = require('cors')
const nodemailer = require('nodemailer')
const crypto = require('crypto')

const app = express()
app.use(express.json())
app.use(cors())


const sessions = new Map()


const ADMIN_CREDENTIALS = {
  username: process.env.ADMIN_USERNAME || 'admin',
  password: process.env.ADMIN_PASSWORD || 'admin123'
}


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
  
  const tmp = DATA_FILE + '.tmp'
  fs.writeFileSync(tmp, JSON.stringify(list, null, 2), 'utf8')
  fs.renameSync(tmp, DATA_FILE)
}

ensureDataFile()



app.post('/api/login', (req, res) => {
  try {
    const { username, password } = req.body
    
    console.log('Login attempt:', { username, hasPassword: !!password })
    
    if (!username || !password) {
      return res.status(400).json({ success: false, message: 'Username and password are required' })
    }
    
    if (username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password) {
      
      const token = crypto.randomBytes(32).toString('hex')
      sessions.set(token, { username, loginTime: Date.now() })
      
      
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


app.get('/api/inventory', (req, res) => {
  res.json(readData())
})

app.get('/api/inventory/:id', (req, res) => {
  const id = req.params.id
  const item = readData().find(x => x.id === id)
  if (!item) return res.status(404).json({ error: 'Not found' })
  res.json(item)
})


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


app.post('/api/reset', requireAuth, (req, res) => {
  writeData(SAMPLE.slice())
  res.json({ ok: true })
})



const EMAIL_CONFIG = {
  
  
  
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT, 10) || 587,
  secure: false, 
  auth: {
    user: process.env.SMTP_USER || 'your-email@gmail.com',
    pass: process.env.SMTP_PASS || 'your-app-password'
  }
}

const RECIPIENT_EMAIL = process.env.RECIPIENT_EMAIL || 'sales@prestigemotors.com'


let transporter = null
try {
  transporter = nodemailer.createTransport(EMAIL_CONFIG)
} catch (err) {
  console.warn('Email transporter not configured. Email functionality will be disabled.')
  console.warn('Set SMTP_USER, SMTP_PASS, and RECIPIENT_EMAIL environment variables to enable emails.')
}


app.post('/api/contact', async (req, res) => {
  const { name, email, phone, vehicle, message, type = 'test-drive' } = req.body

  
  if (!name || !email) {
    return res.status(400).json({ error: 'Name and email are required' })
  }

  
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

