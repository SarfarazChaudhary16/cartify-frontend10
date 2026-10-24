import { Printer } from 'lucide-react'
import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'
import { formatDate, formatPrice } from '@/lib/utils'
import type { Order } from '@/types'

export function InvoiceModal({ open, onClose, order }: { open: boolean; onClose: () => void; order: Order }) {
  const itemsTotal = order.items.reduce((sum, i) => sum + i.price * i.quantity, 0)
  const shipping = order.total - itemsTotal

  return (
    <Modal open={open} onClose={onClose} title="Invoice" size="lg">
      <div id="invoice-content" className="text-sm">
        <div className="flex items-start justify-between border-b border-porcelain-300 pb-4 dark:border-ink-700">
          <div>
            <p className="font-display text-lg font-semibold text-ink-950 dark:text-porcelain-100">Cartify</p>
            <p className="text-xs text-ink-600 dark:text-porcelain-300/60">Invoice #{order.orderNumber}</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-ink-600 dark:text-porcelain-300/60">Order Date</p>
            <p className="price text-sm font-medium text-ink-950 dark:text-porcelain-100">{formatDate(order.placedAt)}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 border-b border-porcelain-300 py-4 dark:border-ink-700">
          <div>
            <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-ink-600 dark:text-porcelain-300/60">Billed To</p>
            <p className="text-ink-950 dark:text-porcelain-100">{order.address.fullName}</p>
            <p className="text-ink-600 dark:text-porcelain-300/70">
              {order.address.line1}, {order.address.city}, {order.address.state} {order.address.pincode}
            </p>
          </div>
          <div className="text-right">
            <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-ink-600 dark:text-porcelain-300/60">Payment Method</p>
            <p className="capitalize text-ink-950 dark:text-porcelain-100">{order.paymentMethod}</p>
          </div>
        </div>

        <table className="mt-4 w-full">
          <thead>
            <tr className="text-left text-xs font-semibold uppercase tracking-wider text-ink-600 dark:text-porcelain-300/60">
              <th className="pb-2">Item</th>
              <th className="pb-2 text-center">Qty</th>
              <th className="pb-2 text-right">Price</th>
              <th className="pb-2 text-right">Total</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-porcelain-300 dark:divide-ink-700">
            {order.items.map((item, i) => (
              <tr key={i}>
                <td className="py-2.5 text-ink-950 dark:text-porcelain-100">{item.title}</td>
                <td className="price py-2.5 text-center text-ink-600 dark:text-porcelain-300/70">{item.quantity}</td>
                <td className="price py-2.5 text-right text-ink-600 dark:text-porcelain-300/70">{formatPrice(item.price)}</td>
                <td className="price py-2.5 text-right font-medium text-ink-950 dark:text-porcelain-100">{formatPrice(item.price * item.quantity)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="ml-auto mt-4 max-w-xs space-y-2 border-t border-porcelain-300 pt-4 dark:border-ink-700">
          <div className="flex justify-between text-ink-600 dark:text-porcelain-300/70">
            <span>Subtotal</span>
            <span className="price">{formatPrice(itemsTotal)}</span>
          </div>
          <div className="flex justify-between text-ink-600 dark:text-porcelain-300/70">
            <span>Shipping &amp; Adjustments</span>
            <span className="price">{formatPrice(shipping)}</span>
          </div>
          <div className="flex justify-between border-t border-porcelain-300 pt-2 text-base font-semibold text-ink-950 dark:border-ink-700 dark:text-porcelain-100">
            <span>Total Paid</span>
            <span className="price">{formatPrice(order.total)}</span>
          </div>
        </div>
      </div>

      <div className="mt-6 flex justify-end gap-3">
        <Button variant="ghost" onClick={onClose}>Close</Button>
        <Button leftIcon={<Printer className="h-4 w-4" />} onClick={() => window.print()}>
          Print / Save as PDF
        </Button>
      </div>
    </Modal>
  )
}