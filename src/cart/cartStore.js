let items = []

const listeners = new Set()

function emit() {
  listeners.forEach((listener) => listener())
}

export function subscribe(listener) {
  listeners.add(listener)

  return () => {
    listeners.delete(listener)
  }
}

export function getCartSnapshot() {
  return items
}

export function addToCart(product, quantity = 1) {
  if (product.stock <= 0) {
    return
  }

  const existing = items.find((item) => item.productId === product.id)

  if (existing) {
    const nextQuantity = Math.min(existing.quantity + quantity, product.stock)
    items = items.map((item) =>
      item.productId === product.id ? { ...item, quantity: nextQuantity } : item,
    )
  } else {
    items = [
      ...items,
      {
        productId: product.id,
        name: product.name,
        brand: product.brand,
        presentation: product.presentation,
        price: product.price,
        tone: product.tone,
        image: product.image,
        stock: product.stock,
        quantity: Math.min(quantity, product.stock),
      },
    ]
  }

  emit()
}

export function updateQuantity(productId, quantity) {
  items = items.map((item) => {
    if (item.productId !== productId) {
      return item
    }

    return {
      ...item,
      quantity: Math.max(1, Math.min(quantity, item.stock)),
    }
  })

  emit()
}

export function removeFromCart(productId) {
  items = items.filter((item) => item.productId !== productId)
  emit()
}

export function clearCart() {
  items = []
  emit()
}
