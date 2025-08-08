import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { MapPin, ArrowRightLeftIcon as ArrowsRightLeft, Calendar, Users } from 'lucide-react'

export default function SearchForm() {
  return (
    <div className="relative z-10 w-full max-w-6xl mx-auto px-4 pb-12 md:px-8 lg:px-12">
      <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4 md:p-6 grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
        <div className="flex flex-col space-y-1">
          <label htmlFor="from" className="text-sm text-white flex items-center gap-1">
            <MapPin className="h-4 w-4 text-gold" /> From:
          </label>
          <Input
            id="from"
            placeholder="Select location"
            className="bg-white/80 border-none text-black placeholder:text-gray-600"
          />
        </div>
        <div className="flex items-center justify-center md:col-span-1">
          <Button variant="ghost" size="icon" className="text-white hover:text-gold">
            <ArrowsRightLeft className="h-6 w-6" />
          </Button>
        </div>
        <div className="flex flex-col space-y-1">
          <label htmlFor="to" className="text-sm text-white flex items-center gap-1">
            <MapPin className="h-4 w-4 text-gold" /> To:
          </label>
          <Input
            id="to"
            placeholder="Select destination"
            className="bg-white/80 border-none text-black placeholder:text-gray-600"
          />
        </div>
        <div className="flex flex-col space-y-1">
          <label htmlFor="date" className="text-sm text-white flex items-center gap-1">
            <Calendar className="h-4 w-4 text-gold" /> Date:
          </label>
          <Input
            id="date"
            type="text" // Changed to text for placeholder, can be date input
            placeholder="Departure"
            className="bg-white/80 border-none text-black placeholder:text-gray-600"
          />
        </div>
        <div className="flex flex-col space-y-1">
          <label htmlFor="passengers" className="text-sm text-white flex items-center gap-1">
            <Users className="h-4 w-4 text-gold" /> Passengers:
          </label>
          <Input
            id="passengers"
            type="text"
            placeholder="1 adult"
            className="bg-white/80 border-none text-black placeholder:text-gray-600"
          />
        </div>
        <Button className="col-span-1 md:col-span-5 bg-gold text-white hover:bg-gold/90 h-12 text-lg font-semibold">
          SEARCH
        </Button>
      </div>
    </div>
  )
}
