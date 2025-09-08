'use client'
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { PlusCircle, MapPin, UserPlus, Check, X } from "lucide-react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import axios from "axios"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function BusDashboard() {
  const [page ,setPage] = useState(1)
  const [busData, setBusData] = useState([])
  const [driverData, setDriverData] = useState([])
  const [totalCount, setTotalCount] = useState(0)
  const fetchDriverData  =async () => {
    const {data}  =await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/users?role=driver`)
    if (data) {
      setDriverData(data)
    }
}

  const fetchBusData  =async () => {
      const {data}  =await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/bus?page=${page}`)
      if (data) {
        setBusData(data.bus)
        setTotalCount(data.totalCount)
      }
  }

  useEffect(()=>{
    fetchBusData()
  },[page])


  useEffect(()=>{
    fetchDriverData()
  },[])

  const handleChange  = (action) => {
    if (action === 'next' && Math.ceil(totalCount/5) > page) {
      setPage(page + 1)
    } else if (action === 'prev' && page > 1) {
      setPage(page - 1)
    }

  }

  const changeDriverId = async(driverId, busId) => {
   const {data} =await axios.patch(`${process.env.NEXT_PUBLIC_API_URL}/bus/${busId}/assign-driver`, {driverId})
    
  }
  const router = useRouter()
  return (
    <div className="flex flex-col gap-8 p-4 md:p-6 lg:p-8">
      <div className="grid gap-4 md:grid-cols-3">
        <Card onClick={()=> router.push('bus/create')}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Create Buses</CardTitle>
            <PlusCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Add New Vehicles</div>
            <p className="text-xs text-muted-foreground">Register new buses and vans to your fleet.</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Track Buses</CardTitle>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Monitor Locations</div>
            <p className="text-xs text-muted-foreground">View real-time status and positions of your buses.</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Assign Driver</CardTitle>
            <UserPlus className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Manage Assignments</div>
            <p className="text-xs text-muted-foreground">Assign drivers to specific routes and vehicles.</p>
          </CardContent>
        </Card>
      </div>

      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4">Bus Fleet Details</h2>
        <div className="rounded-md border overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>


                <TableHead>Bus Image</TableHead>
                <TableHead>Total Seats</TableHead>
                <TableHead>Bus Number</TableHead>
                <TableHead>Plate Number</TableHead>
                <TableHead>Occupied Seats</TableHead>
                <TableHead>Bus Type</TableHead>
                <TableHead>Fare/Km</TableHead>
                <TableHead>Rentable</TableHead>
                <TableHead>Maintenance</TableHead>
                <TableHead>Active</TableHead>
                <TableHead>Bus Driver</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {busData.length > 0 && busData.map((bus) => (
                <TableRow key={bus.id}>
                  <TableCell>
                    <img src={`${process.env.NEXT_PUBLIC_API_URL}/uploads/${bus.image}`} alt="bus image" className="w-12 h-12 object-cover rounded-md" />
                    </TableCell>
                  <TableCell>{bus.totalSeats}</TableCell>
                  <TableCell>{bus.busNumber}</TableCell>
                  <TableCell>{bus.plateNumber}</TableCell>
                  <TableCell>{bus.occupiedSeats}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{bus.busType}</Badge>
                  </TableCell>
                  <TableCell>${bus.farePerKm.toFixed(2)}</TableCell>
                  <TableCell>
                    {bus.canBeRented ? (
                      <Check className="h-4 w-4 text-green-500" />
                    ) : (
                      <X className="h-4 w-4 text-red-500" />
                    )}
                  </TableCell>
                  <TableCell>
                    {bus.onMaintenance ? (
                      <Check className="h-4 w-4 text-red-500" />
                    ) : (
                      <X className="h-4 w-4 text-green-500" />
                    )}
                  </TableCell>
                  <TableCell>
                    {bus.isActive ? (
                      <Check className="h-4 w-4 text-green-500" />
                    ) : (
                      <X className="h-4 w-4 text-red-500" />
                    )}
                  </TableCell>
                  <TableCell>
                  <Select onValueChange={(item)=>changeDriverId(item, bus._id)}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Assign driver" />
              </SelectTrigger>
              <SelectContent >
                {driverData.length> 0 && driverData.map((driver) => {
                  return (<SelectItem key={driver._id} value={driver._id}>{driver.lastName}</SelectItem>
                  )
                })
                }
              </SelectContent>
            </Select>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <div className="flex gap-2 justify-end m-4">
            <Button onClick={()=>handleChange('prev')}>Previous</Button>
            {page}
            <Button onClick={()=>handleChange('next')}>Next</Button>
          </div>
        </div>
      </div>
    </div>
  )
}
