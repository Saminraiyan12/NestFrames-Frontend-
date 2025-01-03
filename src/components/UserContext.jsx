import { createContext, useEffect } from "react";
import { useState } from "react";


export const UserContext = createContext();


export function UserProvider({children}){
  const [user, setUser] = useState(null);
  
  return(
    <UserContext.Provider value={{user,setUser}}>
      {children}
    </UserContext.Provider>
  )
}