import { z } from "zod"

export const formSchema = ( type:string) => z.object({
  firstName:  type === 'signin' ? z.string().optional() : z.string().min(2, "First name must be at least 2 characters"),
  lastName:  type === 'signin' ? z.string().optional() : z.string().min(2, "Last name must be at least 2 characters"),
  address:  type === 'signin' ? z.string().optional() : z.string().min(5, "Address must be at least 5 characters"),
  city: type === 'signin' ? z.string().optional() : z.string().min(5, "city must be at least 5 characters"),
  state :type === 'signin' ? z.string().optional() :  z.string().min(2, "State must be at least 2 characters"),
  postalCode:  type === 'signin' ? z.string().optional() : z.string().regex(/^\d{5}$/, "Postal code must be 5 digits"),
  dateOfBirth:  type === 'signin' ? z.string().optional() : z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be in YYYY-MM-DD format"),
  ssn:  type === 'signin' ? z.string().optional() : z.string().regex(/^\d{4}$/, "SSN must be 4 digits"),
  username:  type === 'signin' ? z.string().optional() : z.string().min(3, "Username must be at least 3 characters"),
  
   
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
})

export type FormSchemaType = z.infer<ReturnType<typeof formSchema>>