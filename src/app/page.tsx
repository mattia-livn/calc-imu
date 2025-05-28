import ChatFeed from './imu/components/ChatFeed'

export default function Home() {
  return (
    <main className="min-h-screen bg-white text-black px-6 py-12 max-w-2xl mx-auto">
      <h1 className="text-3xl font-serif mb-8">Calcolo IMU – Livn</h1>
      <ChatFeed />
    </main>
  )
}