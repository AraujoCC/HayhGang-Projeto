import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { authService } from '../services/api'
import { useAuthStore } from '../store/authStore'
import toast from 'react-hot-toast'

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const { setUser } = useAuthStore()
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (form.password.length < 6) { toast.error('Senha deve ter pelo menos 6 caracteres'); return }
    setLoading(true)
    try {
      const res = await authService.register(form)
      setUser(res.data)
      toast.success('Conta criada!')
      navigate('/')
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Erro ao criar conta')
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
          <p className="text-xs text-muted uppercase tracking-widest mt-2">Criar conta</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="text" placeholder="Nome completo" value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required className={inputClass} />
          <input type="email" placeholder="E-mail" value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required className={inputClass} />
          <input type="password" placeholder="Senha (mín. 6 caracteres)" value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            required className={inputClass} />
          <button type="submit" disabled={loading}
            className="w-full bg-ink text-white py-4 text-xs uppercase tracking-widest font-medium hover:bg-accent transition-colors disabled:opacity-50">
            {loading ? 'Criando...' : 'Criar Conta'}
          </button>
        </form>
        <p className="text-center text-xs text-muted mt-6 uppercase tracking-wider">
          Já tem conta?{' '}
          <Link to="/login" className="text-ink hover:text-accent transition-colors underline">
            Entrar
          </Link>
        </p>
      </div>
    </main>
  )
}
