import { useEffect, useRef } from 'react'
import QRCode from 'qrcode'

interface OrderQRProps {
  upiLink: string
  orderId: string
  totalCents: number
}

export default function OrderQR({ upiLink, orderId, totalCents }: OrderQRProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (canvasRef.current) {
      QRCode.toCanvas(canvasRef.current, upiLink, {
        width: 250,
        margin: 2,
        color: { dark: '#1e293b', light: '#ffffff' },
      })
    }
  }, [upiLink])

  return (
    <div className="flex flex-col items-center gap-4">
      <canvas ref={canvasRef} className="rounded-xl shadow-sm" />
      <p className="text-sm text-gray-500 text-center max-w-xs">
        Scan this QR with any UPI app (GPay, PhonePe, PayTM, etc.) to pay
      </p>
      <button
        onClick={() => navigator.clipboard.writeText(upiLink)}
        className="text-xs text-brand-600 hover:text-brand-700 underline"
      >
        Copy UPI link
      </button>
    </div>
  )
}
