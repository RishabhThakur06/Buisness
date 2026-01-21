
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

  
  function ensureVehicleImages(list) {
    const fallbackImage = 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=600&h=400&fit=crop&auto=format'
    return (list || []).map(v => {
      if (!v || typeof v !== 'object') return v
      return Object.assign({}, v, {
        image: v.image || fallbackImage
      })
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

  function populateYearFilter() {
    const yearSelect = document.getElementById('year-filter')
    if (!yearSelect) return
    
    const currentYear = new Date().getFullYear()
    const startYear = currentYear - 20 
    
    
    yearSelect.innerHTML = '<option value="">Any year</option>'
    
    
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
    
    
    priceSelect.innerHTML = '<option value="">Any price</option>'
    
    
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

    
    if (searchTerm) {
      const term = searchTerm.toLowerCase()
      filtered = filtered.filter(v => {
        const searchable = `${v.year} ${v.make} ${v.model} ${v.id}`.toLowerCase()
        return searchable.includes(term)
      })
    }

    
    if (yearFilter) {
      const year = parseInt(yearFilter, 10)
      filtered = filtered.filter(v => v.year === year)
    }

    
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
      el.innerHTML = `
        <div style="height:160px;background:var(--border);border-radius:6px;margin-bottom:10px;display:flex;align-items:center;justify-content:center;color:var(--muted);overflow:hidden"> <img src="${v.image || 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=600&h=400&fit=crop&auto=format'}" alt="${v.make} ${v.model}" style="width:100%;height:100%;object-fit:cover"/> </div>
        <h3 style="margin:0 0 6px">${v.year} ${v.make} ${v.model}</h3>
        <div style="color:var(--muted);font-size:14px">${v.mileage ? v.mileage.toLocaleString() + ' km' : ''} · ${v.transmission || ''} · ${v.fuel || ''}</div>
        <div style="display:flex;justify-content:space-between;align-items:center;margin-top:10px">
          <div style="font-weight:700">${formatPrice(v.price)}</div>
          <div style="display:flex;gap:8px">
            <button aria-label="Book test drive" data-id="${v.id}" class="btn-book">Book test drive</button>
            <a href="#" style="align-self:center;color:var(--muted);text-decoration:none">Details</a>
          </div>
        </div>
      `
      container.appendChild(el)
    })

    
    container.querySelectorAll('.btn-book').forEach(btn => btn.addEventListener('click', (e) => {
      const id = e.currentTarget.dataset.id
      
      const name = prompt('Enter your name to request a test drive (demo):')
      if (name) {
        alert(`Thanks ${name}! We'll contact you shortly about vehicle ${id}.`)
      }
    }))
  }

  function renderAdminInventory() {
    const list = getInventory()
    const tbody = document.getElementById('admin-inventory-body')
    if (!tbody) return
    tbody.innerHTML = ''
    
    if (list.length === 0) {
      tbody.innerHTML = '<tr><td colspan="7" style="text-align:center;padding:40px;color:var(--muted)">No vehicles in inventory. Add your first vehicle using the form on the right.</td></tr>'
      return
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
          throw new Error('Failed to delete vehicle')
        }
        
        
        localStorage.removeItem('inventory')
        renderAdminInventory()
        renderBuyerInventory()
      } catch (error) {
        console.error('Error deleting vehicle:', error)
        alert('Failed to delete vehicle. Please try again.')
      }
    }))

    tbody.querySelectorAll('.admin-edit').forEach(btn => btn.addEventListener('click', async (e) => {
      const id = e.currentTarget.dataset.id
      const list = getInventory()
      const item = list.find(x => x.id === id)
      if (!item) return alert('Item not found')
      
      
      const price = parseFloat(prompt('Set price for ' + id, item.price))
      if (isNaN(price)) return
      
      const authToken = localStorage.getItem('authToken')
      if (!authToken) {
        alert('You must be logged in to edit vehicles.')
        window.location.href = '/pages/login.html'
        return
      }
      
      try {
        const response = await fetch(`/api/inventory/${id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authToken}`
          },
          body: JSON.stringify({ price })
        })
        
        if (!response.ok) {
          if (response.status === 401) {
            alert('Session expired. Please log in again.')
            localStorage.removeItem('authToken')
            localStorage.removeItem('username')
            window.location.href = '/pages/login.html'
            return
          }
          throw new Error('Failed to update vehicle')
        }
        
        
        localStorage.removeItem('inventory')
        renderAdminInventory()
        renderBuyerInventory()
      } catch (error) {
        console.error('Error updating vehicle:', error)
        alert('Failed to update vehicle. Please try again.')
      }
    }))
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
    
    
    const submitBtn = form.querySelector('button[type="submit"]')
    const originalText = submitBtn.textContent
    submitBtn.disabled = true
    submitBtn.textContent = 'Adding...'
    
    
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
      
      localStorage.removeItem('inventory')
      form.reset()
      renderAdminInventory()
      renderBuyerInventory()
      alert('Vehicle added successfully!')
    })
    .catch(error => {
      console.error('Error adding vehicle:', error)
      alert('Failed to add vehicle. Please try again.')
    })
    .finally(() => {
      submitBtn.disabled = false
      submitBtn.textContent = originalText
    })
  }

  
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
    
    applyTheme(initialTheme())
    
    
    let retryCount = 0
    const maxRetries = 20 
    
    function tryWireTheme() {
      const buttons = document.querySelectorAll('#theme-toggle')
      if (buttons.length > 0) {
        wireThemeToggle()
      } else if (retryCount < maxRetries) {
        retryCount++
        
        setTimeout(tryWireTheme, 50)
      } else {
        console.warn('Theme toggle button not found after multiple attempts')
      }
    }
    
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', tryWireTheme)
    } else {
      
      setTimeout(tryWireTheme, 0)
    }
  }

  
  const wiredButtons = new WeakSet()
  
  function wireThemeToggle() {
    const buttons = document.querySelectorAll('#theme-toggle')
    if (buttons.length === 0) {
      return 
    }
    
    buttons.forEach(btn => {
      
      if (wiredButtons.has(btn)) return
      wiredButtons.add(btn)
      
      
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

    
    if (!formData.name || !formData.email) {
      alert('Please fill in your name and email address.')
      return
    }

    
    const submitBtn = form.querySelector('button[type="submit"]')
    const originalText = submitBtn.textContent
    submitBtn.disabled = true
    submitBtn.textContent = 'Sending...'

    
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

    
    const searchButton = document.getElementById('search-button')
    if (searchButton) {
      searchButton.addEventListener('click', handleInventorySearch)
    }

    
    const filterForm = document.getElementById('inventory-filters')
    if (filterForm) {
      filterForm.addEventListener('submit', (e) => {
        e.preventDefault()
        handleInventorySearch()
      })
    }

    
    const searchInput = document.getElementById('search-input')
    if (searchInput) {
      let searchTimeout
      searchInput.addEventListener('input', () => {
        clearTimeout(searchTimeout)
        searchTimeout = setTimeout(handleInventorySearch, 300) 
      })
    }

    
    const yearFilter = document.getElementById('year-filter')
    const priceFilter = document.getElementById('price-filter')
    if (yearFilter) {
      yearFilter.addEventListener('change', handleInventorySearch)
    }
    if (priceFilter) {
      priceFilter.addEventListener('change', handleInventorySearch)
    }
  }

  function init() {
    
    initTheme()
    
    const initializeApp = () => {
      initFilters()
      renderBuyerInventory()
      renderAdminInventory()
      
      
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

