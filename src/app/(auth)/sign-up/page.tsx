'use client'
import AuthForm from "../../../../components/AuthForm";

export default function SignUp(){
    return (
     <section className="flex-center size-full max-sm:px-6">
         <AuthForm  type="signUp"/>
     </section>
    )
}