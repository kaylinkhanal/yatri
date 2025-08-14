"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Formik, Form, Field, ErrorMessage } from "formik"
import * as Yup from "yup"
import axios from "axios"
import { useState } from "react"

const busSchema = Yup.object().shape({
  busNumber: Yup.string().min(2, "Too Short!").max(20, "Too Long!").required("Required"),
  plateNumber: Yup.string().min(2, "Too Short!").max(15, "Too Long!").required("Required"),
  busType: Yup.string().oneOf(["Standard", "Premium", "Luxury"]).required("Required"),
  farePerKm: Yup.number().required("Required").min(0, "Cannot be negative"),
  canBeRented: Yup.boolean().default(false),
  status: Yup.string().oneOf(["Active", "Inactive", "Maintenance"]).required("Required"),
})

interface BusDetailsFormProps {
  busSeatsArr: any[]
  totalSeats: number
  occupiedSeats: number
}

export function BusDetailsForm({ busSeatsArr, totalSeats, occupiedSeats }: BusDetailsFormProps) {
  const [image, setImage] = useState(null)
  const handleChange = (e)=>{
    setImage(e.target.files[0])
  }
  return (
    <Card className="border-gray-200">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold text-gray-800">Bus Details</CardTitle>
      </CardHeader>
      <CardContent>
        <Formik
          initialValues={{
            busNumber: "",
            plateNumber: "",
            busType: "Standard",
            farePerKm: 0,
            canBeRented: false,
            status: "Active",
            seatLayout: [],
          }}
          validationSchema={busSchema}
          onSubmit={(values, { setSubmitting }) => {
            const formData = new FormData()
            formData.append("busNumber", values.busNumber)
            formData.append("plateNumber", values.plateNumber)
            formData.append("busType", values.busType)
            formData.append("farePerKm", values.farePerKm.toString())
            formData.append("canBeRented", values.canBeRented.toString())
            formData.append("status", values.status)
            if (image) {
              formData.append("image", image)
            }
            formData.append("seatLayout", JSON.stringify(busSeatsArr))
            formData.append("totalSeats", totalSeats.toString())
        
            axios
              .post(`${process.env.NEXT_PUBLIC_API_URL}/bus`, formData)
              .then(() => alert("Bus created successfully!"))
              .catch((error) => alert("Error: " + error.message))
              .finally(() => setSubmitting(false))
          }}
        >
          {({ isSubmitting, setFieldValue, values }) => (
            <Form className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-sm">Bus Number</Label>
                  <Field name="busNumber">
                    {({ field }: any) => <Input {...field} className="h-8 text-sm" placeholder="YTR-001" />}
                  </Field>
                  <ErrorMessage name="busNumber" component="div" className="text-red-500 text-xs mt-1" />
                </div>

                <div>
                  <Label className="text-sm">Plate Number</Label>
                  <Field name="plateNumber">
                    {({ field }: any) => <Input {...field} className="h-8 text-sm" placeholder="MH-12-AB-1234" />}
                  </Field>
                  <ErrorMessage name="plateNumber" component="div" className="text-red-500 text-xs mt-1" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-sm">Bus Type</Label>
                  <Field name="busType">
                    {({ field }: any) => (
                      <Select onValueChange={(value) => setFieldValue("busType", value)} defaultValue={field.value}>
                        <SelectTrigger className="h-8 text-sm">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Standard">Standard</SelectItem>
                          <SelectItem value="Premium">Premium</SelectItem>
                          <SelectItem value="Luxury">Luxury</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  </Field>
                </div>

                <div>
                  <Label className="text-sm">Status</Label>
                  <Field name="status">
                    {({ field }: any) => (
                      <Select onValueChange={(value) => setFieldValue("status", value)} defaultValue={field.value}>
                        <SelectTrigger className="h-8 text-sm">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Active">Active</SelectItem>
                          <SelectItem value="Inactive">Inactive</SelectItem>
                          <SelectItem value="Maintenance">Maintenance</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  </Field>
                </div>
              </div>

              <div>
                <Label className="text-sm">Fare Per KM ($)</Label>
                <Field name="farePerKm">
                  {({ field }: any) => (
                    <Input {...field} type="number" step="0.01" className="h-8 text-sm" placeholder="0.00" />
                  )}
                </Field>
                <ErrorMessage name="farePerKm" component="div" className="text-red-500 text-xs mt-1" />
              </div>

              <div className="flex items-center space-x-2">
                <Field name="canBeRented">
                  {({ field }: any) => (
                    <Checkbox
                      id="canBeRented"
                      checked={field.value}
                      onCheckedChange={(checked) => setFieldValue("canBeRented", checked)}
                    />
                  )}
                </Field>
                <Label htmlFor="canBeRented" className="text-sm">
                  Available for rental
                </Label>
              </div>
              <input type="file" onChange={handleChange}/>

              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-yellow-500 hover:bg-yellow-600 text-white h-9 text-sm"
              >
                {isSubmitting ? "Creating..." : "Create Bus"}
              </Button>

            </Form>
          )}
        </Formik>
      </CardContent>
    </Card>
  )
}



