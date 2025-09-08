import { NotificationBell } from "@/components/notifications";


export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">My App</h1>
          <NotificationBell />
        </div>
      </header>
      <main className="container mx-auto px-4 py-8">
        <h2 className="text-xl mb-4">Welcome to your dashboard</h2>
        <p className="text-muted-foreground">Click the notification bell to see your notifications.</p>
      </main>
    </div>
  )
}
