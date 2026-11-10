import { getSession, hasRole } from './session.js'
import {
  validateEmail,
  validateName,
  validatePasswordStrength,
  validatePrice,
  validateStock,
} from '../utils/validaciones.js'

const wait = (ms = 350) => new Promise((resolve) => window.setTimeout(resolve, ms))

const clone = (value) => JSON.parse(JSON.stringify(value))
const CATEGORIES = new Set(['Mujer', 'Hombre', 'Unisex'])
const SHIPMENT_STATUSES = new Set(['Pendiente', 'En camino', 'Entregado'])
const RECEPTION_CONDITIONS = new Set(['Bueno', 'Con observaciones', 'Dañado'])

function isValidDate(value) {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return false
  }

  const date = new Date(`${value}T00:00:00.000Z`)
  return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value
}

function requireAdministrator() {
  if (!hasRole('Administrador')) {
    throw new Error('acceso')
  }
}

function requireSession() {
  const session = getSession()

  if (!session) {
    throw new Error('sesion')
  }

  return session
}

function normalizeItems(items, { allowInsufficientStock = false } = {}) {
  if (!Array.isArray(items) || items.length === 0) {
    throw new Error('vacia')
  }

  const quantities = new Map()

  for (const item of items) {
    if (
      !item ||
      !Number.isSafeInteger(item.productId) ||
      !Number.isSafeInteger(item.quantity) ||
      item.quantity <= 0
    ) {
      throw new Error('cantidad')
    }

    quantities.set(
      item.productId,
      (quantities.get(item.productId) ?? 0) + item.quantity,
    )
  }

  return [...quantities].map(([productId, quantity]) => {
    const product = products.find((entry) => entry.id === productId)

    if (!product) {
      throw new Error('producto')
    }

    if (!Number.isSafeInteger(quantity)) {
      throw new Error('cantidad')
    }

    if (!allowInsufficientStock && quantity > product.stock) {
      throw new Error(
        `Stock insuficiente: solo hay ${product.stock} unidad(es) de «${product.name}».`,
      )
    }

    return {
      productId: product.id,
      name: product.name,
      price: product.price,
      quantity,
    }
  })
}

const users = [
  {
    email: 'cliente.perfumeria@gmail.com',
    password: 'Perfume2026!',
    name: 'Cliente Néctar',
    role: 'Cliente',
  },
  {
    email: 'maria.torres@gmail.com',
    password: 'Perfume2026!',
    name: 'María Torres',
    role: 'Cliente',
  },
  {
    email: 'jorge.ramirez@gmail.com',
    password: 'Perfume2026!',
    name: 'Jorge Ramírez',
    role: 'Cliente',
  },
  {
    email: 'admin@perfumerianectar.com',
    password: 'Admin2026!',
    name: 'Administrador Néctar',
    role: 'Administrador',
  },
]

let products = [
  {
    id: 1,
    name: 'Néctar de Cairo',
    brand: 'Lattafa',
    category: 'Unisex',
    presentation: '100 ml',
    price: 189.9,
    stock: 12,
    sold: 48,
    tone: 'gold',
    image: '',
  },
  {
    id: 2,
    name: 'Rosa Imperial',
    brand: 'Nishane',
    category: 'Mujer',
    presentation: '50 ml',
    price: 248,
    stock: 8,
    sold: 35,
    tone: 'rose',
    image: '',
  },
  {
    id: 3,
    name: 'Bosque Oscuro',
    brand: 'Dior',
    category: 'Hombre',
    presentation: '100 ml',
    price: 310,
    stock: 4,
    sold: 61,
    tone: 'forest',
    image: '',
  },
  {
    id: 4,
    name: 'Brisa de Cítricos',
    brand: 'Chanel',
    category: 'Unisex',
    presentation: '75 ml',
    price: 275.5,
    stock: 18,
    sold: 22,
    tone: 'amber',
    image: '',
  },
  {
    id: 5,
    name: 'Ámbar Nocturno',
    brand: 'Yves Saint Laurent',
    category: 'Mujer',
    presentation: '90 ml',
    price: 265,
    stock: 6,
    sold: 30,
    tone: 'gold',
    image: '',
  },
  {
    id: 6,
    name: 'Oud Real',
    brand: 'Lattafa',
    category: 'Hombre',
    presentation: '100 ml',
    price: 199.9,
    stock: 2,
    sold: 54,
    tone: 'sky',
    image: '',
  },
  {
    id: 7,
    name: 'Vainilla Silvestre',
    brand: 'Carolina Herrera',
    category: 'Mujer',
    presentation: '80 ml',
    price: 215,
    stock: 14,
    sold: 19,
    tone: 'amber',
    image: '',
  },
  {
    id: 8,
    name: 'Cuero Nocturno',
    brand: 'Tom Ford',
    category: 'Hombre',
    presentation: '100 ml',
    price: 340,
    stock: 3,
    sold: 27,
    tone: 'forest',
    image: '',
  },
]

