"use client"

import { useState } from "react"
import { SeatStatistics, SeatActionPanel, SeatGrid } from "@/components/bus-creation/seat"
import { BusDetailsForm } from "@/components/bus-creation/bus-details-form"

interface Seat {
  id: number
  isOccupied: boolean
  seatNumber: string
  occupant?: string
  isEmpty?: boolean
}

export default function CreateBusPage() {
  const [busSeatsArr, setBusSeatArr] = useState<Seat[][]>([
    [
      { id: 1, isOccupied: false, seatNumber: "A" },
      { id: 2, isOccupied: false, seatNumber: "A" },
      { id: 3, isOccupied: true, seatNumber: "A", occupant: "driver" },
    ],
    [
      { id: 1, isOccupied: false, seatNumber: "B" },
      { id: 2, isOccupied: false, seatNumber: "B" },
      { id: 3, isOccupied: false, seatNumber: "B" },
      { id: 4, isOccupied: false, seatNumber: "B" },
    ],
  ])

  const [selectedSeat, setSelectedSeat] = useState<number[]>([])

  const alphabetsArr = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"]

  const changeSeatAttr = (action: any) => {
    if (selectedSeat.length !== 2) return

    const existingSeats = [...busSeatsArr]
    const [rowIndex, seatId] = selectedSeat

    switch (action.type) {
      case "DRIVER_SEAT":
        existingSeats[rowIndex][seatId - 1].occupant = "driver"
        existingSeats[rowIndex][seatId - 1].isOccupied = true
        break
      case "CONDUCTOR_SEAT":
        existingSeats[rowIndex][seatId - 1].occupant = "conductor"
        existingSeats[rowIndex][seatId - 1].isOccupied = true
        break
      case "DISABLED_SEAT":
        existingSeats[rowIndex][seatId - 1].isOccupied = false
        existingSeats[rowIndex][seatId - 1].occupant = "disabled"
        break
      case "DOOR_TO_THE_LEFT":
        existingSeats[rowIndex][seatId - 1].occupant = "door-left"
        break
      case "DOOR_TO_THE_RIGHT":
        existingSeats[rowIndex][seatId - 1].occupant = "door-right"
        break
      case "EMERGENCY_EXIT":
        existingSeats[rowIndex][seatId - 1].occupant = "emergency-exit"
        break
    }

    setBusSeatArr(existingSeats)
    setSelectedSeat([])
  }

  const addNewSeat = (rowIndex: number) => {
    const existingSeats = [...busSeatsArr]
    const currentRow = existingSeats[rowIndex]
    const newSeatId = currentRow.length + 1

    currentRow.push({
      id: newSeatId,
      isOccupied: false,
      seatNumber: alphabetsArr[rowIndex],
    })

    setBusSeatArr(existingSeats)
  }

  const addSpace = (rowIndex: number) => {
    const existingSeats = [...busSeatsArr]
    const currentRow = existingSeats[rowIndex]
    const newSeatId = currentRow.length + 1

    currentRow.push({
      id: newSeatId,
      isOccupied: false,
      seatNumber: alphabetsArr[rowIndex],
      isEmpty: true,
    })

    setBusSeatArr(existingSeats)
  }

  const addBusRows = () => {
    const existingSeats = [...busSeatsArr]
    const newRowIndex = existingSeats.length

    existingSeats.push([
      { id: 1, isOccupied: false, seatNumber: alphabetsArr[newRowIndex] },
      { id: 2, isOccupied: false, seatNumber: alphabetsArr[newRowIndex] },
      { id: 3, isOccupied: false, seatNumber: alphabetsArr[newRowIndex] },
      { id: 4, isOccupied: false, seatNumber: alphabetsArr[newRowIndex] },
    ])

    setBusSeatArr(existingSeats)
  }

  const handleSeatSelect = (rowIndex: number, seatId: number) => {
    setSelectedSeat([rowIndex, seatId])
  }

  const handleRemoveSeat = (rowIndex: number) => {
  setBusSeatArr(prev => {
    const newArr = prev.map((row, idx) =>
      idx === rowIndex ? row.slice(0, -1) : row
    );
    return newArr;
  });
};

  const totalSeats = busSeatsArr.flat().filter((seat) => !seat.isEmpty).length
  const occupiedSeats = busSeatsArr.flat().filter((seat) => seat.isOccupied && !seat.isEmpty).length
  const availableSeats = totalSeats - occupiedSeats

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-1">Create New Bus</h1>
          <p className="text-sm text-gray-600">Design your bus layout and configure details</p>
        </div>

        {/* Statistics */}
        <SeatStatistics totalSeats={totalSeats} occupiedSeats={occupiedSeats} availableSeats={availableSeats} />

        {/* Seat Actions */}
        <div className="mb-4">
          <SeatActionPanel onActionSelect={changeSeatAttr} selectedSeat={selectedSeat} />
        </div>

        {/* Main Content - Side by Side */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Bus Layout */}
          <div>
            <SeatGrid
              busSeatsArr={busSeatsArr}
              selectedSeat={selectedSeat}
              onSeatSelect={handleSeatSelect}
              onAddSeat={addNewSeat}
              onAddRow={addBusRows}
              onRemoveSeat={handleRemoveSeat}
            />
          </div>

          {/* Bus Details Form */}
          <div>
            <BusDetailsForm busSeatsArr={busSeatsArr} totalSeats={totalSeats} occupiedSeats={occupiedSeats} />
          </div>
        </div>
      </div>
    </div>
  )
}
