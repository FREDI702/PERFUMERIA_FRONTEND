import { useEffect, useState } from 'react'
import Banner from '../../components/Banner.jsx'
import BottleArt from '../../components/BottleArt.jsx'
import Button from '../../components/Button.jsx'
import Card from '../../components/Card.jsx'
import ConfirmDialog from '../../components/ConfirmDialog.jsx'
import Field from '../../components/Field.jsx'
import Table from '../../components/Table.jsx'
import {
  createPerfume,
  deletePerfume,
  getProducts,
  updatePerfume,
} from '../../auth/mockApi.js'
import { formatCurrency } from '../../utils/format.js'
import { validatePrice, validateStock } from '../../utils/validaciones.js'

const EMPTY_FORM = {
  name: '',
  brand: '',
  category: 'Unisex',
  price: '',
  stock: '',
  image: '',
}

const CATEGORY_OPTIONS = [
  { value: 'Mujer', label: 'Mujer' },
  { value: 'Hombre', label: 'Hombre' },
  { value: 'Unisex', label: 'Unisex' },
]

function Perfumes() {
  const [products, setProducts] = useState([])
  const [form, setForm] = useState(EMPTY_FORM)
  const [errors, setErrors] = useState({})
  const [editingId, setEditingId] = useState(null)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [deleting, setDeleting] = useState(null)
  const [deletingLoading, setDeletingLoading] = useState(false)

  const refresh = async () => {
    const data = await getProducts()
    setProducts(data)
  }

  useEffect(() => {
    let active = true

    getProducts().then((data) => {
      if (active) {
        setProducts(data)
      }
    })

    return () => {
      active = false
    }
  }, [])

  const updateField = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }))
    setErrors((current) => ({ ...current, [field]: '' }))
    setError('')
  }

  const handleImage = (event) => {
    const file = event.target.files?.[0]

    if (!file) {
      return
    }

    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      setError('La foto debe ser JPG, PNG o WEBP.')
      return
    }

    if (file.size > 2 * 1024 * 1024) {
      setError('La foto no debe superar 2 MB.')
      return
    }

    const reader = new FileReader()
    reader.onload = () => {
      setForm((current) => ({ ...current, image: String(reader.result) }))
      setError('')
    }
    reader.readAsDataURL(file)
  }

  const resetForm = () => {
    setForm(EMPTY_FORM)
    setErrors({})
    setEditingId(null)
  }

  const startEdit = (product) => {
    setEditingId(product.id)
    setForm({
      name: product.name,
      brand: product.brand,
      category: product.category,
      price: String(product.price),
      stock: String(product.stock),
      image: product.image ?? '',
    })
    setErrors({})
    setError('')
    setSuccess('')
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    const nextErrors = {}

    if (!form.name.trim()) {
      nextErrors.name = 'El nombre es obligatorio.'
    }

    if (!form.brand.trim()) {
      nextErrors.brand = 'La marca es obligatoria.'
    }

    const priceError = validatePrice(form.price)

    if (priceError) {
      nextErrors.price = priceError
    }

    const stockError = validateStock(form.stock)

    if (stockError) {
      nextErrors.stock = stockError
    }

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors)
      return
    }

    setSaving(true)
    setError('')
    setSuccess('')

    const data = {
      name: form.name.trim(),
      brand: form.brand.trim(),
      category: form.category,
      price: Number(form.price),
      stock: Number(form.stock),
      image: form.image,
    }

    try {
      if (editingId) {
        await updatePerfume(editingId, data)
        setSuccess('Perfume actualizado correctamente.')
      } else {
        await createPerfume(data)
        setSuccess('Perfume registrado correctamente.')
      }

      resetForm()
      await refresh()
    } catch {
      setError('Ocurrió un error inesperado. Inténtalo de nuevo más tarde.')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!deleting) {
      return
    }

    setDeletingLoading(true)
    setError('')
    setSuccess('')

    try {
      await deletePerfume(deleting.id)
      setSuccess(`«${deleting.name}» se eliminó correctamente.`)
      setDeleting(null)
      await refresh()
    } catch (err) {
      setError(
        err.message === 'ventas'
          ? `No se puede eliminar «${deleting.name}»: tiene ventas registradas.`
          : 'Ocurrió un error inesperado. Inténtalo de nuevo más tarde.',
      )
      setDeleting(null)
    } finally {
      setDeletingLoading(false)
    }
  }

  return (
    <div className="mx-auto w-full max-w-7xl">
      <p className="text-xs font-semibold uppercase tracking-[0.3em] text-eyebrow">
        Administrador
      </p>
      <h1 className="mt-2 font-serif text-3xl font-bold text-ink sm:text-4xl">
        Registro de perfumes
      </h1>
      <p className="mt-2 text-sm text-muted">
        Crea, edita y elimina los perfumes que se muestran en el catálogo.
      </p>

      {error ? (
        <div className="mt-4">
          <Banner type="error">{error}</Banner>
        </div>
      ) : null}
      {success ? (
        <div className="mt-4">
          <Banner type="success">{success}</Banner>
        </div>
      ) : null}

      <div className="mt-6 grid gap-6 xl:grid-cols-[1fr_1.3fr]">
        <Card className="h-fit min-w-0 p-6 sm:p-6">
          <h2 className="font-serif text-xl font-bold text-ink">
            {editingId ? 'Editar perfume' : 'Nuevo perfume'}
          </h2>

          <form noValidate onSubmit={handleSubmit} className="mt-4 space-y-4">
            <Field
              id="perfume-name"
              label="Nombre"
              value={form.name}
              onChange={(event) => updateField('name', event.target.value)}
              error={errors.name}
              valid={Boolean(form.name.trim()) && !errors.name}
              validMessage="Nombre válido"
              hint="Nombre comercial del perfume."
              required
            />

            <Field
              id="perfume-brand"
              label="Marca"
              value={form.brand}
              onChange={(event) => updateField('brand', event.target.value)}
              error={errors.brand}
              valid={Boolean(form.brand.trim()) && !errors.brand}
              validMessage="Marca válida"
              hint="Marca o casa del perfume."
              required
            />

            <Field
              id="perfume-category"
              label="Categoría"
              as="select"
              value={form.category}
              onChange={(event) => updateField('category', event.target.value)}
              options={CATEGORY_OPTIONS}
              required
            />

            <div className="grid gap-4 sm:grid-cols-2">
              <Field
                id="perfume-price"
                label="Precio (S/)"
                type="number"
                min="0.01"
                step="0.01"
                value={form.price}
                onChange={(event) => updateField('price', event.target.value)}
                error={errors.price}
                valid={form.price !== '' && !validatePrice(form.price) && !errors.price}
                validMessage="Precio válido"
                hint="Debe ser mayor que 0."
                required
              />

              <Field
                id="perfume-stock"
                label="Stock"
                type="number"
                min="0"
                step="1"
                value={form.stock}
                onChange={(event) => updateField('stock', event.target.value)}
                error={errors.stock}
                valid={form.stock !== '' && !validateStock(form.stock) && !errors.stock}
                validMessage="Stock válido"
                hint="No puede ser negativo."
                required
              />
            </div>

            <div>
              <label
                htmlFor="perfume-photo"
                className="block text-sm font-medium text-ink"
              >
                Foto (opcional)
              </label>
              <input
                id="perfume-photo"
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={handleImage}
                className="mt-1.5 block w-full rounded-xl border-[1.5px] border-line bg-card px-4 py-3 text-sm text-ink file:mr-3 file:rounded-lg file:border-0 file:bg-surface file:px-3 file:py-2 file:text-sm file:font-semibold file:text-ink focus:outline-none focus:ring-4 focus:ring-surface"
              />
              <p className="mt-1.5 text-sm text-muted">
                JPG, PNG o WEBP de máximo 2 MB.
              </p>
              {form.image ? (
                <img
                  src={form.image}
                  alt="Vista previa del perfume"
                  className="mt-3 h-24 w-24 rounded-xl border border-line object-contain"
                />
              ) : null}
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Button
                type="submit"
                loading={saving}
                loadingText="Guardando…"
                className="w-full"
              >
                {editingId ? 'Guardar cambios' : 'Registrar perfume'}
              </Button>
              {editingId ? (
                <Button
                  variant="ghost"
                  onClick={resetForm}
                  className="w-full sm:w-auto"
                >
                  Cancelar
                </Button>
              ) : null}
            </div>
          </form>
        </Card>

        <div className="min-w-0">
          <h2 className="font-serif text-xl font-bold text-ink">
            Perfumes registrados
          </h2>
          <div className="mt-3">
            <Table
              head={[
                'Foto',
                'Perfume',
                'Marca',
                'Categoría',
                'Precio',
                'Stock',
                'Acciones',
              ]}
            >
              {products.map((product) => (
                <tr key={product.id} className="text-ink">
                  <td className="px-4 py-3">
                    <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-surface">
                      {product.image ? (
                        <img
                          src={product.image}
                          alt={product.name}
                          className="h-12 w-auto object-contain"
                        />
                      ) : (
                        <BottleArt
                          tone={product.tone}
                          label={product.name}
                          className="h-12 w-auto"
                        />
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3 font-semibold">{product.name}</td>
                  <td className="px-4 py-3">{product.brand}</td>
                  <td className="px-4 py-3">{product.category}</td>
                  <td className="px-4 py-3">{formatCurrency(product.price)}</td>
                  <td className="px-4 py-3">
                    <span
                      className={
                        product.stock <= 5
                          ? 'font-semibold text-err'
                          : 'font-semibold text-ink'
                      }
                    >
                      {product.stock}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => startEdit(product)}
                        className="min-h-11 rounded-xl px-3 text-sm font-semibold text-eyebrow transition hover:bg-surface focus:outline-none focus:ring-4 focus:ring-surface"
                      >
                        Editar
                      </button>
                      <button
                        type="button"
                        onClick={() => setDeleting(product)}
                        className="min-h-11 rounded-xl px-3 text-sm font-semibold text-err transition hover:bg-err-bg focus:outline-none focus:ring-4 focus:ring-err-bg"
                      >
                        Eliminar
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </Table>
          </div>
        </div>
      </div>

      <ConfirmDialog
        open={Boolean(deleting)}
        title={`¿Eliminar «${deleting?.name ?? ''}»?`}
        message="Esta acción no se puede deshacer. El perfume dejará de aparecer en el catálogo."
        confirmText="Sí, eliminar"
        onConfirm={handleDelete}
        onCancel={() => setDeleting(null)}
        loading={deletingLoading}
      />
    </div>
  )
}

export default Perfumes
