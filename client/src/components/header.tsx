import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { ChevronDown, User, ShoppingBag, Search } from 'lucide-react'
import Image from "next/image"

export default function Header() {
  return (
    <header className="relative z-10 flex items-center justify-between px-4 py-6 md:px-8 lg:px-12 text-white">
      <div className="flex items-center space-x-2">
        <span className="text-2xl font-bold">
        <Image src="/logo.png" alt="Yatri Logo" width={120} height={120} className="object-contain" priority />
        </span>
      </div>
      <nav className="hidden md:flex items-center space-x-8">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="text-white hover:text-gold">
              Home <ChevronDown className="ml-1 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>Item 1</DropdownMenuItem>
            <DropdownMenuItem>Item 2</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="text-white hover:text-gold">
              About <ChevronDown className="ml-1 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>Our Story</DropdownMenuItem>
            <DropdownMenuItem>Team</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="text-white hover:text-gold">
              Store <ChevronDown className="ml-1 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>Merchandise</DropdownMenuItem>
            <DropdownMenuItem>Gift Cards</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="text-white hover:text-gold">
              Articles <ChevronDown className="ml-1 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>Travel Guides</DropdownMenuItem>
            <DropdownMenuItem>News</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <Button variant="ghost" className="text-white hover:text-gold">
          Contacts
        </Button>
      </nav>
      <div className="flex items-center space-x-4">
        <Button variant="ghost" size="icon" className="text-white hover:text-gold">
          <User className="h-5 w-5" />
        </Button>
        <Button variant="ghost" size="icon" className="relative text-white hover:text-gold">
          <ShoppingBag className="h-5 w-5" />
          <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-xs text-white">
            0
          </span>
        </Button>
        <Button variant="ghost" size="icon" className="text-white hover:text-gold">
          <Search className="h-5 w-5" />
        </Button>
      </div>
    </header>
  )
}
