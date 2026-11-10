import { useEffect, useMemo, useState } from 'react'
import Banner from '../components/Banner.jsx'
import Field from '../components/Field.jsx'
import ProductCard from '../components/ProductCard.jsx'
import { addToCart } from '../cart/cartStore.js'
import { getProducts } from '../auth/mockApi.js'

const CATEGORIES = ['Todas', 'Mujer', 'Hombre', 'Unisex']

const SORT_OPTIONS = [
  { value: 'vendidos', label: 'Más vendidos' },
  { value: 'precio-asc', label: 'Precio: menor a mayor' },
  { value: 'precio-desc', label: 'Precio: mayor a menor' },
]

function Catalog() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('Todas')
  const [brand, setBrand] = useState('Todas')
  const [sort, setSort] = useState('vendidos')
  const [added, setAdded] = useState('')

  useEffect(() => {
    let active = true

    getProducts().then((data) => {
      if (active) {
        setProducts(data)
        setLoading(false)
      }
    })

    return () => {
      active = false
    }
  }, [])

  const brands = useMemo(
    () => [...new Set(products.map((product) => product.brand))].sort(),
    [products],
  )

  const filteredProducts = useMemo(() => {
    const term = search.trim().toLowerCase()

    const result = products.filter((product) => {
      const matchesSearch = product.name.toLowerCase().includes(term)
      const matchesCategory =
        category === 'Todas' || product.category === category
      const matchesBrand = brand === 'Todas' || product.brand === brand

      return matchesSearch && matchesCategory && matchesBrand
    })

    if (sort === 'precio-asc') {
      return [...result].sort((a, b) => a.price - b.price)
    }

    if (sort === 'precio-desc') {
      return [...result].sort((a, b) => b.price - a.price)
    }

    return [...result].sort((a, b) => b.sold - a.sold)
  }, [products, search, category, brand, sort])

  const activeFilters = [
    search.trim() ? `Búsqueda: ${search.trim()}` : '',
    category !== 'Todas' ? `Categoría: ${category}` : '',
    brand !== 'Todas' ? `Marca: ${brand}` : '',
  ].filter(Boolean)

  const clearFilters = () => {
    setSearch('')
    setCategory('Todas')
    setBrand('Todas')
    setSort('vendidos')
  }

  const handleAdd = (product) => {
    addToCart(product)
    setAdded(`${product.name} se agregó al carrito.`)
    window.setTimeout(() => setAdded(''), 2500)
  }

  return (
    <div className="mx-auto w-full max-w-6xl">
      <p className="text-xs font-semibold uppercase tracking-[0.3em] text-eyebrow">
        Perfumería Néctar
      </p>
      <h1 className="mt-2 font-serif text-3xl font-bold text-ink sm:text-4xl">
        Catálogo de perfumes
      </h1>
      <p className="mt-2 text-sm text-muted">
        Encuentra tu próxima fragancia por nombre, categoría o marca.
      </p>

      <section className="mt-6 rounded-3xl border border-line bg-card p-5 shadow-sm">
        <div className="grid gap-4 md:grid-cols-[1.4fr_1fr_1fr]">
          <Field
            id="search"
            label="Buscar perfume"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            hint="Escribe el nombre del perfume."
            placeholder="Ej. Néctar de Cairo"
          />

          <Field
            id="brand"
            label="Marca"
            as="select"
            value={brand}
            onChange={(event) => setBrand(event.target.value)}
            options={[
              { value: 'Todas', label: 'Todas las marcas' },
              ...brands.map((item) => ({ value: item, label: item })),
            ]}
          />

          <Field
            id="sort"
            label="Ordenar por"
            as="select"
            value={sort}
            onChange={(event) => setSort(event.target.value)}
            options={SORT_OPTIONS}
          />
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {CATEGORIES.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setCategory(item)}
              aria-pressed={category === item}
              className={`min-h-11 rounded-full border px-4 text-sm font-semibold transition focus:outline-none focus:ring-4 ${
                category === item
                  ? 'border-primary bg-primary text-card focus:ring-line'
                  : 'border-line bg-card text-ink hover:bg-surface focus:ring-surface'
              }`}
            >
              {item}
            </button>
          ))}
        </div>
      </section>

      {added ? (
        <div className="mt-4">
          <Banner type="success">{added}</Banner>
        </div>
      ) : null}

      <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm font-semibold text-ink">
          {filteredProducts.length} productos encontrados
        </p>
        {activeFilters.length > 0 ? (
          <button
            type="button"
            onClick={clearFilters}
            className="min-h-11 rounded-xl border border-line px-4 text-sm font-semibold text-eyebrow transition hover:bg-surface focus:outline-none focus:ring-4 focus:ring-surface"
          >
            Limpiar filtros
          </button>
        ) : null}
      </div>

      {loading ? (
        <div className="mt-4 grid gap-5 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, index) => (
            <div
              key={index}
              className="h-[360px] animate-pulse rounded-3xl border border-line bg-card"
            />
          ))}
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="mt-4 rounded-3xl border border-line bg-card p-8 text-center shadow-sm">
          <p className="font-serif text-2xl font-bold text-ink">
            0 productos encontrados
          </p>
          <p className="mt-2 text-sm text-muted">
            Prueba con otro nombre o quita algunos filtros.
          </p>
          {activeFilters.length > 0 ? (
            <div className="mt-4 flex flex-wrap justify-center gap-2">
              {activeFilters.map((filter) => (
                <span
                  key={filter}
                  className="rounded-full bg-surface px-3 py-1 text-xs font-semibold text-ink"
                >
                  {filter}
                </span>
              ))}
            </div>
          ) : null}
          <button
            type="button"
            onClick={clearFilters}
            className="mt-5 min-h-11 rounded-[14px] bg-primary px-4 py-3 font-bold text-card transition hover:bg-ink focus:outline-none focus:ring-4 focus:ring-line"
          >
            Limpiar filtros
          </button>
        </div>
      ) : (
        <div className="mt-4 grid gap-5 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} onAdd={handleAdd} />
          ))}
        </div>
      )}
    </div>
  )
}

export default Catalog
