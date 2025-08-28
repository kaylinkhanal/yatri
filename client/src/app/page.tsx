import Image from "next/image"
import Link from "next/link"
// import Header from "@/components/header"
import HeroSection from "@/components/hero-section"
import SearchForm from "@/components/search-form"

export default function Home() {
  return (
     <div className="relative h-screen overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <Image
          src="/banner.webp"
          alt="European Intercity Routes"
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-black/60" /> {/* Dark overlay */}
      </div>

      {/* Fixed left sidebar */}
      <aside className="fixed inset-y-0 left-0 w-56 z-30">
        <div className="h-full flex flex-col bg-white/10 backdrop-blur-md border-r border-white/15 text-white">
          <div className="px-4 py-4">
            <Link href="/" aria-label="Yatri Home" className="inline-flex items-center gap-2">
              <Image src="/logo.png" width={80} height={80} alt="Yatri" className="rounded-md shadow" />
            </Link>
          </div>
          <nav className="flex-1 overflow-y-auto">
            <ul className="py-2 text-sm">
              <li>
                <Link href="/profile" className="block px-4 py-2 hover:bg-white/15 transition">Profile</Link>
              </li>
              <li>
                <Link href="/settings" className="block px-4 py-2 hover:bg-white/15 transition">Settings</Link>
              </li>
              <li>
                <Link href="/login" className="block px-4 py-2 hover:bg-white/15 transition">Login</Link>
              </li>
              <li>
                <Link href="/register" className="block px-4 py-2 hover:bg-white/15 transition">Register</Link>
              </li>
            </ul>
          </nav>
          <div className="px-4 py-3 text-xs text-white/70 border-t border-white/10">© {new Date().getFullYear()} Yatri</div>
        </div>
      </aside>

      {/* Main content area - fixed height; internal sections manage scroll */}
      <main className="pl-56 h-full relative flex flex-col">
        {/* Optional hero, can be lightweight; page itself doesn't scroll */}
        <div className="pointer-events-none select-none">
          <HeroSection />
        </div>
        <div className="flex-1 relative">
          <SearchForm />
        </div>
      </main>
    </div>
  )
}
