import {
  FormControl,
  FormField,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Control } from "react-hook-form"
import { z } from "zod"
import { formSchema } from "../lib/validation"

interface CustomInputProps {
  name: keyof z.infer<typeof authformschema>
  label: string
  placeholder: string
  control: Control<z.infer<typeof authformschema>>
  type?: string
}

const authformschema = formSchema('signup');

export default function CustomInput({
  control,
  name,
  label,
  placeholder,
  type = "text",
}: CustomInputProps) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <div className="form-item">
          <FormLabel className="form-label">{label}</FormLabel>
          <div className="flex w-full flex-col">
            <FormControl>
              <Input
                placeholder={placeholder}
                className="input-class"
                type={type}
                {...field}
              />
            </FormControl>
            <FormMessage className="form-message mt-2" />
          </div>
        </div>
      )}
    />
  )
}
