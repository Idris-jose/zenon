'use client'
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { email, z } from "zod"
import { Button } from "@/components/ui/button"
import { FormSchemaType,formSchema } from "../lib/validation";
import {Form,} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
 import CustomInput from "./CustomInput";
import { Loader2 } from "lucide-react";
import { error } from "console";
import { useRouter } from "next/navigation";
import { signIn, signUp } from "../lib/actions/user.actions";

export default function AuthForm({ type }:{ type:string}) {
  const router =useRouter()
    const [user,setUser] = useState(null)  
    const [isLoading,setIsLoading]= useState(false)
    
     const authformschema = formSchema(type);

      // 1. Define your form.
  const form = useForm<z.infer<typeof authformschema>>({
  resolver: zodResolver(authformschema),
  defaultValues: {
    email: "",
    password: "",
  },
})

  // 2. Define a submit handler.
  const onSubmit = async (data: z.infer<typeof authformschema>): Promise<void> => {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    setIsLoading(true)
    try {
      //sign up with appwright & create plaid token
      
      if(type === 'signUp'){
     const newUser = await signUp(data);

      setUser(newUser)
      }

     if(type === 'signin'){
     // await signIn({
       // email: data.email,
       // password: data.password
     // });
        
      router.push('/')
    }

    console.log(data)
    setIsLoading(false)
    } catch (error) {
      console.log(error)
    } finally{
      setIsLoading(false)
    }
   
  }
8
    return(
        <section className="auth-form">
          <header className="flex flex-col gap-5 md:gap-8">
                <Link 
      className="mb-12 cursor-pointer flex items-center gap-2"
      href="/">
         <Image
          src="/icons/logo.svg"
          width={34}
          height={34}
          alt="zenon logo"
          className="size-[24px] max-xl:size-14"
         />
         <h1 className="sidebar-logo">
            Zenon
         </h1>
      </Link>

      <div className="flex flex-col gap-1 md:gap-3">
        <h1 className="text-24 font-semibold text-gray-900 lg:text-36">
            {user ? 'Link Account' : type === 'signin' ? 'Welcome back' : 'Create Account'}
        </h1>
        <p className="text-16 font-normal text-gray-600">
           {user ? 'Link your bank account to get started' : type === 'signin' ? 'Sign in to your account' : 'Sign up to get started'}
        </p>
      </div>
          </header>
          {user ? (
            <div className="flex flex-col gap-4">
                  {/* Bank linking component */}
            </div>
        ):(
            <>
                    <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                
                            {type === "signUp" ? (
              <>
              <div className="flex gap-4">
               <CustomInput control={form.control} name="firstName" label="First Name" placeholder="Enter your first name" />
                <CustomInput control={form.control} name="lastName" label="Last Name" placeholder="Enter your last name" />
              </div>
                <CustomInput control={form.control} name="address" label="Address" placeholder="Enter your address" />
                <CustomInput control={form.control} name="city" label="city" placeholder="Enter your city" />
                 <div className="flex gap-4">
                 <CustomInput control={form.control} name="state" label="state" placeholder="Enter your state" />
                <CustomInput control={form.control} name="postalCode" label="Postal Code" placeholder="example: 11101" />
                 </div>
                 <div className="flex gap-4">
                <CustomInput control={form.control} name="dateOfBirth" label="Date of Birth" placeholder="YYYY-MM-DD" />
                <CustomInput control={form.control} name="ssn" label="SSN" placeholder="example: 1234" />
                 </div>
                   <CustomInput control={form.control} name="username" label="Username" placeholder="Enter your username" />
                   <CustomInput control={form.control} name="email" label="Email" placeholder="Enter your email" />
                <CustomInput control={form.control} name="password" label="Password" placeholder="Enter your password" type="password" />
              </>
            ) : (
              <>
                <CustomInput control={form.control} name="email" label="Email" placeholder="Enter your email" />
                <CustomInput control={form.control} name="password" label="Password" placeholder="Enter your password" type="password" />
              </>
            )}


                {/* Add submit button outside the conditional so it's present for both sign-up and sign-in */}
                <div className="flex flex-col gap-4">
                    <Button type="submit" disabled={isLoading} className="bg-[#FF7A00] p-5 font-bold text-lg text-white cursor-pointer">
                  {isLoading ? (
                    <>
                    <Loader2 size={20}
                    className="animate-spin"
                    /> 
                    </>
                  ) : type === 'signin' ? 'sign in' : 'sign up'} 
                  </Button>
                </div>
           
            </form>
            </Form>
           <footer className="flex justify-center items-center gap-1">
             <p>{type === 'signin' ? "Don't have an account?" : "Already have an account?"}</p>
             <Link
             href={type === 'signin' ? '/sign-up' : '/sign-in'}
             className="form-link"
             >
             {type === 'signin' ? 'signup' : 'signin'}
             </Link>
           </footer>

            </>
        ) }
        </section>
    )
}