let sales = [
  {
    id: 1,
    clientEmail: 'cliente.perfumeria@gmail.com',
    clientName: 'Cliente Néctar',
    date: '2026-10-28T10:30:00.000Z',
    items: [
      { productId: 2, name: 'Rosa Imperial', price: 248, quantity: 1 },
      { productId: 7, name: 'Vainilla Silvestre', price: 215, quantity: 1 },
    ],
    total: 463,
  },
  {
    id: 2,
    clientEmail: 'cliente.perfumeria@gmail.com',
    clientName: 'Cliente Néctar',
    date: '2026-11-02T16:15:00.000Z',
    items: [{ productId: 1, name: 'Néctar de Cairo', price: 189.9, quantity: 2 }],
    total: 379.8,
  },
  {
    id: 3,
    clientEmail: 'maria.torres@gmail.com',
    clientName: 'María Torres',
    date: '2026-11-03T12:45:00.000Z',
    items: [{ productId: 5, name: 'Ámbar Nocturno', price: 265, quantity: 1 }],
    total: 265,
  },
]

let shipments = [
  {
    id: 1,
    saleId: 1,
    clientName: 'Cliente Néctar',
    address: 'Av. Larco 345, Miraflores',
    city: 'Lima',
    phone: '987654321',
    status: 'En camino',
    date: '2026-10-29T09:00:00.000Z',
  },
  {
    id: 2,
    saleId: 2,
    clientName: 'Cliente Néctar',
    address: 'Jr. Las Flores 120',
    city: 'Arequipa',
    phone: '912345678',
    status: 'Pendiente',
    date: '2026-11-02T18:00:00.000Z',
  },
]

let receptions = [
  {
    id: 1,
    date: '2026-10-25',
    provider: 'Distribuidora Aromas SAC',
    items: [
      { productId: 1, name: 'Néctar de Cairo', quantity: 10, condition: 'Bueno' },
      { productId: 2, name: 'Rosa Imperial', quantity: 5, condition: 'Bueno' },
    ],
  },
  {
    id: 2,
    date: '2026-11-01',
    provider: 'Importaciones Esencia Perú',
    items: [
      { productId: 4, name: 'Brisa de Cítricos', quantity: 8, condition: 'Con observaciones' },
    ],
  },
]

let nextProductId = 9
let nextSaleId = 4
let nextShipmentId = 3
let nextReceptionId = 3

export async function login({ email, password }) {
  await wait(700)

  const normalizedEmail = email.trim().toLowerCase()
  const user = users.find(
    (item) => item.email === normalizedEmail && item.password === password,
  )

  if (!user) {
    throw new Error('credenciales')
  }

  return {
    email: user.email,
    name: user.name,
    role: user.role,
    token: 'token-simulado',
  }
}

