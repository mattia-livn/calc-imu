import ChatFeed from './components/ChatFeed'

export default function Home() {
  return (
    <div className="flex flex-col h-screen bg-white">
      <header className="border-b p-4">
        <h1 className="text-xl font-semibold text-center">Calcolo IMU – Livn</h1>
      </header>
      <main className="flex-1 overflow-hidden">
        <ChatFeed />
      </main>
    </div>
  )
}