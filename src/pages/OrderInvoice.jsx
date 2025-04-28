"use client"

import { formatDate, formatCurrency } from "../utils/formatDate"

const OrderInvoice = ({ order, onClose }) => {
  if (!order) return null

  // Generate invoice number based on order ID and date
  const invoiceNumber = `INV-${order._id?.substring(order._id.length - 5) || "00000"}`
  const currentDate = new Date().toISOString().split("T")[0]

  // Format date for display
  const formattedDate = formatDate(new Date())

  const handlePrint = () => {
    window.print()
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 print:bg-opacity-0">
      <div className="bg-white rounded-lg p-6 w-full max-w-3xl max-h-[90vh] overflow-y-auto print:max-w-none print:max-h-none print:overflow-visible print:p-0 print:shadow-none">
        {/* Print controls - hidden when printing */}
        <div className="flex justify-between items-center mb-6 print:hidden">
          <h2 className="text-xl font-bold">Order Invoice</h2>
          <div className="flex space-x-2">
            <button onClick={handlePrint} className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700">
              Print Invoice
            </button>
            <button onClick={onClose} className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100">
              Close
            </button>
          </div>
        </div>

        {/* Invoice content - visible when printing */}
        <div id="invoice" className="border border-gray-200 p-6 print:border-0">
          {/* Header */}
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold">Grace Tailor </h1>
            <p className="text-gray-600">Sadar Bazar Dajazl</p>
            <p className="text-gray-600">Tel: 0308-7768551</p>
          </div>

          <h2 className="text-3xl font-bold text-center mb-6">INVOICE</h2>

          {/* Invoice details */}
          <div className="flex justify-between mb-6">
            <div>
              <p>
                <strong>Invoice No:</strong> {invoiceNumber}
              </p>
              <p>
                <strong>Order ID:</strong> #{order._id?.substring(order._id.length - 5) || "00000"}
              </p>
              <p>
                <strong>Status:</strong> {order.status?.charAt(0).toUpperCase() + order.status?.slice(1) || "Pending"}
              </p>
            </div>
            <div className="text-right">
              <p>
                <strong>Date:</strong> {formattedDate}
              </p>
              <p>
                <strong>Order Date:</strong> {formatDate(order.createdAt)}
              </p>
            </div>
          </div>

          {/* Customer details */}
          <div className="mb-6 border-t border-b border-gray-200 py-4">
            <h3 className="font-bold mb-2">Bill to:</h3>
            <p>
              <strong>Name:</strong> {order.customerName}
            </p>
            <p>
              <strong>Phone:</strong> {order.phoneNumber}
            </p>
            {order.customer?.address && (
              <p>
                <strong>Address:</strong> {order.customer.address}
              </p>
            )}
          </div>

          {/* Order details */}
          <div className="mb-6">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                    Item
                  </th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                    Description
                  </th>
                  <th className="px-4 py-2 text-right text-sm font-medium text-gray-500 uppercase tracking-wider">
                    Price
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                <tr>
                  <td className="px-4 py-3 text-sm">1</td>
                  <td className="px-4 py-3 text-sm">
                    <div>Tailoring Service</div>
                    <div className="text-gray-500 text-xs">{order.comment}</div>
                  </td>
                  <td className="px-4 py-3 text-sm text-right">{formatCurrency(order.price)}</td>
                </tr>
              </tbody>
              <tfoot>
                <tr>
                  <td colSpan="2" className="px-4 py-3 text-right font-bold">
                    Subtotal
                  </td>
                  <td className="px-4 py-3 text-right">{formatCurrency(order.price)}</td>
                </tr>
                <tr>
                  <td colSpan="2" className="px-4 py-3 text-right font-bold">
                    Tax (0%)
                  </td>
                  <td className="px-4 py-3 text-right">{formatCurrency(0)}</td>
                </tr>
                <tr className="border-t-2 border-gray-300">
                  <td colSpan="2" className="px-4 py-3 text-right font-bold">
                    Total
                  </td>
                  <td className="px-4 py-3 text-right font-bold">{formatCurrency(order.price)}</td>
                </tr>
              </tfoot>
            </table>
          </div>

          {/* Payment details */}
          <div className="mb-6 grid grid-cols-2 gap-5">
            <div>
              <h3 className="font-bold mb-2">Payment Terms:</h3>
             
              <p>
                <strong>Payment Method:</strong> Cash / Online Payment
              </p>
              <p>Payment due within 30 days</p>
            </div>
            <div>
              <h3 className="font-bold mb-2">For Online Payment:</h3>
              
              <p>
                <strong>Bank Name:</strong> Jazzcash/Easypaisa
              </p>
            </div>
          </div>

          {/* Signature */}
          <div className="mt-12 border-t border-gray-200 pt-4">
            <div className="flex justify-between">
              <div>
                <div className="border-t border-gray-400 w-40"></div>
              </div>
              <div>
                <p className="mb-8">Authorized Signature</p>
                <div className="border-t border-gray-400 w-40"></div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-8 text-center text-sm text-gray-500">
            <p>Thank you for your business!</p>
            <p>if u want to create such an invoice System - Kindly contact me on 0342-0072298 </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default OrderInvoice