export async function register({ name, email, password }) {
  await wait(600)

  if (
    typeof name !== 'string' ||
    validateName(name) ||
    typeof email !== 'string' ||
    typeof password !== 'string' ||
    validateEmail(email) ||
    validatePasswordStrength(password)
  ) {
    throw new Error('datos')
  }

  const normalizedEmail = email.trim().toLowerCase()

  if (users.some((user) => user.email === normalizedEmail)) {
    throw new Error('duplicate')
  }

  const user = {
    email: normalizedEmail,
    password,
    name: name.trim(),
    role: 'Cliente',
  }

  users.push(user)

  return {
    email: user.email,
    name: user.name,
    role: user.role,
  }
}

export async function getProducts() {
  await wait()
  return clone(products)
}

export async function getClients() {
  await wait()
  requireAdministrator()

  return users
    .filter((user) => user.role === 'Cliente')
    .map((user) => ({ email: user.email, name: user.name }))
}

export async function createPerfume(data) {
  await wait(400)
  requireAdministrator()

  if (
    !data ||
    typeof data.name !== 'string' ||
    !data.name.trim() ||
    typeof data.brand !== 'string' ||
    !data.brand.trim() ||
    !CATEGORIES.has(data.category) ||
    validatePrice(data.price) ||
    validateStock(data.stock)
  ) {
    throw new Error('datos')
  }

  const product = {
    id: nextProductId,
    name: data.name.trim(),
    brand: data.brand.trim(),
    category: data.category,
    presentation: typeof data.presentation === 'string' ? data.presentation : '',
    price: Number(data.price),
    stock: Number(data.stock),
    sold: 0,
    image: typeof data.image === 'string' ? data.image : '',
    tone: typeof data.tone === 'string' ? data.tone : 'gold',
  }

  nextProductId += 1
  products = [product, ...products]

  return clone(product)
}

export async function updatePerfume(id, data) {
  await wait(400)
  requireAdministrator()

  const existing = products.find((product) => product.id === id)

  if (!existing) {
    throw new Error('producto')
  }

  if (
    !data ||
    typeof data.name !== 'string' ||
    !data.name.trim() ||
    typeof data.brand !== 'string' ||
    !data.brand.trim() ||
    !CATEGORIES.has(data.category) ||
    validatePrice(data.price) ||
    validateStock(data.stock)
  ) {
    throw new Error('datos')
  }

  products = products.map((product) =>
    product.id === id
      ? {
          ...product,
          name: data.name.trim(),
          brand: data.brand.trim(),
          category: data.category,
          price: Number(data.price),
          stock: Number(data.stock),
          image: typeof data.image === 'string' ? data.image : product.image,
        }
      : product,
  )

  return clone(products.find((product) => product.id === id))
}

export async function deletePerfume(id) {
  await wait(400)
  requireAdministrator()

  const hasSales = sales.some((sale) =>
    sale.items.some((item) => item.productId === id),
  )

  if (hasSales) {
    throw new Error('ventas')
  }

  products = products.filter((product) => product.id !== id)
  return true
}

export async function getSales() {
  await wait()
  requireAdministrator()
  return clone(sales)
}

export async function getSalesByClient(email) {
  await wait()
  const session = requireSession()
  const normalizedEmail = email.trim().toLowerCase()

  if (
    session.role !== 'Administrador' &&
    normalizedEmail !== session.email.toLowerCase()
  ) {
    throw new Error('acceso')
  }

  return clone(sales.filter((sale) => sale.clientEmail === normalizedEmail))
}

