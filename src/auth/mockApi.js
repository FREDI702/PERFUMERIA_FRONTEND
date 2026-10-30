const MOCK_USER = {
  email: 'cliente.perfumeria@gmail.com',
  password: 'Perfume2026!',
  name: 'Cliente Néctar',
  role: 'Cliente',
}

function wait(ms) {
  return new Promise((resolve) => {
    window.setTimeout(resolve, ms)
  })
}

export async function login({ email, password }) {
  await wait(700)

  const normalizedEmail = email.trim().toLowerCase()

  if (normalizedEmail !== MOCK_USER.email || password !== MOCK_USER.password) {
    throw new Error('credenciales')
  }

  return {
    email: MOCK_USER.email,
    name: MOCK_USER.name,
    role: MOCK_USER.role,
    token: 'token-simulado',
  }
}
