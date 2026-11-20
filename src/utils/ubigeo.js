import csv from './ubigeos-inei.csv?raw'

const departments = new Map()

for (const line of csv.split(/\r?\n/)) {
  const [code, department, province, district] = line.trim().split(';')
  if (!/^\d{6}$/.test(code)) continue
  if (!departments.has(department)) departments.set(department, new Map())
  const provinces = departments.get(department)
  if (!provinces.has(province)) provinces.set(province, new Set())
  provinces.get(province).add(district)
}

const sorted = (values) => [...values].sort((a, b) => a.localeCompare(b, 'es'))

export function getDepartments() {
  return sorted(departments.keys())
}

export function getProvinces(department) {
  return sorted(departments.get(department)?.keys() ?? [])
}

export function getDistricts(department, province) {
  return sorted(departments.get(department)?.get(province) ?? [])
}

export function matchUbigeoName(value, options) {
  if (typeof value !== 'string') return ''
  const normalize = (name) => name
    .replace(/^(departamento|región|provincia|distrito) de(?:l)?\s+/i, '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim()
    .toUpperCase()
  const target = normalize(value)
  return options.find((option) => normalize(option) === target) ?? ''
}
