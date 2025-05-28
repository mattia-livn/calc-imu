// src/app/imu/components/Message.tsx

type Props = {
  role: 'user' | 'ai'
  content: string
}

export default function Message({ role, content }: Props) {
  return (
    <div className={`p-3 rounded ${role === 'user' ? 'bg-gray-100 text-left' : 'bg-gray-50 border text-left'}`}>
      <div className="text-sm text-gray-500 mb-1 font-mono">
        {role === 'user' ? 'Tu' : 'Livn'}
      </div>
      <div className="whitespace-pre-wrap">{content}</div>
    </div>
  )
}
