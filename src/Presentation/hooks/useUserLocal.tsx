import { User } from '../../Domain/entities/User';
import { GetUserUseCase } from '../../Domain/useCases/userLocal/GetUserLocal';
import React, { useEffect, useState } from 'react'

export const useUserLocal = () => {

    const [user, setUser] = useState<User>()
    useEffect(()=>{
        getUserSession();
      },[])
      const getUserSession = async() =>{
        const user = await GetUserUseCase()
        setUser(user)
      }
  return {
    user,getUserSession
  }
}

