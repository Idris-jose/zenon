'use client'

import Link from "next/link"
import Image from "next/image"
import { sidebarLinks } from "../constants"
import { cn } from "../lib/utils"
import { usePathname } from "next/navigation"
export default function Sidebar({user}: SiderbarProps){
        const pathname = usePathname()
    return(
   <section className="sidebar md:hidden p-1">
     <nav className="flex flex-col gap-4">
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
      {sidebarLinks.map((item) => {
          const isActive = pathname === item.route || pathname?.startsWith(`${item.route}/`)

   return (
  <Link
    href={item.route}
    key={item.label}
    className={cn(
      'flex items-center gap-3 px-4 py-2 rounded-lg transition-colors duration-200',
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
)
        })}
        USER
     </nav>

     FOOTER
    </section>
)
}