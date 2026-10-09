import LinktreePageContent from './[lang]/links/LinktreePageContent'
import VideoSchema from './VideoSchema'

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between">
      <VideoSchema />
      <LinktreePageContent />
    </main>
  )
}