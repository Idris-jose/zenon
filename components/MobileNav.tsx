"use client"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import Image from "next/image"
import Link from "next/link"
import { sidebarLinks } from "../constants"
import { cn } from "../lib/utils"
import { usePathname } from "next/navigation"
import Footer from "./Footer"

export default function MobileNav({ user }: MobileNavProps) {
    const pathname = usePathname()
    return (
   <section className="w-full  max-w-[294px]">
          <Sheet>
  <SheetTrigger>
    <Image 
       src="/icons/hamburger.svg"
       width={30}
       height={30}
       alt="menu"
       className="cursor-pointer"
/>
  </SheetTrigger>
  <SheetContent side="left" className="border-none bg-white p-1">
     <Link 
         className="cursor-pointer flex items-center gap-1 px-4"
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
         {sidebarLinks.map((item) => {
             const isActive = pathname === item.route || pathname?.startsWith(`${item.route}/`)
   
      return (
        <SheetClose asChild key={item.route} >
     <Link
       href={item.route}
       key={item.label}
       className={cn(
         'flex items-center gap-3 px-4 py-2 rounded-lg transition-colors duration-200 mobilenav-sheet_close w-full',
         isActive
           ? 'bg-[#FF7A00] text-white'
           : 'text-gray-700 hover:bg-[#FFF3E0] hover:text-[#FF7A00]'
       )}
     >
       <div className="w-5 h-5 flex items-center justify-center relative flex-shrink-0">
         <Image
           src={item.imgURL}
           alt={item.label}
           fill
           className={cn('object-contain', { 'brightness-[3] invert-0': isActive })}
         />
       </div>
   
       <span
         className={cn(
           'text-[15px] font-medium tracking-tight',
           { '!text-white': isActive }
         )}
       >
         {item.label}
       </span>
     </Link>
     
        </SheetClose>
   )
           })}

           <Footer user={user} type="mobile" />
  </SheetContent>
</Sheet>
    </section>
  )
}