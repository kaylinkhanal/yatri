"use client"

import Image from "next/image"
import Link from "next/link"
import { useFormik } from "formik"
import * as Yup from "yup"
import { useState } from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
    Card,
    CardAction,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card"
import { Label } from "@radix-ui/react-label"
import axios from "axios"
import { useRouter } from "next/navigation"

export default function LoginPage() {
  const [registrationStatus, setRegistrationStatus] = useState<{ success: boolean; message: string } | null>(null)

  const validationSchema = Yup.object({
    phoneNumber: Yup.string()
      .matches(/^\d{10}$/, "Phone number must be 10 digits")
      .required("Phone Number is required"),
    password: Yup.string().min(6, "Password must be at least 6 characters").required("Password is required"),

  })
  const router = useRouter()
  
  const handleSubmit = async (values) => {
    try{
      const {data} =await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/login`, values)
      if(data.isLoggedIn){
       router.push("/")
      }
    }catch(error) {
      alert(error?.response?.data?.message)
    }

  
   
  }
  const formik = useFormik({
    initialValues: {
      phoneNumber: "",
      password: "",
    },
    validationSchema: validationSchema,
    onSubmit: handleSubmit,  
  })

  return (
   <div>
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-4">
            <Image src="/logo.png" alt="Yatri Logo" width={120} height={120} className="object-contain" priority />
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={formik.handleSubmit} className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="phoneNumber" className="text-gray-700">
                Phone Number
              </Label>
              <Input
                id="phoneNumber"
                type="tel"
                placeholder="1234567890"
                className="bg-white border-gray-300 text-gray-900 focus:ring-gold-DEFAULT focus:border-gold-DEFAULT"
                {...formik.getFieldProps("phoneNumber")}
              />
              {formik.touched.phoneNumber && formik.errors.phoneNumber ? (
                <div className="text-red-500 text-sm">{formik.errors.phoneNumber}</div>
              ) : null}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="password" className="text-gray-700">
                Password
              </Label>
              <Input
                id="password"
                type="password"
                className="bg-white border-gray-300 text-gray-900 focus:ring-gold-DEFAULT focus:border-gold-DEFAULT"
                {...formik.getFieldProps("password")}
              />
              {formik.touched.password && formik.errors.password ? (
                <div className="text-red-500 text-sm">{formik.errors.password}</div>
              ) : null}
            </div>
      
            <Button
              type="submit"
              className="w-full bg-[#f4c534] text-gold-foreground hover:bg-gold-DEFAULT/90"
              disabled={formik.isSubmitting}
            >
              {formik.isSubmitting ? "Login In..." : "Login"}
            </Button>
          </form>
          {registrationStatus && (
            <div
              className={`mt-4 text-center text-sm ${registrationStatus.success ? "text-green-600" : "text-red-600"}`}
            >
              {registrationStatus.message}
            </div>
          )}
          <div className="mt-4 text-center text-sm text-gray-600">
            Dont have an account yet?{" "}
            <Link href="/register" className="underline  text-gold-DEFAULT hover:text-gold-DEFAULT/90">
              Sign Up
            </Link>
          </div>
        </CardContent>
</div>
  )
}
