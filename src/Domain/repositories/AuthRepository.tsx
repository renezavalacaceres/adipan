import { ResponseApiAdipan } from "../../Data/source/remote/models/ResponseApiAdipan";
import { User } from "../../Domain/entities/User";

export interface AuthRepository{
    register(user: User): Promise<ResponseApiAdipan>
    login(email: string, password:string): Promise<ResponseApiAdipan>
}