import { validatePhone } from './validaciones.js'
import { getDepartments, getDistricts, getProvinces } from './ubigeo.js'

export function validateCheckout(data) {
  const errors = {}
  const text = (value) => typeof value === 'string' ? value.trim() : ''
  if (!text(data.firstName)) errors.firstName = 'Ingresa los nombres.'
  if (!text(data.lastName)) errors.lastName = 'Ingresa los apellidos.'
  errors.phone = validatePhone(text(data.phone))
  if (!['delivery', 'recojo'].includes(data.delivery)) errors.delivery = 'Selecciona la entrega.'
  if (data.delivery === 'delivery') {
    if (!text(data.address)) errors.address = 'Ingresa la dirección.'
    if (!getDepartments().includes(data.department)) errors.department = 'Selecciona el departamento.'
    if (!getProvinces(data.department).includes(data.province)) errors.province = 'Selecciona la provincia.'
    if (!getDistricts(data.department, data.province).includes(data.district)) errors.district = 'Selecciona el distrito.'
    if (!text(data.reference)) errors.reference = 'Ingresa una referencia.'
  }
  if (!['tarjeta', 'yape', 'efectivo'].includes(data.payment)) errors.payment = 'Selecciona el método de pago.'
  if (!['boleta', 'factura'].includes(data.receipt)) errors.receipt = 'Selecciona el comprobante.'
  if (data.receipt === 'boleta' && !/^\d{8}$/.test(text(data.dni))) errors.dni = 'El DNI debe tener 8 dígitos.'
  if (data.receipt === 'factura') {
    if (!/^\d{11}$/.test(text(data.ruc))) errors.ruc = 'El RUC debe tener 11 dígitos.'
    if (!text(data.businessName)) errors.businessName = 'Ingresa la razón social.'
  }
  return Object.fromEntries(Object.entries(errors).filter(([, error]) => error))
}

export function normalizeCheckout(data) {
  return {
    firstName: data.firstName.trim(),
    lastName: data.lastName.trim(),
    phone: data.phone.trim(),
    delivery: data.delivery,
    ...(data.delivery === 'delivery' ? {
      address: data.address.trim(),
      department: data.department.trim(),
      province: data.province,
      district: data.district.trim(),
      reference: data.reference.trim(),
    } : {}),
    payment: data.payment,
    receipt: data.receipt,
    ...(data.receipt === 'boleta'
      ? { dni: data.dni.trim() }
      : { ruc: data.ruc.trim(), businessName: data.businessName.trim() }),
  }
}
