import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { ArrowLeft, ShoppingBag } from 'lucide-react'
import { useCartStore } from '../store/cartStore'
import { useAuthStore } from '../store/authStore'
import { orderService } from '../services/api'
import toast from 'react-hot-toast'

export default function Checkout() {
  const navigate = useNavigate()
  const { items, total, clearCart } = useCartStore()
  const { user } = useAuthStore()
  const [loading, setLoading] = useState(false)
  const [step, setStep] = useState<'address' | 'confirm'>('address')
  const totalValue = total()
  const freeShipping = totalValue >= 299
  const shipping = freeShipping ? 0 : 19.9
  const finalTotal = totalValue + shipping

  const [form, setForm] = useState({
    name: user?.name || '', street: '', number: '', complement: '',
    neighborhood: '', city: '', state: '', zipCode: '',
  })

  if (items.length === 0) { navigate('/shop'); return null }
  if (!user) { navigate('/login'); return null }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async () => {
    setLoading(true)
    try {
      await orderService.create({
        items: items.map((i) => ({
          product: i.product._id, name: i.product.name,
          image: i.product.images[0], price: i.product.price,
          size: i.size, quantity: i.quantity,
        })),
        shippingAddress: form, total: finalTotal, paymentMethod: 'pix',
      })
      clearCart()
      toast.success('Pedido realizado!')
      navigate('/')
    } catch {
      toast.error('Erro ao finalizar pedido')
    } finally { setLoading(false) }
  }

  const inputClass = "w-full bg-white border border-border text-ink px-4 py-3 text-sm focus:outline-none focus:border-ink transition-colors placeholder-muted"
  const labelClass = "block text-[11px] text-muted uppercase tracking-wider mb-1.5"

  return (
    <main className="min-h-screen bg-bg">
      <div className="max-w-5xl mx-auto px-4 md:px-8 py-10">

        <div className="flex items-center gap-4 mb-10">
          <button onClick={() => step === 'confirm' ? setStep('address') : navigate(-1)}
            className="text-muted hover:text-ink transition-colors"><ArrowLeft size={18} /></button>
          <h1 className="font-display text-4xl md:text-5xl text-ink">
            {step === 'address' ? 'ENDEREÇO' : 'CONFIRMAR'}
          </h1>
        </div>

        {/* Steps */}
        <div className="flex items-center gap-3 mb-10">
          {['Endereço', 'Confirmação'].map((s, i) => (
            <div key={s} className="flex items-center gap-3">
              <div className={`w-6 h-6 flex items-center justify-center text-[11px] font-bold transition-colors ${
                (i === 0 && step === 'address') || (i === 1 && step === 'confirm') ? 'bg-ink text-white'
                : i === 0 && step === 'confirm' ? 'bg-green-600 text-white' : 'bg-border text-muted'
              }`}>{i === 0 && step === 'confirm' ? '✓' : i + 1}</div>
              <span className={`text-[11px] uppercase tracking-wider ${
                (i === 0 && step === 'address') || (i === 1 && step === 'confirm') ? 'text-ink' : 'text-muted'
              }`}>{s}</span>
              {i === 0 && <div className="w-8 h-px bg-border" />}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
          <div className="lg:col-span-3">
            {step === 'address' && (
              <form onSubmit={(e) => { e.preventDefault(); setStep('confirm') }} className="space-y-4">
                <div><label className={labelClass}>Nome completo</label>
                  <input name="name" value={form.name} onChange={handleChange} required className={inputClass} /></div>
                <div><label className={labelClass}>CEP</label>
                  <input name="zipCode" value={form.zipCode} onChange={handleChange} required className={inputClass} placeholder="00000-000" /></div>
                <div className="grid grid-cols-3 gap-3">
                  <div className="col-span-2"><label className={labelClass}>Rua</label>
                    <input name="street" value={form.street} onChange={handleChange} required className={inputClass} /></div>
                  <div><label className={labelClass}>Número</label>
                    <input name="number" value={form.number} onChange={handleChange} required className={inputClass} /></div>
                </div>
                <div><label className={labelClass}>Complemento <span className="text-muted/50">(opcional)</span></label>
                  <input name="complement" value={form.complement} onChange={handleChange} className={inputClass} /></div>
                <div><label className={labelClass}>Bairro</label>
                  <input name="neighborhood" value={form.neighborhood} onChange={handleChange} required className={inputClass} /></div>
                <div className="grid grid-cols-2 gap-3">
                  <div><label className={labelClass}>Cidade</label>
                    <input name="city" value={form.city} onChange={handleChange} required className={inputClass} /></div>
                  <div><label className={labelClass}>Estado</label>
                    <input name="state" value={form.state} onChange={handleChange} required className={inputClass} maxLength={2} /></div>
                </div>
                <button type="submit"
                  className="w-full bg-ink text-white py-4 text-xs uppercase tracking-widest hover:bg-accent transition-colors mt-2">
                  Continuar
                </button>
              </form>
            )}

            {step === 'confirm' && (
              <div className="space-y-4">
                <div className="bg-white border border-border p-5">
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-[11px] text-muted uppercase tracking-wider">Endereço</p>
                    <button onClick={() => setStep('address')} className="text-[11px] text-accent hover:underline uppercase tracking-wider">Editar</button>
                  </div>
                  <p className="text-sm text-ink">{form.name}</p>
                  <p className="text-sm text-muted mt-1">{form.street}, {form.number} — {form.neighborhood}<br />{form.city}/{form.state} — CEP {form.zipCode}</p>
                </div>
                <div className="bg-white border border-border p-5">
                  <p className="text-[11px] text-muted uppercase tracking-wider mb-3">Pagamento</p>
                  <div className="flex items-center gap-3">
                    <span className="bg-accent text-white text-[10px] font-bold px-2 py-1">PIX</span>
                    <div>
                      <p className="text-sm text-ink">Pagamento via PIX</p>
                      <p className="text-[11px] text-muted">5% de desconto · Instruções após confirmação</p>
                    </div>
                  </div>
                </div>
                <div className="bg-white border border-border p-4 flex items-center gap-3">
                  <span className="text-lg">💬</span>
                  <div className="flex-1">
                    <p className="text-sm text-ink">Prefere pelo WhatsApp?</p>
                    <p className="text-[11px] text-muted">Finalize direto com a gente</p>
                  </div>
                  <a href="https://wa.me/7192055641" target="_blank" rel="noreferrer"
                    className="text-[11px] text-accent uppercase tracking-wider hover:underline">Abrir →</a>
                </div>
                <button onClick={handleSubmit} disabled={loading}
                  className="w-full bg-ink text-white py-4 text-xs uppercase tracking-widest hover:bg-accent transition-colors disabled:opacity-50">
                  {loading ? 'Processando...' : 'Confirmar Pedido'}
                </button>
              </div>
            )}
          </div>

          {/* Summary */}
          <div className="lg:col-span-2">
            <div className="bg-white border border-border p-5 sticky top-24">
              <div className="flex items-center gap-2 mb-5">
                <ShoppingBag size={14} className="text-muted" />
                <p className="text-[11px] text-muted uppercase tracking-wider">Resumo</p>
              </div>
              <div className="space-y-3 mb-5">
                {items.map((item) => (
                  <div key={`${item.product._id}-${item.size}`} className="flex gap-3">
                    <div className="w-12 h-14 bg-card flex-shrink-0 overflow-hidden">
                      <img src={item.product.images[0] || ''} alt={item.product.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-ink truncate">{item.product.name}</p>
                      <p className="text-[11px] text-muted">Tam: {item.size} × {item.quantity}</p>
                      <p className="text-xs font-semibold text-ink mt-0.5">R$ {(item.product.price * item.quantity).toFixed(2).replace('.', ',')}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="space-y-2 border-t border-border pt-4">
                <div className="flex justify-between text-xs">
                  <span className="text-muted uppercase tracking-wider">Subtotal</span>
                  <span className="text-ink">R$ {totalValue.toFixed(2).replace('.', ',')}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-muted uppercase tracking-wider">Frete</span>
                  <span className={freeShipping ? 'text-green-600 uppercase tracking-wider' : 'text-ink'}>
                    {freeShipping ? 'Grátis' : `R$ ${shipping.toFixed(2).replace('.', ',')}`}
                  </span>
                </div>
                <div className="flex justify-between pt-3 border-t border-border">
                  <span className="text-xs text-ink uppercase tracking-wider font-medium">Total</span>
                  <span className="font-display text-xl text-ink">R$ {finalTotal.toFixed(2).replace('.', ',')}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
