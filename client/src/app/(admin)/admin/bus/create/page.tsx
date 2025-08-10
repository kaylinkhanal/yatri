'use client'
import { Button } from '@/components/ui/button';
import { PlusIcon } from 'lucide-react';
import React, { useState } from 'react';

const actions = [
   {type:  'DRIVER_SEAT', label: 'Driver Seat' , color: 'bg-blue-500'},
    {type:  'CONDUCTOR_SEAT', label: 'Conductor Seat', color: 'bg-red-500'},
    {type:  'DISABLED_SEAT', label: 'Disabled Seat' ,   color: 'bg-green-500'},
    {type:  'DOOR_TO_THE_LEFT', label: 'Door to the Left',  color: 'bg-purple-500'},
    {type:  'DOOR_TO_THE_RIGHT', label: 'Door to the Right',   color: 'bg-purple-500'},
    {type:  'EMERGENCY_EXIT', label: 'Emergency Exit',  color: 'bg-orange-500' },
]

const Bus = () => {
    const [busSeatsArr, setBusSeatArr ] = useState([
        [{ id: 1, isOccupied: false, seatNumber: 'A' },
        { id: 2, isOccupied: false, seatNumber: 'A'},
        { id: 3, isOccupied: true, seatNumber: 'A', occupant: 'driver' },
        ],
        [{ id: 1, isOccupied: false, seatNumber: 'B'},
        { id: 2, isOccupied: false, seatNumber: 'B'},
        { id: 3, isOccupied: false, seatNumber: 'B'},
        { id: 4, isOccupied: false, seatNumber: 'B'}],
        [{ id: 1, isOccupied: false, seatNumber: 'C' },
        { id: 2, isOccupied: false, seatNumber: 'C' },
        { id: 3, isOccupied: false, seatNumber: 'C' },
        { id: 4, isOccupied: false, seatNumber: 'C'}],
       
    ]);
    const [selectedSeat, setSelectedSeat] = useState([]);

  


    const changeSeatAttr = (action) => {
        const existingSeats = [...busSeatsArr];
        switch(action.type) {
            case 'DRIVER_SEAT':
                existingSeats[selectedSeat[0]][selectedSeat[1]-1].occupant = 'driver';
                setBusSeatArr(existingSeats);
                break;
            case 'CONDUCTOR_SEAT':
                existingSeats[selectedSeat[0]][selectedSeat[1]-1].occupant = 'conductor';
                setBusSeatArr(existingSeats);
                break;
            case 'DISABLED_SEAT':
                existingSeats[selectedSeat[0]][selectedSeat[1]-1].isOccupied = false;
                existingSeats[selectedSeat[0]][selectedSeat[1]-1].occupant = 'disabled';
                setBusSeatArr(existingSeats);
                break;
            case 'DOOR_TO_THE_LEFT':
                existingSeats[selectedSeat[0]][selectedSeat[1]-1].occupant = 'door-left';
                setBusSeatArr(existingSeats);
                break;
            case 'DOOR_TO_THE_RIGHT':
                existingSeats[selectedSeat[0]][selectedSeat[1]-1].occupant = 'door-right';
                setBusSeatArr(existingSeats);
                break;
            case 'EMERGENCY_EXIT':
                existingSeats[selectedSeat[0]][selectedSeat[1]-1].occupant = 'emergency-exit';
                setBusSeatArr(existingSeats);
                break;
            default:
                break;

        }
    }
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



    const generateColor = (seat) =>{
        switch(seat.occupant) {
            case 'driver':
                return 'bg-blue-500';
            case 'conductor':
                return 'bg-red-500';
            case 'disabled':
                return 'bg-green-500';
            case 'door-right':
            case 'door-left':
                return 'bg-purple-500';
            case 'emergency-exit':
                return 'bg-orange-500';
            default:
                return 'bg-yellow-500';
        }
    }
    return (
        <div className='flex  gap-24'>
            <div>
            <div className="flex flex-col">
                {busSeatsArr.map((seatArr, id) => (
                    <div className='flex items-center justify-between gap-2' key={id}>
                       <div key={id} className='flex relative'>
                        {seatArr.map((seat) => (
                            <div key={seat.id}>
                        <div onClick={()=> setSelectedSeat([id, seat.id])}  className={`p-2 m-2 rounded-md text-white ${generateColor(seat)}`}>
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
            
            </div>
        

                <div className='flex flex-col gap-2'>
                {actions.map((action, index) => {
                return (
                    <div onClick={()=> changeSeatAttr(action)} key={index} className=' w-24 h-12 '  >
                        <span className={`p-2 rounded-full ${action.color}`}> </span>
                        <span >   {action.label}</span>
                    </div>
                );
                })}
                </div>
        </div>
    );
};

export default Bus;