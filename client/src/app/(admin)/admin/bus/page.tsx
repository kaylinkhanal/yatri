'use client'
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { PlusCircle, MapPin, UserPlus, Check, X } from "lucide-react"
import { useRouter } from "next/navigation"

export default function BusDashboard() {
  const busData = [
    {
      id: "B001",
      totalSeats: 45,
      occupiedSeats: 30,
      busType: "Premium",
      farePerKm: 1.5,
      canBeRented: true,
      onMaintenance: false,
      isActive: true,
    },
    {
      id: "B002",
      totalSeats: 30,
      occupiedSeats: 15,
      busType: "Gold",
      farePerKm: 1.2,
      canBeRented: true,
      onMaintenance: false,
      isActive: true,
    },
    {
      id: "B003",
      totalSeats: 50,
      occupiedSeats: 48,
      busType: "Pro",
      farePerKm: 1.8,
      canBeRented: false,
      onMaintenance: true,
      isActive: false,
    },
    {
      id: "V001",
      totalSeats: 12,
      occupiedSeats: 8,
      busType: "Van",
      farePerKm: 0.8,
      canBeRented: true,
      onMaintenance: false,
      isActive: true,
    },
    {
      id: "B004",
      totalSeats: 40,
      occupiedSeats: 25,
      busType: "Gold",
      farePerKm: 1.3,
      canBeRented: true,
      onMaintenance: false,
      isActive: true,
    },
    {
      id: "V002",
      totalSeats: 15,
      occupiedSeats: 15,
      busType: "Van",
      farePerKm: 0.9,
      canBeRented: false,
      onMaintenance: false,
      isActive: false,
    },
  ]
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
                <TableHead>Bus ID</TableHead>
                <TableHead>Total Seats</TableHead>
                <TableHead>Occupied Seats</TableHead>
                <TableHead>Bus Type</TableHead>
                <TableHead>Fare/Km</TableHead>
                <TableHead>Rentable</TableHead>
                <TableHead>Maintenance</TableHead>
                <TableHead>Active</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {busData.map((bus) => (
                <TableRow key={bus.id}>
                  <TableCell className="font-medium">{bus.id}</TableCell>
                  <TableCell>{bus.totalSeats}</TableCell>
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
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  )
}
