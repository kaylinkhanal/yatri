import React from 'react'

const Bus = () => {
    const busSeatsArr = [
        { id: 1, isOccupied: false, seatNumber: '1A', color: 'red' },
        { id: 2, isOccupied: true, seatNumber: '1B', occupant: 'driver' , color: 'blue' },
        { id: 3, isOccupied: false, seatNumber: '2A', color: 'red' },
        { id: 4, isOccupied: false, seatNumber: '2B',   color: 'red' },
        { id: 5, isOccupied: false, seatNumber: '3A', color: 'blue' },
        { id: 6, isOccupied: false, seatNumber: '3B' ,  color: 'red'},
        { id: 7, isOccupied: false, seatNumber: '4A', color: 'red' },
        { id: 8, isOccupied: false, seatNumber: '4B',   color: 'red' },
    ]
  return (
    <div>
        <div>
            {busSeatsArr.map((seat) => {
                return (
                    <div key={seat.id} className={`p-2 m-2 rounded-md text-white bg-${seat.color}-500`}>
                        {seat.seatNumber}
                    </div>
                )
            })}
        </div>
    </div>
  )
}

export default Bus