import Image from "next/image"
import Header from "@/components/header"
import HeroSection from "@/components/hero-section"
import SearchForm from "@/components/search-form"

export default function Home() {
  return (
    <div className="relative min-h-screen flex flex-col">
      <Image
        src="/banner.webp"
        alt="European Intercity Routes"
        fill
        priority
        className="object-cover"
        sizes="100vw"
      />
      <div className="absolute inset-0 bg-black/60 flex flex-col">
        <Header />
        <HeroSection />
        <SearchForm />
      </div>
    </div>
  )
}
