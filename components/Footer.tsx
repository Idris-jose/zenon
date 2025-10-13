import Image from "next/image"
import { logoutAccount } from "../lib/actions/user.actions"
import { useRouter } from "next/router"

export default function Footer({user, type = 'desktop'}:FooterProps){
      

   const handleLogOut = async () => {
      
     const loggedOut = await logoutAccount()

     if (loggedOut) {
      console.log('omo')
     }
   }
   
   return(
      <footer className="footer">
         <div className={type === 'mobile' ? 'footer_name-mobile' : 'footer_name'}>
            <p className="text-xl font-bold text-gray-700">
            {user?.firstName || 'o'}
            </p>
         </div>

         <div className={type === 'mobile' ? 'footer_email-mobile' : 'footer_email'}>
            <h1 className="text-12 truncate font-semibold text-gray-600">
                {user.firstName || 'idris'} {user.lastName || 'jose'}
            </h1>
            <p className="text-12 truncate font-normal text-gray-600">
               {user.email || 'idrisjose11@gmail.com'}
            </p>
         </div>

         <div className="footer_image" onClick={handleLogOut}>
          <Image src="icons/logout.svg" alt="logout" fill  />
         </div>

      </footer>
    )
}