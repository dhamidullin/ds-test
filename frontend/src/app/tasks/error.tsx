'use client'

export default function Error({ error }: { error: Error }) {
  return (
    <div className="p-4 text-red-700 font-bold">
      Error: {error.message}
    </div>
  )
}
