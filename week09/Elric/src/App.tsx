import { useEffect } from 'react'
import { type CartItem } from './constants/cartItems'
import { useCartStore } from './stores/useCartStore'

const formatPrice = (value: number) => `₩${value.toLocaleString('ko-KR')}`

function App() {
  const {
    cartItems,
    amount,
    total,
    isModalOpen,
    increase,
    decrease,
    removeItem,
    clearCart,
    calculateTotals,
    openModal,
    closeModal,
  } = useCartStore()

  useEffect(() => {
    calculateTotals()
  }, [cartItems, calculateTotals])

  const hasItems = cartItems.length > 0

  return (
    <div className="min-h-screen bg-slate-100 px-4 py-10">
      <div className="mx-auto flex max-w-4xl flex-col overflow-hidden rounded-2xl bg-white shadow">
        <header className="flex items-center justify-between bg-slate-900 px-6 py-4 text-white">
          <h1 className="text-2xl font-bold">Ohtani Ahn</h1>
          <div className="flex items-center gap-2 text-lg font-semibold">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="h-6 w-6"
            >
              <path d="M8.25 20.25a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Zm10.5 0a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Zm-12-4.5a.75.75 0 0 1-.728-.568l-2.25-9a.75.75 0 0 1 .728-.932H20.25a.75.75 0 0 1 .728.932l-1.5 6a.75.75 0 0 1-.728.568H7.53l.375 1.5h10.845a.75.75 0 0 1 0 1.5H6.75Z" />
            </svg>
            <span>{amount}</span>
          </div>
        </header>

        <section className="divide-y divide-slate-200">
          {hasItems ? (
            cartItems.map((item: CartItem) => (
              <article key={item.id} className="flex items-center gap-4 px-6 py-4">
                <img src={item.img} alt={item.title} className="h-20 w-20 rounded-lg object-cover shadow-sm" />
                <div className="flex flex-1 flex-col gap-1">
                  <p className="text-lg font-semibold leading-tight">{item.title}</p>
                  <p className="text-sm text-slate-500">{item.singer}</p>
                  <p className="text-base font-bold text-slate-800">{formatPrice(item.price)}</p>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    aria-label={`${item.title} 수량 감소`}
                    onClick={() => decrease(item.id)}
                    className="h-8 w-8 rounded bg-slate-200 text-lg font-semibold text-slate-700 transition hover:bg-slate-300"
                  >
                    −
                  </button>
                  <span className="min-w-[2.5rem] text-center text-base font-semibold text-slate-800">
                    {item.amount}
                  </span>
                  <button
                    aria-label={`${item.title} 수량 증가`}
                    onClick={() => increase(item.id)}
                    className="h-8 w-8 rounded bg-slate-200 text-lg font-semibold text-slate-700 transition hover:bg-slate-300"
                  >
                    +
                  </button>
                </div>
                <button
                  onClick={() => removeItem(item.id)}
                  className="text-xs font-medium uppercase tracking-wide text-slate-400 transition hover:text-rose-500"
                >
                  삭제
                </button>
              </article>
            ))
          ) : (
            <div className="px-6 py-12 text-center text-slate-500">장바구니가 비어 있습니다.</div>
          )}
        </section>

        <div className="border-t border-slate-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <p className="text-base font-semibold text-slate-700">총 금액</p>
            <p className="text-xl font-bold text-slate-900">{formatPrice(total)}</p>
          </div>
        </div>

        <div className="flex items-center justify-center border-t border-slate-200 bg-slate-50 px-6 py-6">
            <button
              onClick={() => openModal()}
              disabled={!hasItems}
              className="rounded border border-slate-800 px-5 py-2 text-sm font-semibold text-slate-800 transition enabled:hover:bg-slate-900 enabled:hover:text-white disabled:cursor-not-allowed disabled:border-slate-300 disabled:text-slate-300"
            >
              전체 삭제
            </button>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm">
          <div className="rounded-xl bg-white p-6 shadow-2xl">
            <p className="text-center text-lg font-semibold text-slate-900">정말 삭제하시겠습니까?</p>
            <div className="mt-5 flex justify-center gap-3">
              <button
                onClick={() => closeModal()}
                className="rounded bg-slate-200 px-5 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-300"
              >
                아니요
              </button>
              <button
                onClick={() => {
                  clearCart()
                  closeModal()
                }}
                className="rounded bg-rose-500 px-5 py-2 text-sm font-semibold text-white transition hover:bg-rose-600"
              >
                네
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default App
