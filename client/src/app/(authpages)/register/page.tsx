"use client"

import Image from "next/image"
import Link from "next/link"
import { useFormik } from "formik"
import * as Yup from "yup"
import { useState } from "react"
import { toast } from "sonner"
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

export default function RegisterPage() {
  const [registrationStatus, setRegistrationStatus] = useState<{ success: boolean; message: string } | null>(null)

  const validationSchema = Yup.object({
    firstName: Yup.string().required("First Name is required"),
    lastName: Yup.string().required("Last Name is required"),
    phoneNumber: Yup.string()
      .matches(/^\d{10}$/, "Phone number must be 10 digits")
      .required("Phone Number is required"),
    email: Yup.string().email("Invalid email address").required("Email is required"),
    password: Yup.string().min(6, "Password must be at least 6 characters").required("Password is required"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password")], "Passwords must match")
      .required("Confirm Password is required"),
  })

  const handleSubmit = async (values) => {
  try{
    const {data} = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/register`, values)
    toast(data?.message)
  }catch(err){
    toast(err?.response?.data?.message)
  }

  }

  const formik = useFormik({
    initialValues: {
      firstName: "",
      lastName: "",
      phoneNumber: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    validationSchema: validationSchema,
    onSubmit: async (values, { setSubmitting, resetForm }) => {
       handleSubmit(values)
    },  
  })

  return (

     <div>

<CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-4">
            <Image src="/logo.png" alt="Yatri Logo" width={120} height={120} className="object-contain" priority />
          </div>
          <CardTitle className="text-2xl font-bold text-gold-DEFAULT">Create an account</CardTitle>
          <CardDescription className="text-gray-600">Enter your details below to register</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={formik.handleSubmit} className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="firstName" className="text-gray-700">
                First Name
              </Label>
              <Input
                id="firstName"
                type="text"
                placeholder="John"
                className="bg-white border-gray-300 text-gray-900 focus:ring-gold-DEFAULT focus:border-gold-DEFAULT"
                {...formik.getFieldProps("firstName")}
              />
              {formik.touched.firstName && formik.errors.firstName ? (
                <div className="text-red-500 text-sm">{formik.errors.firstName}</div>
              ) : null}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="lastName" className="text-gray-700">
                Last Name
              </Label>
              <Input
                id="lastName"
                type="text"
                placeholder="Doe"
                className="bg-white border-gray-300 text-gray-900 focus:ring-gold-DEFAULT focus:border-gold-DEFAULT"
                {...formik.getFieldProps("lastName")}
              />
              {formik.touched.lastName && formik.errors.lastName ? (
                <div className="text-red-500 text-sm">{formik.errors.lastName}</div>
              ) : null}
            </div>
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
              <Label htmlFor="email" className="text-gray-700">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                className="bg-white border-gray-300 text-gray-900 focus:ring-gold-DEFAULT focus:border-gold-DEFAULT"
                {...formik.getFieldProps("email")}
              />
              {formik.touched.email && formik.errors.email ? (
                <div className="text-red-500 text-sm">{formik.errors.email}</div>
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
            <div className="grid gap-2">
              <Label htmlFor="confirmPassword" className="text-gray-700">
                Confirm Password
              </Label>
              <Input
                id="confirmPassword"
                type="password"
                className="bg-white border-gray-300 text-gray-900 focus:ring-gold-DEFAULT focus:border-gold-DEFAULT"
                {...formik.getFieldProps("confirmPassword")}
              />
              {formik.touched.confirmPassword && formik.errors.confirmPassword ? (
                <div className="text-red-500 text-sm">{formik.errors.confirmPassword}</div>
              ) : null}
            </div>
            <Button
              type="submit"
              className="w-full bg-[#f4c534] text-gold-foreground hover:bg-gold-DEFAULT/90"
              disabled={formik.isSubmitting}
            >
              {formik.isSubmitting ? "Registering..." : "Register"}
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
            Already have an account?{" "}
            <Link href="/login" className="underline text-gold-DEFAULT hover:text-gold-DEFAULT/90">
              Sign in
            </Link>
          </div>
        </CardContent>
     </div>
  )
}
