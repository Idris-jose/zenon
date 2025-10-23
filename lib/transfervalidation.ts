import { z } from "zod"

export const formSchema = z.object({
  from: z.string().min(1, {
    message: "Please select a source account.",
  }),
  to: z.string().min(1, {
    message: "Please select a destination account.",
  }),
  amount: z.string().refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
    message: "Please enter a valid positive amount.",
  }),
})

export type FormSchemaType = z.infer<typeof formSchema>
