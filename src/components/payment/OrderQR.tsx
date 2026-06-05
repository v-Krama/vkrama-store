interface OrderQRProps {
  imageUrl: string
}

export default function OrderQR({ imageUrl }: OrderQRProps) {
  return (
    <div className="flex flex-col items-center gap-4">
      <img
        src={imageUrl}
        alt="Payment QR"
        className="w-64 h-64 rounded-xl shadow-sm object-contain bg-white"
      />
      <p className="text-sm text-gray-500 text-center max-w-xs">
        Scan this QR code with your payment app to complete the payment
      </p>
    </div>
  )
}
