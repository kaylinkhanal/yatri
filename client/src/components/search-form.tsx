'use client'
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import axios from "axios";
import {
  MapPin,
  ArrowRightLeftIcon as ArrowsRightLeft,
  Calendar,
  Users,
  CircleX,
} from "lucide-react";
import { Formik, Form, useField } from "formik";
import * as Yup from "yup";
import { useState } from "react";
import { BusSearchCard } from "./BusSearchCard";

// This is a custom component to simplify connecting Formik to Shadcn UI inputs.
// It handles the field props and displays validation errors.
const FormikInput = ({ label, icon: Icon, ...props }) => {
  const [field, meta] = useField(props);
  const isError = meta.touched && meta.error;

  return (
    <div className="flex flex-col space-y-1">
      <label htmlFor={props.id || props.name} className="text-sm text-white flex items-center gap-1">
        {Icon && <Icon className="h-4 w-4 text-gold" />}
        {label}:
      </label>
      <Input
        className={`bg-white/80 border-none text-black placeholder:text-gray-600 ${isError ? 'border-red-500' : ''}`}
        {...field}
        {...props}
      />
      {isError && (
        <div className="text-red-500 text-xs mt-1">{meta.error}</div>
      )}
    </div>
  );
};

export default function SearchForm() {
  const [results, setResults] = useState([]);
  const validationSchema = Yup.object({
    from: Yup.string().required("Origin is required"),
    to: Yup.string().required("Destination is required"),
    date: Yup.string(),
    passengers: Yup.number().min(1, 'Must be at least 1').integer(),
  });

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      const {data} = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/routes?stop1=${values.from}&stop2=${values.to}` );

      setResults(data)
      
      // You can handle the response here (e.g., set search results in state, redirect, etc.)
    } catch (error) {
      console.error("Error fetching routes:", error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="relative z-10 w-full max-w-6xl mx-auto px-4 pb-12 md:px-8 lg:px-12">
      <Formik
        initialValues={{
          from: "",
          to: "",
          date: "",
          passengers: 1,
        }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({values, isSubmitting }) => (
          <>
          <Form className="bg-white/20 backdrop-blur-sm rounded-lg p-4 md:p-6 grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
            <FormikInput
              name="from"
              id="from"
              label="From"
              icon={MapPin}
              placeholder="Select location"
            />
            <div className="flex items-center justify-center md:col-span-1">
              <Button
                variant="ghost"
                size="icon"
                className="text-white hover:text-gold"
              >
                <ArrowsRightLeft className="h-6 w-6" />
              </Button>
            </div>
            <FormikInput
              name="to"
              id="to"
              label="To"
              icon={MapPin}
              placeholder="Select destination"
            />
            <FormikInput
              name="date"
              id="date"
              label="Date"
              icon={Calendar}
              type="text"
              placeholder="Departure"
            />
            <FormikInput
              name="passengers"
              id="passengers"
              label="Passengers"
              icon={Users}
              type="number"
              placeholder="1 adult"
            />
            <Button
              type="submit"
              className="col-span-1 md:col-span-5 bg-[#f4c534] text-white hover:bg-gold/90 h-12 text-lg font-semibold"
              disabled={isSubmitting}
            >
              SEARCH
            </Button>
          </Form>
                       {results.length > 0 && (
              <div className=" relative mt-6 bg-white/20 backdrop-blur-sm rounded-lg p-4 md:p-6 space-y-4">
                <button
                  className="absolute top-2 right-2 text-white/80 hover:text-white/40"
                  onClick={() => setResults([])}
                >
                  <CircleX className="w-5 h-5" />
                </button>
                {results.map((route, index) => (
                  <BusSearchCard
                    key={index}
                    {...route}
                    from={values.from}
                    to={values.to}
                  />
                ))}
              </div>
            )}
           </>
        )}

      </Formik>
      
    </div>
  );
}