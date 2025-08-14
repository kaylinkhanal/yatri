"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, Minus } from "lucide-react"

const actions = [
  { type: "DRIVER_SEAT", label: "Driver", color: "bg-blue-500" },
  { type: "CONDUCTOR_SEAT", label: "Conductor", color: "bg-red-500" },
  { type: "DISABLED_SEAT", label: "Disabled", color: "bg-green-500" },
  { type: "DOOR_TO_THE_LEFT", label: "Door L", color: "bg-purple-500" },
  { type: "DOOR_TO_THE_RIGHT", label: "Door R", color: "bg-purple-500" },
  { type: "EMERGENCY_EXIT", label: "Emergency", color: "bg-orange-500" },
  {type: "AISLE_TO_THE_RIGHT", label: "Aisle R", color: "bg-yellow-500" },
]

interface SeatActionPanelProps {
  onActionSelect: (action: any) => void
  selectedSeat: number[]
}

export function SeatActionPanel({ onActionSelect, selectedSeat }: SeatActionPanelProps) {
  const hasSelectedSeat = selectedSeat.length === 2

  return (
    <Card className="border-gray-200">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-gray-700">
          {hasSelectedSeat ? "Modify Seat" : "Select a seat to modify"}
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="flex flex-wrap gap-2">
          {actions.map((action, index) => (
            <Button
              key={index}
              onClick={() => onActionSelect(action)}
              disabled={!hasSelectedSeat}
              size="sm"
              className={`text-xs ${
                hasSelectedSeat
                  ? `${action.color} hover:opacity-90 text-white`
                  : "bg-gray-100 text-gray-400 cursor-not-allowed"
              }`}
            >
              {action.label}
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

interface Seat {
  id: number
  isOccupied: boolean
  seatNumber: string
  occupant?: string
  isEmpty?: boolean
}

interface SeatGridProps {
  busSeatsArr: Seat[][]
  selectedSeat: number[]
  onSeatSelect: (rowIndex: number, seatId: number) => void
  onAddSeat: (rowIndex: number) => void
  onAddRow: () => void
  onRemoveSeat: (rowIndex: number) => void
}

export function SeatGrid({ busSeatsArr, selectedSeat,aisleIndex, onSeatSelect, onAddSeat, onAddRow, onRemoveSeat, }: SeatGridProps) {
  const generateColor = (seat: Seat) => {
    if (seat.isEmpty) return "bg-transparent border-2 border-dashed border-gray-300"

    switch (seat.occupant) {
      case "driver":
        return "bg-blue-500 hover:bg-blue-600"
      case "conductor":
        return "bg-red-500 hover:bg-red-600"
      case "disabled":
        return "bg-green-500 hover:bg-green-600"
      case "door-right":
      case "door-left":
        return "bg-purple-500 hover:bg-purple-600"
      case "emergency-exit":
        return "bg-orange-500 hover:bg-orange-600"
      default:
        return "bg-yellow-500 hover:bg-yellow-600"
    }
  }

  const getSeatIcon = (seat: Seat) => {
    if (seat.isEmpty) return ""
    if (seat.occupant === "door-left" || seat.occupant === "door-right") return "🚪"
    if (seat.occupant === "emergency-exit") return "🚨"
    return seat.id + seat.seatNumber
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      {/* Bus Header */}
      <div className="flex justify-center mb-3">
        <div className="bg-gray-800 text-white px-4 py-1 rounded text-xs font-medium">🚌 FRONT</div>
      </div>

      {/* Bus Layout */}
      <div className="bg-gray-50 rounded-lg p-3 border-2 border-gray-800">
        <div className="space-y-2">
          {busSeatsArr.map((seatArr, rowIndex) => (
            <div key={rowIndex} className="flex items-center gap-2">
              {/* Row Label */}
              <div className="text-xs font-medium text-gray-500 w-4">{String.fromCharCode(65 + rowIndex)}</div>

              {/* Seats */}
              <div className="flex gap-1 flex-1">
                {seatArr.map((seat) => (
                  <div key={seat.id} className="relative">
                    <Button
                      onClick={() => !seat.isEmpty && onSeatSelect(rowIndex, seat.id)}
                      className={`w-8 h-8 text-xs font-medium text-white p-0 ${generateColor(seat)} ${
                        selectedSeat[0] === rowIndex && selectedSeat[1] === seat.id
                          ? "ring-2 ring-yellow-400 scale-110"
                          : ""
                      } ${seat.isEmpty ? "cursor-default" : ""} ${aisleIndex==seat.id && busSeatsArr.length-1 !== rowIndex ? ' mr-12 ': ''} `}
                      disabled={seat.isEmpty}
                    >
                      {getSeatIcon(seat)}
                    </Button>
                    {selectedSeat[0] === rowIndex && selectedSeat[1] === seat.id && !seat.isEmpty && (
                      <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border border-white"></div>
                    )}

                  </div>
                ))}
              </div>

              {/* Row Actions */}
              <div className="flex gap-1">
                <Button
                  onClick={() => onAddSeat(rowIndex)}
                  variant="ghost"
                  size="sm"
                  className="w-6 h-6 p-0 text-yellow-600 hover:bg-yellow-50"
                >
                  <Plus className="w-3 h-3" />
                </Button>
                <Button
                  onClick={() => onRemoveSeat(rowIndex)} // <-- Change here
                  variant="ghost"
                  size="sm"
                  className="w-6 h-6 p-0 text-gray-500 hover:bg-gray-50"
                  title="Remove Seat"
                >
                  <Minus className="w-3 h-3" />
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* Add Row */}
        <div className="flex justify-center pt-3 mt-3 border-t border-gray-200">
          <Button onClick={onAddRow} size="sm" className="bg-yellow-500 hover:bg-yellow-600 text-white text-xs">
            <Plus className="w-3 h-3 mr-1" />
            Add Row
          </Button>
        </div>
      </div>
    </div>
  )
}

interface SeatStatisticsProps {
  totalSeats: number
  occupiedSeats: number
  availableSeats: number
}

export function SeatStatistics({ totalSeats, occupiedSeats, availableSeats }: SeatStatisticsProps) {
  return (
    <div className="grid grid-cols-3 gap-4 mb-6">
      <Card className="border-yellow-200 bg-yellow-50">
        <CardContent className="p-3 text-center">
          <div className="text-lg font-bold text-yellow-900">{totalSeats}</div>
          <div className="text-xs text-yellow-700">Total Seats</div>
        </CardContent>
      </Card>

      <Card className="border-red-200 bg-red-50">
        <CardContent className="p-3 text-center">
          <div className="text-lg font-bold text-red-900">{occupiedSeats}</div>
          <div className="text-xs text-red-700">Occupied</div>
        </CardContent>
      </Card>

      <Card className="border-green-200 bg-green-50">
        <CardContent className="p-3 text-center">
          <div className="text-lg font-bold text-green-900">{availableSeats}</div>
          <div className="text-xs text-green-700">Available</div>
        </CardContent>
      </Card>
    </div>
  )
}
