import { UserLocalRepositoryImpl } from "../../../Data/repositories/UserLocalRepository";
import { User } from "../../../Domain/entities/User";

const {save} = new UserLocalRepositoryImpl();

export const SaveUserUseCase = async (user: User)=>{
      console.log("💾 Guardando usuario en AsyncStorage:", user);
    return await save(user)
}