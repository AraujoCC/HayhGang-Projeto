import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { ArrowLeft, ShoppingBag, ChevronRight, Check, Copy, QrCode, Truck, Shield, RotateCcw, ChevronDown, ChevronUp } from 'lucide-react'
import { useCartStore } from '../store/cartStore'
import { useAuthStore } from '../store/authStore'
import { orderService } from '../services/api'
import toast from 'react-hot-toast'

const STEPS = ['Identificação', 'Entrega', 'Pagamento', 'Confirmação']

const PIX_KEY = '71992055641'

export default function Checkout() {
  const navigate = useNavigate()
  const { items, total, clearCart } = useCartStore()
  const { user } = useAuthStore()
  const totalValue = total()
  const freeShipping = totalValue >= 299
  const shipping = freeShipping ? 0 : 19.9
  const pix5off = totalValue * 0.05
  const finalTotal = totalValue + shipping
  const finalTotalPix = finalTotal - pix5off

  const [step, setStep] = useState(0)
  const [paymentMethod, setPaymentMethod] = useState<'pix' | 'cartao'>('pix')
  const [loading, setLoading] = useState(false)
  const [orderDone, setOrderDone] = useState(false)
  const [summaryOpen, setSummaryOpen] = useState(false)
  const [pixCopied, setPixCopied] = useState(false)

  const [form, setForm] = useState({
    name: user?.name || '',
    email: '',
    cpf: '',
    phone: '',
    zipCode: '',
    street: '',
    number: '',
    complement: '',
    neighborhood: '',
    city: '',
    state: '',
    cardName: '',
    cardNumber: '',
    cardExpiry: '',
    cardCvv: '',
    installments: '1',
  })

  if (items.length === 0 && !orderDone) { navigate('/shop'); return null }
  if (!user) { navigate('/login'); return null }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async () => {
    setLoading(true)
    try {
      await orderService.create({
        items: items.map((i) => ({
          product: i.product._id,
          name: i.product.name,
          image: i.product.images[0],
          price: i.product.price,
          size: i.size,
          quantity: i.quantity,
        })),
        shippingAddress: {
          name: form.name,
          street: form.street,
          number: form.number,
          complement: form.complement,
          neighborhood: form.neighborhood,
          city: form.city,
          state: form.state,
          zipCode: form.zipCode,
        },
        total: paymentMethod === 'pix' ? finalTotalPix : finalTotal,
        paymentMethod,
      })
      clearCart()
      setOrderDone(true)
      setStep(3)
    } catch {
      toast.error('Erro ao finalizar pedido')
    } finally {
      setLoading(false)
    }
  }

  const copyPix = () => {
    navigator.clipboard.writeText(PIX_KEY)
    setPixCopied(true)
    setTimeout(() => setPixCopied(false), 3000)
    toast.success('Chave PIX copiada!')
  }

  const inputClass = "w-full bg-white border border-[#E0DFD9] text-[#1A1A1A] px-4 py-3 text-sm focus:outline-none focus:border-[#1A1A1A] transition-colors placeholder-[#BBBBB5]"
  const labelClass = "block text-[11px] text-[#888880] uppercase tracking-widest mb-1.5 font-medium"

  const stepValid = () => {
    if (step === 0) return form.name && form.email
    if (step === 1) return form.street && form.number && form.city && form.state && form.zipCode
    if (step === 2) return paymentMethod === 'pix' || (form.cardNumber && form.cardName && form.cardExpiry && form.cardCvv)
    return true
  }

  // ─── ORDER DONE ───────────────────────────────────────────────
  if (orderDone) return (
    <main className="min-h-screen bg-[#F5F4F0] flex items-center justify-center px-4 py-20">
      <div className="w-full max-w-md text-center">
        <div className="w-16 h-16 bg-[#1A1A1A] rounded-full flex items-center justify-center mx-auto mb-6">
          <Check size={28} className="text-white" />
        </div>
        <h1 className="font-display text-5xl text-[#1A1A1A] tracking-widest mb-3">PEDIDO FEITO!</h1>
        <p className="text-[#888880] text-sm mb-8 uppercase tracking-wider">
          Obrigado, {form.name.split(' ')[0]}! Seu pedido foi recebido.
        </p>

        {paymentMethod === 'pix' && (
          <div className="bg-white border border-[#E0DFD9] p-6 mb-6 text-left">
            <div className="flex items-center gap-2 mb-4">
              <QrCode size={18} className="text-[#FF3B00]" />
              <p className="text-xs text-[#1A1A1A] uppercase tracking-widest font-medium">Pagamento PIX</p>
            </div>
            <p className="text-xs text-[#888880] uppercase tracking-wider mb-3">
              Valor a pagar (com 5% de desconto):
            </p>
            <p className="font-display text-3xl text-[#1A1A1A] mb-5">
              R$ {finalTotalPix.toFixed(2).replace('.', ',')}
            </p>
            <p className="text-xs text-[#888880] uppercase tracking-wider mb-2">Chave PIX (telefone):</p>
            <div className="flex items-center gap-2 bg-[#F5F4F0] px-4 py-3 mb-4">
              <span className="flex-1 text-sm font-mono text-[#1A1A1A]">{PIX_KEY}</span>
              <button onClick={copyPix} className="text-[#888880] hover:text-[#FF3B00] transition-colors">
                {pixCopied ? <Check size={16} className="text-green-600" /> : <Copy size={16} />}
              </button>
            </div>
            <p className="text-[11px] text-[#888880] leading-relaxed">
              Após o pagamento, envie o comprovante no WhatsApp:{' '}
              <a href="https://wa.me/7192055641" className="text-[#1A1A1A] underline" target="_blank" rel="noreferrer">
                +55 71 9 9205-5641
              </a>
            </p>
          </div>
        )}

        <div className="space-y-3">
          <a href="https://wa.me/7192055641" target="_blank" rel="noreferrer"
            className="w-full bg-[#1A1A1A] text-white py-4 text-xs uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-[#FF3B00] transition-colors">
            💬 Enviar Comprovante no WhatsApp
          </a>
          <Link to="/shop"
            className="w-full border border-[#E0DFD9] text-[#888880] py-4 text-xs uppercase tracking-widest flex items-center justify-center hover:border-[#1A1A1A] hover:text-[#1A1A1A] transition-colors">
            Continuar Comprando
          </Link>
        </div>
      </div>
    </main>
  )

  return (
    <main className="min-h-screen bg-[#F5F4F0]">

      {/* Header */}
      <div className="bg-white border-b border-[#E0DFD9] sticky top-0 z-20">
        <div className="max-w-6xl mx-auto px-4 md:px-8 py-4 flex items-center justify-between">
          <Link to="/" className="font-display text-2xl text-[#1A1A1A] tracking-widest">HAYH GANG</Link>
          <div className="hidden md:flex items-center gap-0">
            {STEPS.map((s, i) => (
              <div key={s} className="flex items-center">
                <div className="flex items-center gap-2 px-4">
                  <div className={`w-5 h-5 flex items-center justify-center text-[10px] font-bold transition-all ${i < step ? 'bg-green-600 text-white' :
                      i === step ? 'bg-[#1A1A1A] text-white' :
                        'bg-[#E0DFD9] text-[#888880]'
                    }`}>
                    {i < step ? <Check size={10} /> : i + 1}
                  </div>
                  <span className={`text-[11px] uppercase tracking-widest transition-all ${i === step ? 'text-[#1A1A1A]' : 'text-[#888880]'
                    }`}>{s}</span>
                </div>
                {i < STEPS.length - 1 && <ChevronRight size={12} className="text-[#E0DFD9]" />}
              </div>
            ))}
          </div>
          <div className="md:hidden text-[11px] text-[#888880] uppercase tracking-wider">
            Etapa {step + 1} de {STEPS.length}
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 md:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">

          {/* ─── FORM ──────────────────────────────── */}
          <div className="lg:col-span-3 space-y-6">

            {/* STEP 0 — IDENTIFICAÇÃO */}
            {step === 0 && (
              <div className="bg-white border border-[#E0DFD9] p-6 md:p-8">
                <h2 className="font-display text-2xl text-[#1A1A1A] tracking-widest mb-6">IDENTIFICAÇÃO</h2>
                <div className="space-y-4">
                  <div>
                    <label className={labelClass}>Nome Completo *</label>
                    <input name="name" value={form.name} onChange={handleChange} required className={inputClass} placeholder="Seu nome completo" />
                  </div>
                  <div>
                    <label className={labelClass}>E-mail *</label>
                    <input name="email" type="email" value={form.email} onChange={handleChange} required className={inputClass} placeholder="seu@email.com" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className={labelClass}>CPF</label>
                      <input name="cpf" value={form.cpf} onChange={handleChange} className={inputClass} placeholder="000.000.000-00" />
                    </div>
                    <div>
                      <label className={labelClass}>Telefone</label>
                      <input name="phone" value={form.phone} onChange={handleChange} className={inputClass} placeholder="(71) 99999-9999" />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 1 — ENTREGA */}
            {step === 1 && (
              <div className="bg-white border border-[#E0DFD9] p-6 md:p-8">
                <h2 className="font-display text-2xl text-[#1A1A1A] tracking-widest mb-6">ENDEREÇO DE ENTREGA</h2>
                <div className="space-y-4">
                  <div>
                    <label className={labelClass}>CEP *</label>
                    <input name="zipCode" value={form.zipCode} onChange={handleChange} required className={inputClass} placeholder="00000-000" />
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    <div className="col-span-2">
                      <label className={labelClass}>Rua *</label>
                      <input name="street" value={form.street} onChange={handleChange} required className={inputClass} placeholder="Nome da rua" />
                    </div>
                    <div>
                      <label className={labelClass}>Número *</label>
                      <input name="number" value={form.number} onChange={handleChange} required className={inputClass} placeholder="123" />
                    </div>
                  </div>
                  <div>
                    <label className={labelClass}>Complemento <span className="text-[#BBBBB5]">(opcional)</span></label>
                    <input name="complement" value={form.complement} onChange={handleChange} className={inputClass} placeholder="Apto, bloco..." />
                  </div>
                  <div>
                    <label className={labelClass}>Bairro *</label>
                    <input name="neighborhood" value={form.neighborhood} onChange={handleChange} required className={inputClass} />
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    <div className="col-span-2">
                      <label className={labelClass}>Cidade *</label>
                      <input name="city" value={form.city} onChange={handleChange} required className={inputClass} />
                    </div>
                    <div>
                      <label className={labelClass}>UF *</label>
                      <input name="state" value={form.state} onChange={handleChange} required maxLength={2} className={inputClass} placeholder="BA" />
                    </div>
                  </div>
                </div>

                {/* Frete */}
                <div className="mt-6 pt-6 border-t border-[#E0DFD9]">
                  <p className="text-[11px] text-[#888880] uppercase tracking-widest mb-3">Opção de Frete</p>
                  <div className={`flex items-center justify-between p-4 border-2 transition-all ${freeShipping ? 'border-green-600 bg-green-50' : 'border-[#1A1A1A]'}`}>
                    <div className="flex items-center gap-3">
                      <Truck size={16} className={freeShipping ? 'text-green-600' : 'text-[#1A1A1A]'} />
                      <div>
                        <p className="text-xs text-[#1A1A1A] uppercase tracking-wider font-medium">Entrega Padrão</p>
                        <p className="text-[11px] text-[#888880]">5 a 10 dias úteis</p>
                      </div>
                    </div>
                    <span className={`text-sm font-bold ${freeShipping ? 'text-green-600' : 'text-[#1A1A1A]'}`}>
                      {freeShipping ? 'GRÁTIS' : `R$ ${shipping.toFixed(2).replace('.', ',')}`}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 2 — PAGAMENTO */}
            {step === 2 && (
              <div className="bg-white border border-[#E0DFD9] p-6 md:p-8">
                <h2 className="font-display text-2xl text-[#1A1A1A] tracking-widest mb-6">PAGAMENTO</h2>

                {/* Method selector */}
                <div className="grid grid-cols-2 gap-3 mb-6">
                  {(['pix', 'cartao'] as const).map((m) => (
                    <button key={m} type="button" onClick={() => setPaymentMethod(m)}
                      className={`p-4 border-2 text-left transition-all ${paymentMethod === m ? 'border-[#1A1A1A] bg-[#F5F4F0]' : 'border-[#E0DFD9] bg-white hover:border-[#BBBBB5]'}`}>
                      <p className="text-xs uppercase tracking-widest font-bold text-[#1A1A1A] mb-0.5">
                        {m === 'pix' ? '⚡ PIX' : '💳 Cartão'}
                      </p>
                      <p className="text-[11px] text-[#888880]">
                        {m === 'pix' ? '5% de desconto' : 'Até 3x sem juros'}
                      </p>
                    </button>
                  ))}
                </div>

                {/* PIX */}
                {paymentMethod === 'pix' && (
                  <div className="bg-[#F5F4F0] p-5 border border-[#E0DFD9]">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 bg-[#1A1A1A] flex items-center justify-center flex-shrink-0">
                        <QrCode size={18} className="text-white" />
                      </div>
                      <div>
                        <p className="text-xs uppercase tracking-wider font-bold text-[#1A1A1A]">Pagamento via PIX</p>
                        <p className="text-[11px] text-[#888880]">A chave será exibida após confirmar</p>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs">
                        <span className="text-[#888880] uppercase tracking-wider">Subtotal</span>
                        <span>R$ {totalValue.toFixed(2).replace('.', ',')}</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-[#888880] uppercase tracking-wider">Frete</span>
                        <span className={freeShipping ? 'text-green-600' : ''}>{freeShipping ? 'Grátis' : `R$ ${shipping.toFixed(2).replace('.', ',')}`}</span>
                      </div>
                      <div className="flex justify-between text-xs text-green-600 font-medium">
                        <span className="uppercase tracking-wider">Desconto PIX (5%)</span>
                        <span>- R$ {pix5off.toFixed(2).replace('.', ',')}</span>
                      </div>
                      <div className="flex justify-between pt-3 border-t border-[#E0DFD9]">
                        <span className="text-xs uppercase tracking-wider font-bold text-[#1A1A1A]">Total PIX</span>
                        <span className="font-display text-xl text-[#FF3B00]">R$ {finalTotalPix.toFixed(2).replace('.', ',')}</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* CARTÃO */}
                {paymentMethod === 'cartao' && (
                  <div className="space-y-4">
                    <div>
                      <label className={labelClass}>Nome no Cartão *</label>
                      <input name="cardName" value={form.cardName} onChange={handleChange} className={inputClass} placeholder="Como está no cartão" />
                    </div>
                    <div>
                      <label className={labelClass}>Número do Cartão *</label>
                      <input name="cardNumber" value={form.cardNumber} onChange={handleChange} className={inputClass} placeholder="0000 0000 0000 0000" maxLength={19} />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className={labelClass}>Validade *</label>
                        <input name="cardExpiry" value={form.cardExpiry} onChange={handleChange} className={inputClass} placeholder="MM/AA" maxLength={5} />
                      </div>
                      <div>
                        <label className={labelClass}>CVV *</label>
                        <input name="cardCvv" value={form.cardCvv} onChange={handleChange} className={inputClass} placeholder="123" maxLength={4} />
                      </div>
                    </div>
                    <div>
                      <label className={labelClass}>Parcelas</label>
                      <select name="installments" value={form.installments} onChange={handleChange} className={inputClass}>
                        <option value="1">1x de R$ {finalTotal.toFixed(2).replace('.', ',')} sem juros</option>
                        <option value="2">2x de R$ {(finalTotal / 2).toFixed(2).replace('.', ',')} sem juros</option>
                        <option value="3">3x de R$ {(finalTotal / 3).toFixed(2).replace('.', ',')} sem juros</option>
                      </select>
                    </div>
                    <div className="bg-[#F5F4F0] border border-[#E0DFD9] p-3 flex items-center gap-2">
                      <Shield size={14} className="text-[#888880] flex-shrink-0" />
                      <p className="text-[11px] text-[#888880] uppercase tracking-wider">Pagamento 100% seguro e criptografado</p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Navigation buttons */}
            <div className="flex gap-3">
              {step > 0 && (
                <button onClick={() => setStep(step - 1)}
                  className="flex items-center gap-2 px-6 py-4 border border-[#E0DFD9] text-[#888880] text-xs uppercase tracking-widest hover:border-[#1A1A1A] hover:text-[#1A1A1A] transition-colors">
                  <ArrowLeft size={14} />
                  Voltar
                </button>
              )}
              {step < 2 && (
                <button onClick={() => stepValid() && setStep(step + 1)}
                  disabled={!stepValid()}
                  className="flex-1 bg-[#1A1A1A] text-white py-4 text-xs uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-[#FF3B00] transition-colors disabled:opacity-40 disabled:cursor-not-allowed">
                  Continuar
                  <ChevronRight size={14} />
                </button>
              )}
              {step === 2 && (
                <button onClick={handleSubmit} disabled={loading || !stepValid()}
                  className="flex-1 bg-[#FF3B00] text-white py-4 text-xs uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-[#e03500] transition-colors disabled:opacity-40">
                  {loading ? 'Processando...' : paymentMethod === 'pix'
                    ? `Confirmar — R$ ${finalTotalPix.toFixed(2).replace('.', ',')}`
                    : `Confirmar — R$ ${finalTotal.toFixed(2).replace('.', ',')}`}
                </button>
              )}
            </div>

            {/* Garantias */}
            <div className="flex items-center justify-center gap-6 py-4">
              {[
                { icon: Shield, text: 'Compra Segura' },
                { icon: RotateCcw, text: 'Troca em 30 dias' },
                { icon: Truck, text: 'Rastreamento' },
              ].map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-center gap-1.5">
                  <Icon size={12} className="text-[#888880]" />
                  <span className="text-[10px] text-[#888880] uppercase tracking-wider">{text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* ─── RESUMO ───────────────────────────── */}
          <div className="lg:col-span-2">

            {/* Mobile toggle */}
            <button onClick={() => setSummaryOpen(!summaryOpen)}
              className="lg:hidden w-full bg-[#1A1A1A] text-white px-5 py-4 flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <ShoppingBag size={14} />
                <span className="text-xs uppercase tracking-widest">Resumo do pedido</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="font-display text-lg">R$ {(paymentMethod === 'pix' ? finalTotalPix : finalTotal).toFixed(2).replace('.', ',')}</span>
                {summaryOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
              </div>
            </button>

            <div className={`lg:block ${summaryOpen ? 'block' : 'hidden'}`}>
              <div className="bg-white border border-[#E0DFD9] sticky top-24">
                <div className="p-5 border-b border-[#E0DFD9]">
                  <p className="text-[11px] text-[#888880] uppercase tracking-widest">Resumo do pedido</p>
                </div>

                {/* Items */}
                <div className="p-5 space-y-4 max-h-64 overflow-y-auto">
                  {items.map((item) => (
                    <div key={`${item.product._id}-${item.size}`} className="flex gap-3">
                      <div className="relative w-14 h-16 bg-[#F5F4F0] flex-shrink-0 overflow-hidden">
                        <img src={item.product.images[0] || ''} alt={item.product.name} className="w-full h-full object-cover" />
                        <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-[#1A1A1A] text-white text-[10px] flex items-center justify-center rounded-full font-bold">
                          {item.quantity}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-[#1A1A1A] font-medium truncate">{item.product.name}</p>
                        <p className="text-[11px] text-[#888880] uppercase tracking-wider">Tam: {item.size}</p>
                        <p className="text-xs font-bold text-[#1A1A1A] mt-0.5">
                          R$ {(item.product.price * item.quantity).toFixed(2).replace('.', ',')}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Totals */}
                <div className="p-5 border-t border-[#E0DFD9] space-y-2.5">
                  <div className="flex justify-between text-xs">
                    <span className="text-[#888880] uppercase tracking-wider">Subtotal</span>
                    <span className="text-[#1A1A1A]">R$ {totalValue.toFixed(2).replace('.', ',')}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-[#888880] uppercase tracking-wider">Frete</span>
                    <span className={freeShipping ? 'text-green-600 uppercase tracking-wider font-medium' : 'text-[#1A1A1A]'}>
                      {freeShipping ? 'Grátis' : `R$ ${shipping.toFixed(2).replace('.', ',')}`}
                    </span>
                  </div>
                  {paymentMethod === 'pix' && (
                    <div className="flex justify-between text-xs text-green-600">
                      <span className="uppercase tracking-wider">Desconto PIX</span>
                      <span>- R$ {pix5off.toFixed(2).replace('.', ',')}</span>
                    </div>
                  )}
                  <div className="flex justify-between pt-3 border-t border-[#E0DFD9] items-center">
                    <span className="text-xs uppercase tracking-wider font-bold text-[#1A1A1A]">Total</span>
                    <div className="text-right">
                      <p className="font-display text-2xl text-[#1A1A1A]">
                        R$ {(paymentMethod === 'pix' ? finalTotalPix : finalTotal).toFixed(2).replace('.', ',')}
                      </p>
                      {paymentMethod === 'cartao' && (
                        <p className="text-[10px] text-[#888880]">ou 3x de R$ {(finalTotal / 3).toFixed(2).replace('.', ',')}</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Free shipping bar */}
                {!freeShipping && (
                  <div className="px-5 pb-5">
                    <div className="bg-[#F5F4F0] p-3">
                      <div className="flex justify-between text-[10px] text-[#888880] uppercase tracking-wider mb-2">
                        <span>Frete grátis acima de R$299</span>
                        <span>R$ {(299 - totalValue).toFixed(0)} restam</span>
                      </div>
                      <div className="w-full bg-[#E0DFD9] h-1">
                        <div className="bg-[#1A1A1A] h-1 transition-all" style={{ width: `${Math.min((totalValue / 299) * 100, 100)}%` }} />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}