export async function createSale({ clientEmail, items }) {
  await wait(500)
  const session = requireSession()

  const normalizedEmail =
    typeof clientEmail === 'string' ? clientEmail.trim().toLowerCase() : ''

  if (
    session.role !== 'Administrador' &&
    normalizedEmail !== session.email.toLowerCase()
  ) {
    throw new Error('acceso')
  }

  const client = users.find((user) => user.email === normalizedEmail)

  if (!client) {
    throw new Error('cliente')
  }

  const normalizedItems = normalizeItems(items)

  products = products.map((product) => {
    const line = normalizedItems.find((item) => item.productId === product.id)

    if (!line) {
      return product
    }

    return {
      ...product,
      stock: product.stock - line.quantity,
      sold: product.sold + line.quantity,
    }
  })

  const total = normalizedItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  )

  const sale = {
    id: nextSaleId,
    clientEmail: client.email,
    clientName: client.name,
    date: new Date().toISOString(),
    items: normalizedItems,
    total: Number(total.toFixed(2)),
  }

  nextSaleId += 1
  sales = [sale, ...sales]

  return clone(sale)
}

export async function getShipments() {
  await wait()
  const session = requireSession()

  if (session.role === 'Administrador') {
    return clone(shipments)
  }

  const clientSaleIds = new Set(
    sales
      .filter((sale) => sale.clientEmail === session.email.toLowerCase())
      .map((sale) => sale.id),
  )

  return clone(shipments.filter((shipment) => clientSaleIds.has(shipment.saleId)))
}

export async function createShipment(data) {
  await wait(400)
  requireAdministrator()

  const saleId = Number(data?.saleId)
  const sale = sales.find((entry) => entry.id === saleId)

  if (!sale) {
    throw new Error('venta')
  }

  if (shipments.some((shipment) => shipment.saleId === sale.id)) {
    throw new Error('envio-existente')
  }

  if (
    typeof data.address !== 'string' ||
    !data.address.trim() ||
    typeof data.city !== 'string' ||
    !data.city.trim() ||
    typeof data.phone !== 'string' ||
    !/^\d{9}$/.test(data.phone.trim()) ||
    !SHIPMENT_STATUSES.has(data.status)
  ) {
    throw new Error('datos')
  }

  const shipment = {
    id: nextShipmentId,
    saleId: sale.id,
    clientName: sale.clientName,
    address: data.address.trim(),
    city: data.city.trim(),
    phone: data.phone.trim(),
    status: data.status,
    date: new Date().toISOString(),
  }

  nextShipmentId += 1
  shipments = [shipment, ...shipments]

  return clone(shipment)
}

export async function updateShipmentStatus(id, status) {
  await wait(250)
  requireAdministrator()

  if (!SHIPMENT_STATUSES.has(status)) {
    throw new Error('estado')
  }

  if (!shipments.some((shipment) => shipment.id === id)) {
    throw new Error('envio')
  }

  shipments = shipments.map((shipment) =>
    shipment.id === id ? { ...shipment, status } : shipment,
  )

  return clone(shipments.find((shipment) => shipment.id === id))
}

export async function getReceptions() {
  await wait()
  requireAdministrator()
  return clone(receptions)
}

export async function createReception({ date, provider, items }) {
  await wait(500)
  requireAdministrator()

  if (!isValidDate(date) || typeof provider !== 'string' || !provider.trim()) {
    throw new Error('datos')
  }

  const normalizedItems = normalizeItems(items, {
    allowInsufficientStock: true,
  }).map((item) => {
    const source = items.find((entry) => entry.productId === item.productId)
    const product = products.find((entry) => entry.id === item.productId)

    if (!RECEPTION_CONDITIONS.has(source?.condition)) {
      throw new Error('estado')
    }

    if (!Number.isSafeInteger(product.stock + item.quantity)) {
      throw new Error('cantidad')
    }

    return {
      productId: item.productId,
      name: item.name,
      quantity: item.quantity,
      condition: source.condition,
    }
  })

  products = products.map((product) => {
    const line = normalizedItems.find((item) => item.productId === product.id)

    if (!line) {
      return product
    }

    return {
      ...product,
      stock: product.stock + line.quantity,
    }
  })

  const reception = {
    id: nextReceptionId,
    date,
    provider: provider.trim(),
    items: normalizedItems,
  }

  nextReceptionId += 1
  receptions = [reception, ...receptions]

  return clone(reception)
}
