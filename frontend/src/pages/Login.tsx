import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { authService } from '../services/api'
import { useAuthStore } from '../store/authStore'
import toast from 'react-hot-toast'

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const { setUser } = useAuthStore()
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await authService.login(form)
      setUser(res.data)
      toast.success('Bem-vindo!')
      navigate('/')
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Erro ao fazer login')
    } finally {
      setLoading(false)
    }
  }

  const inputClass = "w-full bg-white border border-border text-ink px-4 py-3 text-sm focus:outline-none focus:border-ink transition-colors placeholder-muted"

  return (
    <main className="min-h-screen bg-bg flex items-center justify-center px-4 py-20">
      <div className="w-full max-w-sm">
        <div className="text-center mb-10">
          <Link to="/" className="font-display text-3xl text-ink tracking-widest">HAYH GANG</Link>
          <p className="text-xs text-muted uppercase tracking-widest mt-2">Entrar na conta</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="email" placeholder="E-mail" value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required className={inputClass} />
          <input type="password" placeholder="Senha" value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            required className={inputClass} />
          <button type="submit" disabled={loading}
            className="w-full bg-ink text-white py-4 text-xs uppercase tracking-widest font-medium hover:bg-accent transition-colors disabled:opacity-50">
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>
        <p className="text-center text-xs text-muted mt-6 uppercase tracking-wider">
          Não tem conta?{' '}
          <Link to="/register" className="text-ink hover:text-accent transition-colors underline">
            Cadastre-se
          </Link>
        </p>
      </div>
    </main>
  )
}
