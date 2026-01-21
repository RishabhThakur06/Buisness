/* scripts.js — simple in-memory demo data + basic admin functions
   Purpose: prototype buyer inventory rendering and a minimal showroom (admin) interface.
   This is a small demo — in production you'd wire this to a CMS/DB and server APIs.
*/
(function () {
  'use strict'

  const SAMPLE_INVENTORY = [
    { id: 'v1', year: 2020, make: 'Mercedes‑Benz', model: 'S‑Class S 450', mileage: 58000, transmission: 'Automatic', fuel: 'Petrol', price: 74900, image: 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=600&h=400&fit=crop&auto=format', featured: true },
    { id: 'v2', year: 2019, make: 'Porsche', model: '911 Carrera', mileage: 42000, transmission: 'PDK', fuel: 'Petrol', price: 119500, image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=600&h=400&fit=crop&auto=format', featured: true },
    { id: 'v3', year: 2021, make: 'BMW', model: '7 Series 740i', mileage: 32000, transmission: 'Automatic', fuel: 'Petrol', price: 68900, image: 'https://images.unsplash.com/photo-1555215695-3004f00581ec?w=600&h=400&fit=crop&auto=format' },
    { id: 'v4', year: 2022, make: 'Tesla', model: 'Model S Plaid', mileage: 15000, transmission: 'Automatic', fuel: 'Electric', price: 95000, image: 'https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=600&h=400&fit=crop&auto=format', featured: true },
    { id: 'v5', year: 2020, make: 'Audi', model: 'A8 L 55 TFSI', mileage: 45000, transmission: 'Automatic', fuel: 'Petrol', price: 62900, image: 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=600&h=400&fit=crop&auto=format' },
    { id: 'v6', year: 2021, make: 'Range Rover', model: 'Velar P400', mileage: 28000, transmission: 'Automatic', fuel: 'Petrol', price: 78900, image: 'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=600&h=400&fit=crop&auto=format', featured: true },
    { id: 'v7', year: 2019, make: 'Lexus', model: 'LS 500', mileage: 52000, transmission: 'Automatic', fuel: 'Hybrid', price: 59900, image: 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=600&h=400&fit=crop&auto=format' },
    { id: 'v8', year: 2022, make: 'Porsche', model: 'Cayenne Turbo', mileage: 12000, transmission: 'PDK', fuel: 'Petrol', price: 135000, image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=600&h=400&fit=crop&auto=format' },
    { id: 'v9', year: 2020, make: 'Jaguar', model: 'F-Pace SVR', mileage: 38000, transmission: 'Automatic', fuel: 'Petrol', price: 69900, image: 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=600&h=400&fit=crop&auto=format' },
    { id: 'v10', year: 2021, make: 'BMW', model: 'X7 M50i', mileage: 25000, transmission: 'Automatic', fuel: 'Petrol', price: 89900, image: 'https://images.unsplash.com/photo-1555215695-3004f00581ec?w=600&h=400&fit=crop&auto=format' },
    { id: 'v11', year: 2022, make: 'Mercedes‑Benz', model: 'EQS 580', mileage: 8000, transmission: 'Automatic', fuel: 'Electric', price: 105000, image: 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=600&h=400&fit=crop&auto=format', featured: true },
    { id: 'v12', year: 2018, make: 'Maserati', model: 'Ghibli S Q4', mileage: 65000, transmission: 'Automatic', fuel: 'Petrol', price: 54900, image: 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=600&h=400&fit=crop&auto=format' },
    { id: 'v13', year: 2021, make: 'Audi', model: 'RS6 Avant', mileage: 22000, transmission: 'Automatic', fuel: 'Petrol', price: 112000, image: 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=600&h=400&fit=crop&auto=format' },
    { id: 'v14', year: 2020, make: 'BMW', model: 'M5 Competition', mileage: 35000, transmission: 'Automatic', fuel: 'Petrol', price: 98900, image: 'https://images.unsplash.com/photo-1555215695-3004f00581ec?w=600&h=400&fit=crop&auto=format' },
    { id: 'v15', year: 2022, make: 'Lexus', model: 'RX 450h', mileage: 18000, transmission: 'CVT', fuel: 'Hybrid', price: 54900, image: 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=600&h=400&fit=crop&auto=format' }
  ]

  // Ensure every vehicle object has an image; fall back to brand-specific placeholder if missing
  function ensureVehicleImages(list) {
    return (list || []).map(v => {
      if (!v || typeof v !== 'object') return v
      // Don't override if image exists, let getCarImageUrl handle it
      return v
    })
  }

  function getInventory() {
    try {
      const raw = localStorage.getItem('inventory')
      if (!raw) return ensureVehicleImages(SAMPLE_INVENTORY.slice())
      return ensureVehicleImages(JSON.parse(raw))
    } catch (err) {
      console.warn('Could not parse inventory from localStorage — using sample', err)
      return ensureVehicleImages(SAMPLE_INVENTORY.slice())
    }
  }

  function saveInventory(list) {
    localStorage.setItem('inventory', JSON.stringify(list))
  }

  function formatPrice(p) { return p ? `$${p.toLocaleString()}` : 'POA' }

  // Email validation function
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

  // Brand-specific placeholder images
  const BRAND_PLACEHOLDERS = {
    "mercedes-benz": "https://images.unsplash.com/photo-1511918984145-48de785d4c4e?w=600&h=400&fit=crop",
    "mercedes": "https://images.unsplash.com/photo-1511918984145-48de785d4c4e?w=600&h=400&fit=crop",
    "bmw": "https://images.unsplash.com/photo-1465145785445-320be2ae1a5d?w=600&h=400&fit=crop",
    "audi": "https://images.unsplash.com/photo-1519681393784-d120267933ba?w=600&h=400&fit=crop",
    "porsche": "https://images.unsplash.com/photo-1503736334956-4c8f8e92946d?w=600&h=400&fit=crop",
    "jaguar": "https://images.unsplash.com/photo-1502877338535-766e1452684a?w=600&h=400&fit=crop",
    "range rover": "https://images.unsplash.com/photo-1502877338535-766e1452684a?w=600&h=400&fit=crop",
    "lexus": "https://images.unsplash.com/photo-1517602302552-471fe67acf66?w=600&h=400&fit=crop",
    "tesla": "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=600&h=400&fit=crop",
    "maserati": "https://images.unsplash.com/photo-1471478331149-c72d16c2d127?w=600&h=400&fit=crop"
  };
  const DEFAULT_PLACEHOLDER = "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=600&h=400&fit=crop";

  function getBrandPlaceholder(make) {
    if (!make) return DEFAULT_PLACEHOLDER;
    const makeKey = make.toLowerCase().trim();
    // Try exact match first
    if (BRAND_PLACEHOLDERS[makeKey]) return BRAND_PLACEHOLDERS[makeKey];
    // Try partial match (e.g., "Mercedes-Benz" contains "mercedes")
    const normalized = makeKey.replace(/[^a-z0-9]/g, "");
    for (const key in BRAND_PLACEHOLDERS) {
      const keyNormalized = key.replace(/[^a-z0-9]/g, "");
      if (normalized.includes(keyNormalized) || keyNormalized.includes(normalized)) {
        return BRAND_PLACEHOLDERS[key];
      }
    }
    return DEFAULT_PLACEHOLDER;
  }

  function getCarImageUrl(car) {
    // Check if car has a valid image URL
    if (car && car.image) {
      const imgUrl = String(car.image).trim();
      // Only use it if it's not empty and looks like a valid URL
      if (imgUrl && (imgUrl.startsWith('http://') || imgUrl.startsWith('https://') || imgUrl.startsWith('/'))) {
        return imgUrl;
      }
    }
    // Fall back to brand-specific placeholder
    return getBrandPlaceholder(car ? car.make : null);
  }

  function populateYearFilter() {
    const yearSelect = document.getElementById('year-filter')
    if (!yearSelect) return
    
    const currentYear = new Date().getFullYear()
    const startYear = currentYear - 20 // Go back 20 years
    
    // Clear existing options except "Any year"
    yearSelect.innerHTML = '<option value="">Any year</option>'
    
    // Add years from current to start year
    for (let year = currentYear; year >= startYear; year--) {
      const option = document.createElement('option')
      option.value = year
      option.textContent = year
      yearSelect.appendChild(option)
    }
  }

  function populatePriceFilter() {
    const priceSelect = document.getElementById('price-filter')
    if (!priceSelect) return
    
    // Clear existing options except "Any price"
    priceSelect.innerHTML = '<option value="">Any price</option>'
    
    // Define price ranges
    const priceRanges = [
      { value: '0-50000', label: 'Under $50,000' },
      { value: '50000-75000', label: '$50,000 - $75,000' },
      { value: '75000-100000', label: '$75,000 - $100,000' },
      { value: '100000-150000', label: '$100,000 - $150,000' },
      { value: '150000-200000', label: '$150,000 - $200,000' },
      { value: '200000-', label: 'Over $200,000' }
    ]
    
    priceRanges.forEach(range => {
      const option = document.createElement('option')
      option.value = range.value
      option.textContent = range.label
      priceSelect.appendChild(option)
    })
  }

  function filterInventory(list, searchTerm, yearFilter, priceFilter) {
    let filtered = list

    // Search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase()
      filtered = filtered.filter(v => {
        const searchable = `${v.year} ${v.make} ${v.model} ${v.id}`.toLowerCase()
        return searchable.includes(term)
      })
    }

    // Year filter
    if (yearFilter) {
      const year = parseInt(yearFilter, 10)
      filtered = filtered.filter(v => v.year === year)
    }

    // Price filter
    if (priceFilter) {
      const [min, max] = priceFilter.split('-').map(p => p ? parseInt(p, 10) : null)
      filtered = filtered.filter(v => {
        if (min !== null && max !== null) {
          return v.price >= min && v.price < max
        } else if (min !== null) {
          return v.price >= min
        }
        return true
      })
    }

    return filtered
  }

  function renderBuyerInventory(filteredList = null) {
    const list = filteredList !== null ? filteredList : getInventory()
    const container = document.getElementById('inventory-list')
    if (!container) return
    container.innerHTML = ''
    
    if (list.length === 0) {
      container.innerHTML = '<div style="grid-column:1/-1;text-align:center;padding:40px;color:var(--muted)">No vehicles found matching your criteria.</div>'
      return
    }
    
    list.forEach(v => {
      const el = document.createElement('article')
      el.className = 'card'
      el.setAttribute('role','article')
      const placeholderUrl = getBrandPlaceholder(v.make);
      const imageUrl = getCarImageUrl(v);
      // Escape quotes in URLs for onerror handler
      const escapedPlaceholder = placeholderUrl.replace(/'/g, "\\'").replace(/"/g, '&quot;');
      const escapedImageUrl = imageUrl.replace(/'/g, "\\'").replace(/"/g, '&quot;');
      el.innerHTML = `
        <div style="height:160px;background:var(--border);border-radius:6px;margin-bottom:10px;display:flex;align-items:center;justify-content:center;color:var(--muted);overflow:hidden">
            <img src="${escapedImageUrl}" alt="${(v.make + ' ' + v.model).replace(/"/g, '&quot;')}" style="width:100%;height:100%;object-fit:cover" onerror="if(this.src !== '${escapedPlaceholder}') { this.onerror=null; this.src='${escapedPlaceholder}'; }" />
        </div>
        <h3 style="margin:0 0 6px">${v.year} ${v.make} ${v.model}</h3>
        <div style="color:var(--muted);font-size:14px">${v.mileage ? v.mileage.toLocaleString() + ' km' : ''} · ${v.transmission || ''} · ${v.fuel || ''}</div>
        <div style="display:flex;justify-content:space-between;align-items:center;margin-top:10px">
          <div style="font-weight:700">${formatPrice(v.price)}</div>
          <div style="display:flex;gap:8px">
            <button aria-label="Book test drive" data-id="${v.id}" class="btn-book" style="padding:3px 10px;font-size:0.9rem;">Book test drive</button>
            <a href="#" style="align-self:center;color:var(--muted);text-decoration:none">Details</a>
          </div>
        </div>
      `
      container.appendChild(el)
    })

    // Wire booking buttons - send to server
    container.querySelectorAll('.btn-book').forEach(btn => btn.addEventListener('click', async (e) => {
      const id = e.currentTarget.dataset.id
      const list = getInventory()
      const car = list.find(v => v.id === id)
      const carName = car ? `${car.year} ${car.make} ${car.model}` : id
      
      const name = prompt(`Enter your name to request a test drive for ${carName}:`)
      if (!name || !name.trim()) return
      
      // Thank the user for entering their name
      alert(`Thank you, ${name.trim()}! We appreciate your interest.`)
      
      // Optional: ask for email with validation
      let email = ''
      let emailValid = false
      while (true) {
        email = prompt('Enter your email (optional, or leave blank to skip):') || ''
        if (!email.trim()) {
          // Email is optional, so empty is fine
          emailValid = true
          break
        }
        if (isValidEmail(email)) {
          emailValid = true
          break
        } else {
          const retry = confirm('Invalid email format. Email must include @ and a valid domain (e.g., .com).\n\nTry again? (Click OK to retry, Cancel to skip email)')
          if (!retry) {
            email = ''
            emailValid = true
            break
          }
        }
      }
      
      // Send to server
      try {
        const response = await fetch('/api/contact', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: name.trim(),
            email: email.trim() || null,
            vehicle: carName,
            vehicleId: id,
            type: 'test-drive'
          })
        })
        
        const data = await response.json()
        if (response.ok) {
          alert(`Perfect! We'll contact you shortly about the ${carName}.`)
          // Refresh leads on admin page if it's open
          if (typeof renderAdminLeads === 'function') {
            renderAdminLeads()
          }
        } else {
          alert('Sorry, there was an error. Please try again or contact us directly.')
        }
      } catch (error) {
        console.error('Error booking test drive:', error)
        alert('Thanks for your interest! We\'ll contact you soon.')
      }
    }))
  }

  async function renderAdminInventory() {
    const tbody = document.getElementById('admin-inventory-body')
    if (!tbody) return
    tbody.innerHTML = '<tr><td colspan="7" style="text-align:center;padding:20px;color:var(--muted)">Loading inventory...</td></tr>'
    
    try {
      // Fetch from server API instead of localStorage
      const response = await fetch('/api/inventory')
      if (!response.ok) throw new Error('Failed to fetch inventory')
      const list = await response.json()
      
      tbody.innerHTML = ''
      
      if (list.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" style="text-align:center;padding:40px;color:var(--muted)">No vehicles in inventory. Add your first vehicle using the form on the right.</td></tr>'
        return
      }
      
      // Cache in localStorage for buyer inventory (optional)
      try {
        localStorage.setItem('inventory', JSON.stringify(list))
      } catch (e) {
        console.warn('Could not cache inventory to localStorage', e)
      }
      
      list.forEach(v => {
      const row = document.createElement('tr')
      row.innerHTML = `
        <td><strong>${v.id}</strong></td>
        <td>${v.year}</td>
        <td><strong>${v.make} ${v.model}</strong></td>
        <td>${v.mileage ? v.mileage.toLocaleString() + ' km' : '-'}</td>
        <td><strong>${formatPrice(v.price)}</strong></td>
        <td style="text-align:center">${v.featured ? '⭐' : '—'}</td>
        <td>
          <div class="table-actions">
            <button class="admin-edit small secondary" data-id="${v.id}">Edit</button>
            <button class="admin-delete small danger" data-id="${v.id}">Delete</button>
            <button class="admin-addcart small" data-id="${v.id}">Add to Cart</button>
          </div>
        </td>
      `
      tbody.appendChild(row)
      })

      tbody.querySelectorAll('.admin-delete').forEach(btn => btn.addEventListener('click', async (e) => {
      const id = e.currentTarget.dataset.id
      if (!confirm('Delete vehicle ' + id + ' ?')) return
      
      const authToken = localStorage.getItem('authToken')
      if (!authToken) {
        alert('You must be logged in to delete vehicles.')
        window.location.href = '/pages/login.html'
        return
      }
      
      try {
        const response = await fetch(`/api/inventory/${id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${authToken}`
          }
        })
        
        if (!response.ok) {
          if (response.status === 401) {
            alert('Session expired. Please log in again.')
            localStorage.removeItem('authToken')
            localStorage.removeItem('username')
            window.location.href = '/pages/login.html'
            return
          }
          showToastAdmin('Failed to delete vehicle.', 'error');
          throw new Error('Failed to delete vehicle')
        }
        // Refresh inventory from server
        renderAdminInventory()
        renderBuyerInventory()
        showToastAdmin('Car deleted!','success');
      } catch (error) {
        console.error('Error deleting vehicle:', error)
        showToastAdmin('Failed to delete vehicle. Please try again.','error');
      }
    }))

    // CART - Add to Cart button logic
    tbody.querySelectorAll('.admin-addcart').forEach(btn => btn.addEventListener('click', (e) => {
      const id = e.currentTarget.dataset.id;
      addToCartById(id);
    }));

      tbody.querySelectorAll('.admin-edit').forEach(btn => btn.addEventListener('click', async (e) => {
        const id = e.currentTarget.dataset.id;
        // Fetch current inventory from server to get latest data
        try {
          const response = await fetch('/api/inventory')
          if (!response.ok) throw new Error('Failed to fetch inventory')
          const list = await response.json()
          const item = list.find(x => x.id === id);
          if (!item) {
            alert('Item not found. The vehicle may have been deleted.')
            renderAdminInventory() // Refresh the list
            return
          }
    
          // Fill the edit modal form
          const form = document.getElementById('edit-vehicle-form');
          if (!form) return alert('Edit form not found');
          form.id.value = item.id || '';
          form.year.value = item.year || '';
          form.make.value = item.make || '';
          form.model.value = item.model || '';
          form.mileage.value = item.mileage || '';
          form.transmission.value = item.transmission || 'Automatic';
          form.fuel.value = item.fuel || 'Petrol';
          form.price.value = item.price || '';
          form.image.value = item.image || '';
          form.featured.checked = !!item.featured;

          // Show modal
          document.getElementById('edit-modal').classList.add('show');
        } catch (error) {
          console.error('Error fetching vehicle:', error)
          alert('Failed to load vehicle details. Please try again.')
        }
      }));
    } catch (error) {
      console.error('Error loading inventory:', error)
      tbody.innerHTML = '<tr><td colspan="7" style="text-align:center;padding:40px;color:var(--muted)">Error loading inventory. Please refresh the page.</td></tr>'
    }
  }

  function handleAdminAdd(e) {
    e.preventDefault()
    const form = e.target
    const authToken = localStorage.getItem('authToken')
    
    if (!authToken) {
      alert('You must be logged in to add vehicles. Redirecting to login...')
      window.location.href = '/pages/login.html'
      return
    }
    
    const vehicle = {
      year: parseInt(form.year.value || 2020, 10),
      make: form.make.value || 'Make',
      model: form.model.value || 'Model',
      mileage: parseInt(form.mileage.value || 0, 10),
      transmission: form.transmission.value || 'Automatic',
      fuel: form.fuel.value || 'Petrol',
      price: parseFloat(form.price.value || 0),
      image: form.image.value || 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=600&h=400&fit=crop&auto=format',
      featured: form.featured.checked
    }
    
    // Disable submit button
    const submitBtn = form.querySelector('button[type="submit"]')
    const originalText = submitBtn.textContent
    submitBtn.disabled = true
    submitBtn.textContent = 'Adding...'
    
    // Send to server API
    fetch('/api/inventory', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`
      },
      body: JSON.stringify(vehicle)
    })
    .then(response => {
      if (!response.ok) {
        if (response.status === 401) {
          alert('Session expired. Please log in again.')
          localStorage.removeItem('authToken')
          localStorage.removeItem('username')
          window.location.href = '/pages/login.html'
          return
        }
        throw new Error('Failed to add vehicle')
      }
      return response.json()
    })
    .then(data => {
      form.reset()
      // Refresh from server
      renderAdminInventory()
      renderBuyerInventory()
      showToastAdmin('Vehicle added successfully!')
    })
    .catch(error => {
      console.error('Error adding vehicle:', error)
      showToastAdmin('Failed to add vehicle. Please try again.','error')
    })
    .finally(() => {
      submitBtn.disabled = false
      submitBtn.textContent = originalText
    })
  }

  // Theme: initialize from preference or system setting
  const THEME_KEY = 'theme-preference'
  function applyTheme(t){
    if (!t) t = 'light'
    if (t === 'dark') {
      document.documentElement.setAttribute('data-theme','dark')
    } else {
      document.documentElement.removeAttribute('data-theme')
    }
    const btns = document.querySelectorAll('#theme-toggle')
    btns.forEach(b => { 
      b.setAttribute('aria-pressed', t === 'dark' ? 'true' : 'false')
      b.textContent = t === 'dark' ? '🌙' : '☀️' 
    })
  }
  function savedTheme(){
    try {
      return localStorage.getItem(THEME_KEY)
    } catch(e) {
      return null
    }
  }
  function initialTheme(){
    const s = savedTheme()
    if (s) return s
    try { 
      if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        return 'dark'
      }
    } catch(e){}
    return 'light'
  }

  function initTheme() {
    // Apply initial theme immediately
    applyTheme(initialTheme())
    
    // Wire up theme toggle - try multiple times to ensure buttons are found
    let retryCount = 0
    const maxRetries = 20 // Max 1 second of retries (20 * 50ms)
    
    function tryWireTheme() {
      const buttons = document.querySelectorAll('#theme-toggle')
      if (buttons.length > 0) {
        wireThemeToggle()
      } else if (retryCount < maxRetries) {
        retryCount++
        // Try again after a short delay
        setTimeout(tryWireTheme, 50)
      } else {
        console.warn('Theme toggle button not found after multiple attempts')
      }
    }
    
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', tryWireTheme)
    } else {
      // DOM already ready, but wait a tick to ensure all elements are rendered
      setTimeout(tryWireTheme, 0)
    }
  }

  // Track which buttons are already wired to prevent duplicates
  const wiredButtons = new WeakSet()
  
  function wireThemeToggle() {
    const buttons = document.querySelectorAll('#theme-toggle')
    if (buttons.length === 0) {
      return // Buttons not found - caller should retry
    }
    
    buttons.forEach(btn => {
      // Skip if this button is already wired
      if (wiredButtons.has(btn)) return
      wiredButtons.add(btn)
      
      // Remove any existing click handlers by cloning (clean slate)
      const newBtn = btn.cloneNode(true)
      btn.parentNode.replaceChild(newBtn, btn)
      wiredButtons.add(newBtn)
      
      newBtn.addEventListener('click', (e) => {
        e.preventDefault()
        e.stopPropagation()
        const current = document.documentElement.getAttribute('data-theme')
        const now = current === 'dark' ? 'light' : 'dark'
        try{ 
          localStorage.setItem(THEME_KEY, now) 
        } catch(e){
          console.warn('Could not save theme preference', e)
        }
        applyTheme(now)
      })
    })
  }

  function handleContactForm(e) {
    e.preventDefault()
    const form = e.target
    const formData = {
      name: form.name.value.trim(),
      email: form.email.value.trim(),
      phone: form.phone.value.trim(),
      vehicle: form.vehicle.value.trim(),
      message: form.message.value.trim(),
      type: 'test-drive'
    }

    // Basic validation
    if (!formData.name) {
      alert('Please fill in your name.')
      return
    }
    
    // Validate email format if provided
    if (formData.email && !isValidEmail(formData.email)) {
      alert('Invalid email format. Email must include @ and a valid domain (e.g., .com).\n\nPlease enter a valid email address.')
      form.email.focus()
      return
    }

    // Disable submit button
    const submitBtn = form.querySelector('button[type="submit"]')
    const originalText = submitBtn.textContent
    submitBtn.disabled = true
    submitBtn.textContent = 'Sending...'

    // Send to server
    fetch('/api/contact', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formData)
    })
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        alert('Thank you! Your request has been sent. We\'ll contact you shortly.')
        form.reset()
      } else {
        alert('Sorry, there was an error sending your request. Please try again or call us directly.')
        console.error('Contact form error:', data)
      }
    })
    .catch(error => {
      console.error('Contact form error:', error)
      // Fallback to mailto if server is not available
      const mailtoBody = encodeURIComponent(
        `Name: ${formData.name}\n` +
        `Email: ${formData.email}\n` +
        (formData.phone ? `Phone: ${formData.phone}\n` : '') +
        (formData.vehicle ? `Vehicle: ${formData.vehicle}\n` : '') +
        (formData.message ? `\nMessage:\n${formData.message}` : '')
      )
      const mailtoLink = `mailto:sales@prestigemotors.com?subject=Test Drive Request&body=${mailtoBody}`
      if (confirm('Unable to send email automatically. Would you like to open your email client instead?')) {
        window.location.href = mailtoLink
      }
    })
    .finally(() => {
      submitBtn.disabled = false
      submitBtn.textContent = originalText
    })
  }

  function handleInventorySearch() {
    const searchInput = document.getElementById('search-input')
    const yearFilter = document.getElementById('year-filter')
    const priceFilter = document.getElementById('price-filter')
    
    if (!searchInput || !yearFilter || !priceFilter) return

    const searchTerm = searchInput.value.trim()
    const yearValue = yearFilter.value
    const priceValue = priceFilter.value

    const allInventory = getInventory()
    const filtered = filterInventory(allInventory, searchTerm, yearValue, priceValue)
    renderBuyerInventory(filtered)
  }

  function initFilters() {
    populateYearFilter()
    populatePriceFilter()

    // Wire up search button
    const searchButton = document.getElementById('search-button')
    if (searchButton) {
      searchButton.addEventListener('click', handleInventorySearch)
    }

    // Wire up form submission
    const filterForm = document.getElementById('inventory-filters')
    if (filterForm) {
      filterForm.addEventListener('submit', (e) => {
        e.preventDefault()
        handleInventorySearch()
      })
    }

    // Wire up real-time search on input (optional - can be removed if too aggressive)
    const searchInput = document.getElementById('search-input')
    if (searchInput) {
      let searchTimeout
      searchInput.addEventListener('input', () => {
        clearTimeout(searchTimeout)
        searchTimeout = setTimeout(handleInventorySearch, 300) // Debounce
      })
    }

    // Wire up filter changes
    const yearFilter = document.getElementById('year-filter')
    const priceFilter = document.getElementById('price-filter')
    if (yearFilter) {
      yearFilter.addEventListener('change', handleInventorySearch)
    }
    if (priceFilter) {
      priceFilter.addEventListener('change', handleInventorySearch)
    }
  }

  // --- Edit modal logic ---
  function showToastAdmin(message, type = 'success') {
    const toast = document.getElementById('admin-toast');
    if (!toast) return;
    toast.textContent = message;
    toast.style.display = 'block';
    toast.style.background = type === 'success' ? 'var(--accent)' : '#dc2626';
    setTimeout(() => { toast.style.display = 'none'; }, 2700);
  }

  function handleEditModalSubmit(e) {
    e.preventDefault();
    const form = e.target;
    const authToken = localStorage.getItem('authToken');
    if (!authToken) {
      alert('You must be logged in to edit vehicles.');
      window.location.href = '/pages/login.html';
      return;
    }
    // Prepare payload
    const vehicle = {
      year: parseInt(form.year.value || 2020, 10),
      make: form.make.value.trim(),
      model: form.model.value.trim(),
      mileage: parseInt(form.mileage.value || 0, 10),
      transmission: form.transmission.value,
      fuel: form.fuel.value,
      price: parseFloat(form.price.value || 0),
      image: form.image.value.trim(),
      featured: form.featured.checked
    };
    const id = form.id.value;
    if (!id) return alert('Vehicle ID missing');
    // Disable submit
    form.querySelector('button[type="submit"]').disabled = true;

    fetch(`/api/inventory/${id}`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        },
        body: JSON.stringify(vehicle)
      }).then(async response => {
        if (!response.ok) {
          if (response.status === 401) {
            alert('Session expired. Please log in again.');
            localStorage.removeItem('authToken');
            localStorage.removeItem('username');
            window.location.href = '/pages/login.html';
            return;
          }
          let msg = 'Failed to update vehicle.';
          try { msg = (await response.json()).error || msg; } catch {}
          showToastAdmin(msg, 'error');
          throw new Error(msg);
        }
        // Success - refresh from server
        renderAdminInventory();
        renderBuyerInventory();
        showToastAdmin('Car updated!');
        document.getElementById('edit-modal').classList.remove('show');
      }).catch(err => {
        console.error('Failed to update vehicle', err);
      }).finally(() => {
        form.querySelector('button[type="submit"]').disabled = false;
      })
  }

  function wireEditModalButtons() {
    // Close modal on close btn or cancel
    const modal = document.getElementById('edit-modal');
    const closeBtn = document.getElementById('edit-modal-close');
    const cancelBtn = document.getElementById('edit-cancel-btn');
    [closeBtn, cancelBtn].forEach(btn => btn && btn.addEventListener('click', () => modal.classList.remove('show')));
    // Submit event
    const editForm = document.getElementById('edit-vehicle-form');
    if (editForm) editForm.addEventListener('submit', handleEditModalSubmit);
    // Dismiss modal on background click
    if (modal) modal.addEventListener('click', (e) => { if (e.target === modal) modal.classList.remove('show'); });
  }

  // --- Cart logic ---
  const CART_KEY = 'cart-demo-admin';
  function loadCart() {
    try { return JSON.parse(localStorage.getItem(CART_KEY) || '[]'); } catch { return []; }
  }
  function saveCart(cart) { localStorage.setItem(CART_KEY, JSON.stringify(cart)); }
  function cartHasId(id) {
    const cart = loadCart();
    return cart.includes(id);
  }
  function addToCartById(id) {
    let cart = loadCart();
    if (!cart.includes(id)) {
      cart.push(id);
      saveCart(cart);
      renderCartSection();
      showToastAdmin('Added to cart!');
    }
  }
  function removeFromCartById(id) {
    let cart = loadCart();
    cart = cart.filter(cid => cid !== id);
    saveCart(cart);
    renderCartSection();
    showToastAdmin('Removed from cart!');
  }
  function clearCart() {
    localStorage.removeItem(CART_KEY);
    renderCartSection();
    showToastAdmin('Cart cleared!');
  }

  function renderCartSection() {
    const cartListDiv = document.getElementById('cart-list');
    const cartTotalsDiv = document.getElementById('cart-totals');
    const cartClearBtn = document.getElementById('cart-clear-btn');
    if (!cartListDiv || !cartTotalsDiv) return;
    const cart = loadCart();
    const inv = getInventory();
    if (cart.length === 0) {
      cartListDiv.innerHTML = '<div style="color:var(--muted)">Cart is empty. Use <b>Add to Cart</b> above!</div>';
      cartTotalsDiv.innerHTML = '';
      if (cartClearBtn) cartClearBtn.style.display = 'none';
      return;
    }
    // Get all actual car data in cart
    let subtotal = 0;
    let html = '<ul style="list-style:none;padding:0;margin:0">';
    cart.forEach(id => {
      const car = inv.find(v => v.id === id);
      if (!car) return;
      subtotal += (car.price || 0);
      html += `<li style="display:flex;align-items:center;gap:12px;margin-bottom:8px;">
        <span style="flex:1;">${car.year} ${car.make} ${car.model}</span>
        <span>${formatPrice(car.price)}</span>
        <button class="cart-remove-btn danger small" data-id="${car.id}">Remove</button>
      </li>`;
    });
    html += '</ul>';
    cartListDiv.innerHTML = html;
    if (cartClearBtn) cartClearBtn.style.display = '';
    // Tax and totals (sample GST: 18%)
    const taxRate = 0.18, tax = Math.round(subtotal * taxRate), grand = subtotal + tax;
    cartTotalsDiv.innerHTML = `<div>Subtotal: <strong>${formatPrice(subtotal)}</strong></div>
      <div>GST (18%): <strong>${formatPrice(tax)}</strong></div>
      <div style="font-size:1.12rem;margin-top:6px;">Grand Total: <strong>${formatPrice(grand)}</strong></div>`;
    // Wire remove buttons
    cartListDiv.querySelectorAll('.cart-remove-btn').forEach(btn => btn.addEventListener('click', e => {
      removeFromCartById(btn.dataset.id);
    }));
    // Wire clear
    if (cartClearBtn) cartClearBtn.onclick = clearCart;
  }

  // Render admin leads/bookings
  async function renderAdminLeads() {
    const leadsList = document.getElementById('admin-leads-list')
    if (!leadsList) return
    
    const authToken = localStorage.getItem('authToken')
    if (!authToken) {
      leadsList.innerHTML = '<li style="color:var(--muted);text-align:center;padding:20px">Please log in to view leads</li>'
      return
    }
    
    try {
      const response = await fetch('/api/leads', {
        headers: { 'Authorization': `Bearer ${authToken}` }
      })
      
      if (!response.ok) {
        if (response.status === 401) {
          leadsList.innerHTML = '<li style="color:var(--muted);text-align:center;padding:20px">Session expired. Please refresh.</li>'
          return
        }
        throw new Error('Failed to fetch leads')
      }
      
      const leads = await response.json()
      
      // Separate active and completed leads
      const activeLeads = leads.filter(lead => !lead.completed)
      const completedLeads = leads.filter(lead => lead.completed).sort((a, b) => {
        const dateA = new Date(a.completedAt || a.timestamp)
        const dateB = new Date(b.completedAt || b.timestamp)
        return dateB - dateA
      })
      
      // Render active leads
      if (activeLeads.length === 0) {
        leadsList.innerHTML = '<li style="color:var(--muted);text-align:center;padding:20px">No active leads. Test drive requests will appear here.</li>'
      } else {
        leadsList.innerHTML = activeLeads.map(lead => {
          const date = new Date(lead.timestamp)
          const timeStr = date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          const typeLabel = lead.type === 'test-drive' ? 'Test Drive' : lead.type === 'private-viewing' ? 'Private Viewing' : 'Lead'
          const vehicleInfo = lead.vehicle ? ` — ${lead.vehicle}` : lead.vehicleId ? ` — ${lead.vehicleId}` : ''
          return `
            <li>
              <div style="display:flex;justify-content:space-between;align-items:start;">
                <div style="flex:1;">
                  <div class="lead-type">${typeLabel}</div>
                  <div style="font-weight:500;margin-top:4px">${lead.name}${vehicleInfo}</div>
                  ${lead.email ? `<div style="color:var(--muted);font-size:0.85rem;margin-top:2px">${lead.email}</div>` : ''}
                  <div style="color:var(--muted);font-size:0.75rem;margin-top:4px">${timeStr}</div>
                </div>
                <button class="mark-complete-btn small secondary" data-lead-id="${lead.id}" style="margin-left:8px;white-space:nowrap;">Mark Complete</button>
              </div>
            </li>
          `
        }).join('')
        
        // Wire up mark complete buttons
        leadsList.querySelectorAll('.mark-complete-btn').forEach(btn => {
          btn.addEventListener('click', async (e) => {
            const leadId = e.currentTarget.dataset.leadId
            await markLeadAsCompleted(leadId)
          })
        })
      }
      
      // Render completed leads
      renderCompletedLeads(completedLeads)
      
    } catch (error) {
      console.error('Error fetching leads:', error)
      leadsList.innerHTML = '<li style="color:var(--muted);text-align:center;padding:20px">Error loading leads. Please refresh.</li>'
    }
  }

  // Render completed leads
  function renderCompletedLeads(completedLeads) {
    const completedList = document.getElementById('admin-completed-leads-list')
    if (!completedList) return
    
    if (completedLeads.length === 0) {
      completedList.innerHTML = '<li style="color:var(--muted);text-align:center;padding:20px">No completed leads yet.</li>'
      return
    }
    
    completedList.innerHTML = completedLeads.map(lead => {
      const date = new Date(lead.timestamp)
      const completedDate = lead.completedAt ? new Date(lead.completedAt) : null
      const timeStr = date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      const completedStr = completedDate ? completedDate.toLocaleDateString() + ' ' + completedDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''
      const typeLabel = lead.type === 'test-drive' ? 'Test Drive' : lead.type === 'private-viewing' ? 'Private Viewing' : 'Lead'
      const vehicleInfo = lead.vehicle ? ` — ${lead.vehicle}` : lead.vehicleId ? ` — ${lead.vehicleId}` : ''
      return `
        <li style="opacity:0.7;">
          <div class="lead-type">${typeLabel} ✓</div>
          <div style="font-weight:500;margin-top:4px">${lead.name}${vehicleInfo}</div>
          ${lead.email ? `<div style="color:var(--muted);font-size:0.85rem;margin-top:2px">${lead.email}</div>` : ''}
          <div style="color:var(--muted);font-size:0.75rem;margin-top:4px">Requested: ${timeStr}</div>
          ${completedStr ? `<div style="color:var(--muted);font-size:0.75rem;margin-top:2px">Completed: ${completedStr}</div>` : ''}
        </li>
      `
    }).join('')
  }

  // Mark lead as completed
  async function markLeadAsCompleted(leadId) {
    const authToken = localStorage.getItem('authToken')
    if (!authToken) {
      alert('You must be logged in to perform this action.')
      return
    }
    
    try {
      const response = await fetch(`/api/leads/${leadId}/complete`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${authToken}`
        }
      })
      
      if (!response.ok) {
        if (response.status === 401) {
          alert('Session expired. Please log in again.')
          window.location.href = '/pages/login.html'
          return
        }
        throw new Error('Failed to mark lead as completed')
      }
      
      showToastAdmin('Test drive marked as completed!')
      renderAdminLeads() // Refresh the list
    } catch (error) {
      console.error('Error marking lead as completed:', error)
      showToastAdmin('Failed to mark as completed. Please try again.', 'error')
    }
  }

  function init() {
    // Initialize theme early
    initTheme()
    
    const initializeApp = () => {
      initFilters()
      renderBuyerInventory()
      renderAdminInventory()
      wireEditModalButtons()
      renderCartSection()
      renderAdminLeads()
      
      // Wire up toggle completed leads button
      const toggleCompletedBtn = document.getElementById('toggle-completed-leads')
      if (toggleCompletedBtn) {
        let showCompleted = false
        toggleCompletedBtn.addEventListener('click', () => {
          showCompleted = !showCompleted
          const completedSection = document.getElementById('completed-leads-section')
          if (completedSection) {
            completedSection.style.display = showCompleted ? 'block' : 'none'
            toggleCompletedBtn.textContent = showCompleted ? 'Hide Completed' : 'Show Completed'
          }
        })
      }
      
      // Refresh leads every 30 seconds
      setInterval(renderAdminLeads, 30000)
      
      // Ensure theme toggle is wired up
      wireThemeToggle()

      const addForm = document.getElementById('add-vehicle-form')
      if (addForm) addForm.addEventListener('submit', handleAdminAdd)

      const contactForm = document.getElementById('contact-form')
      if (contactForm) contactForm.addEventListener('submit', handleContactForm)
    }
    
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', initializeApp)
    } else {
      initializeApp()
    }
  }

  init()
})()
