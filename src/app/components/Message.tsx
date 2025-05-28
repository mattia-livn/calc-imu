type Props = {
  role: 'user' | 'ai'
  content: string
}

export default function Message({ role, content }: Props) {
  return (
    <div className={`py-8 ${role === 'user' ? 'bg-white' : 'bg-gray-50'}`}>
      <div className="max-w-3xl mx-auto px-4">
        <div className="text-sm text-gray-500 mb-1 font-medium">
          {role === 'user' ? 'Tu' : 'Livn'}
        </div>
        <div className="prose prose-sm max-w-none whitespace-pre-wrap">
          {content}
        </div>
      </div>
    </div>
  )
}