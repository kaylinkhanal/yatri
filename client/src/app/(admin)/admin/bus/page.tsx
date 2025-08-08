'use client'
import { Button } from '@/components/ui/button';
import { PlusIcon } from 'lucide-react';
import React, { useState } from 'react';

const Bus = () => {
    const [busSeatsArr, setBusSeatArr ] = useState([
        [{ id: 1, isOccupied: false, seatNumber: 'A', color: 'yellow-500' },
        { id: 2, isOccupied: false, seatNumber: 'A', color: 'yellow-500' },
        { id: 3, isOccupied: true, seatNumber: 'A', occupant: 'driver', color: 'black' },
        ],
        [{ id: 1, isOccupied: false, seatNumber: 'B', color: 'yellow-500' },
        { id: 2, isOccupied: false, seatNumber: 'B', color: 'yellow-500' },
        { id: 3, isOccupied: false, seatNumber: 'B', color: 'yellow-500' },
        { id: 4, isOccupied: false, seatNumber: 'B', color: 'yellow-500' }],
        [{ id: 1, isOccupied: false, seatNumber: 'C', color: 'yellow-500' },
        { id: 2, isOccupied: false, seatNumber: 'C', color: 'yellow-500' },
        { id: 3, isOccupied: false, seatNumber: 'C', color: 'yellow-500' },
        { id: 4, isOccupied: false, seatNumber: 'C', color: 'yellow-500' }],
       
    ]);
    const [selectedSeat, setSelectedSeat] = useState([]);

    const colorMap = {
        'yellow-500': 'bg-[#F5C531]',
        'orange-500': 'bg-[#f59842]',
        'black': 'bg-black'
    };

    const alphabetsArr = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];

    const addNewSeat = (id)=>{
        const existingSeats = [...busSeatsArr]
        existingSeats[id].push({ id: existingSeats[id].length + 1, isOccupied: false, seatNumber: alphabetsArr[existingSeats.length-1], color: 'yellow-500' })
        setBusSeatArr(existingSeats)
    }



    const addBusRows  = () => {
        const existingSeats = [...busSeatsArr]
        existingSeats.push([{ id: 1, isOccupied: false, seatNumber:  alphabetsArr[existingSeats.length], color: 'orange-500' },
            { id: 2, isOccupied: false, seatNumber: alphabetsArr[existingSeats.length], color: 'yellow-500' },
            { id: 3, isOccupied: false, seatNumber:alphabetsArr[existingSeats.length], color: 'yellow-500' },
            { id: 4, isOccupied: false, seatNumber: alphabetsArr[existingSeats.length], color: 'yellow-500' }])
        setBusSeatArr(existingSeats)
    }

    return (
        <div>
            <div className="flex flex-col">
                {busSeatsArr.map((seatArr, id) => (
                    <div className='flex items-center justify-between gap-2' key={id}>
                       <div key={id} className='flex relative'>
                        {seatArr.map((seat) => (
                            <div key={seat.id}>
                        <div onClick={()=> setSelectedSeat([id, seat.id])}  className={`p-2 m-2 rounded-md text-white ${colorMap[seat.color]}`}>
                                {seat.id + seat.seatNumber }
                            </div>
                           {id==selectedSeat[0] && seat.id ==selectedSeat[1] && <span className='absolute top-4 w-4 h-4 rounded bg-green-500 '> 
                                </span>}
                                </div>
                          
                        ))}
                    </div>
                    <div>
                          <PlusIcon onClick={()=> addNewSeat(id)}/>
                          </div>
                    </div>
                 
                ))}
            </div>

            <Button onClick={()=> addBusRows()}>Add more seats</Button>

            {JSON.stringify(selectedSeat)}
        </div>
    );
};

export default Bus;