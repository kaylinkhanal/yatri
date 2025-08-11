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


import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';



const busSchema = Yup.object().shape({
  busNumber: Yup.string()
    .min(2, 'Bus Number Too Short!')
    .max(20, 'Bus Number Too Long!')
    .required('Bus Number is required'),
  plateNumber: Yup.string()
    .min(2, 'Plate Number Too Short!')
    .max(15, 'Plate Number Too Long!')
    .required('Plate Number is required'),

  busType: Yup.string()
    .oneOf(["Standard", "Premium", "Luxury"], "Invalid Bus Type")
    .default("Standard") // Matches Mongoose default
    .required('Bus Type is required'),
  farePerKm: Yup.number()
    .required('Fare Per KM is required')
    .min(0, 'Fare cannot be negative'),
  canBeRented: Yup.boolean().default(false), // Matches Mongoose default
  status: Yup.string()
    .oneOf(["Active", "Inactive", "Maintenance"], "Invalid Status")
    .default("Active") // Matches Mongoose default
    .required('Status is required'),


});

export const CreateBus = (props) => {
  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-6 lg:p-8 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-lg">
        <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">Create Bus</h1>
        <Formik
          initialValues={{
            busNumber: '',
            plateNumber: '',
            busType: 'Standard',
            farePerKm: 0,
            canBeRented: false,
            status: 'Active',
            seatLayout: [], // Initialize as an empty array for new bus creation
          }}
          validationSchema={busSchema}
          onSubmit={(values, { setSubmitting }) => {
            values.seatLayout = props.busSeatsArr
            values.totalSeats = props.totalSeats
            
            axios.post(`${process.env.NEXT_PUBLIC_API_URL}/bus`, values)
            alert('Bus data submitted!'); // Using alert for demo, consider a modal
            setSubmitting(false);
          }}
        >
          {({ errors, touched, isSubmitting }) => (
            <Form className="space-y-4">
              <div>
                <div>Total Seats: {props.totalSeats}</div>
                <div>Available Seats: {props.totalSeats - props.occupiedSeats}</div>

                <label htmlFor="busNumber" className="block text-sm font-medium text-gray-700">Bus Number</label>
                <Field
                  name="busNumber"
                  type="text"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2"
                />
                <ErrorMessage name="busNumber" component="div" className="text-red-500 text-xs mt-1" />
              </div>

              <div>
                <label htmlFor="plateNumber" className="block text-sm font-medium text-gray-700">Plate Number</label>
                <Field
                  name="plateNumber"
                  type="text"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2"
                />
                <ErrorMessage name="plateNumber" component="div" className="text-red-500 text-xs mt-1" />
              </div>

            

              <div>
                <label htmlFor="busType" className="block text-sm font-medium text-gray-700">Bus Type</label>
                <Field
                  as="select"
                  name="busType"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2"
                >
                  <option value="Standard">Standard</option>
                  <option value="Premium">Premium</option>
                  <option value="Luxury">Luxury</option>
                </Field>
                <ErrorMessage name="busType" component="div" className="text-red-500 text-xs mt-1" />
              </div>

              <div>
                <label htmlFor="farePerKm" className="block text-sm font-medium text-gray-700">Fare Per KM</label>
                <Field
                  name="farePerKm"
                  type="number"
                  step="0.01"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2"
                />
                <ErrorMessage name="farePerKm" component="div" className="text-red-500 text-xs mt-1" />
              </div>

              <div className="flex items-center">
                <Field
                  name="canBeRented"
                  type="checkbox"
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
                <label htmlFor="canBeRented" className="ml-2 block text-sm text-gray-900">Can Be Rented</label>
                <ErrorMessage name="canBeRented" component="div" className="text-red-500 text-xs mt-1 ml-2" />
              </div>

              <div>
                <label htmlFor="status" className="block text-sm font-medium text-gray-700">Status</label>
                <Field
                  as="select"
                  name="status"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2"
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                  <option value="Maintenance">Maintenance</option>
                </Field>
                <ErrorMessage name="status" component="div" className="text-red-500 text-xs mt-1" />
              </div>

             

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
              >
                {isSubmitting ? 'Submitting...' : 'Create Bus'}
              </button>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

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
                existingSeats[selectedSeat[0]][selectedSeat[1]-1].isOccupied = true;

                setBusSeatArr(existingSeats);
                break;
            case 'CONDUCTOR_SEAT':
                existingSeats[selectedSeat[0]][selectedSeat[1]-1].occupant = 'conductor';
                existingSeats[selectedSeat[0]][selectedSeat[1]-1].isOccupied = true;
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
                <div>
                    <CreateBus busSeatsArr={busSeatsArr} totalSeats={busSeatsArr?.flat()?.length} occupiedSeats={busSeatsArr?.flat()?.filter(item=> item.isOccupied)?.length }/>
                </div>
        </div>
    );
};

export default Bus;