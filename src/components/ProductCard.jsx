import BottleArt from './BottleArt.jsx'
import Button from './Button.jsx'
import { formatCurrency } from '../utils/format.js'

function ProductCard({ product, onAdd }) {
  const outOfStock = product.stock <= 0
  const lowStock = product.stock > 0 && product.stock <= 5

  return (
    <article className="flex flex-col rounded-3xl border border-line bg-card p-4 shadow-sm">
      <div className="relative flex h-44 items-center justify-center rounded-2xl bg-surface">
        {lowStock ? (
          <span className="absolute left-3 top-3 rounded-full bg-err-bg px-2 py-1 text-xs font-semibold text-err">
            Últimas unidades
          </span>
        ) : null}
        {outOfStock ? (
          <span className="absolute left-3 top-3 rounded-full bg-line px-2 py-1 text-xs font-semibold text-muted">
            Agotado
          </span>
        ) : null}

        {product.image ? (
          <img
            src={product.image}
            alt={product.name}
            loading="lazy"
            className="h-36 w-auto object-contain"
          />
        ) : (
          <div className="flex flex-col items-center">
            <BottleArt
              tone={product.tone}
              label={`Sin foto de ${product.name}`}
              className="h-32 w-auto"
            />
            <span className="text-xs font-medium text-muted">Sin foto</span>
          </div>
        )}
      </div>

      <p className="mt-4 text-xs font-semibold uppercase tracking-[0.18em] text-eyebrow">
        {product.brand}
      </p>
      <h3 className="mt-1 font-serif text-lg font-bold text-ink">{product.name}</h3>
      <p className="text-sm text-muted">
        {product.presentation} · {product.category}
      </p>

      <div className="mt-auto flex items-end justify-between gap-3 pt-4">
        <div>
          <p className="text-lg font-bold text-ink">{formatCurrency(product.price)}</p>
          <p className="text-xs text-muted">{product.stock} disponibles</p>
        </div>
        {onAdd ? (
          <Button
            variant="primary"
            onClick={() => onAdd(product)}
            disabled={outOfStock}
            className="w-auto px-4 text-sm"
          >
            Agregar
          </Button>
        ) : null}
      </div>
    </article>
  )
}

export default ProductCard
