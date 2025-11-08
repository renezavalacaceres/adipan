import { User } from "../../Domain/entities/User";
import { AuthRepository } from "../../Domain/repositories/AuthRepository";
import { ApiAdipanApp } from "../../Data/source/remote/api/ApiAdipanApp";
import { ResponseApiAdipan } from "../../Data/source/remote/models/ResponseApiAdipan";
import { AxiosError } from "axios";

export class AuthRepositoryImpl implements AuthRepository{
   
    async register(user: User): Promise<ResponseApiAdipan> {
        try {
            const response = await ApiAdipanApp.post<ResponseApiAdipan>('/registro/create', user)
            return Promise.resolve(response.data)
        } catch (error) {
            let e = (error as AxiosError);
            console.log('ERROR:' +JSON.stringify(e.response?.data))
            const apiError:ResponseApiAdipan = JSON.parse(JSON.stringify(e.response?.data))
            return Promise.resolve(apiError)
        }
    }
    async login(email: string, password: string): Promise<ResponseApiAdipan> {
        try {
            const response = await ApiAdipanApp.post<ResponseApiAdipan>('/registro/login', {
            email,
            password,
            });

            // ✅ Extraemos el contenido real del usuario
            const apiData = response.data?.data;

            // ✅ Aseguramos que los campos nuevos se incluyan
            const userWithCredit = {
            ...apiData,
            credito: apiData?.credito ?? 0,
            creditoActivo: apiData?.creditoActivo ?? false,
            };

            // ✅ Retornamos la misma estructura que tu app espera
            return Promise.resolve({
            ...response.data,
            data: userWithCredit,
            });

        } catch (error) {
            const e = error as AxiosError;
            console.log('ERROR:' + JSON.stringify(e.response?.data));
            const apiError: ResponseApiAdipan = JSON.parse(JSON.stringify(e.response?.data));
            return Promise.resolve(apiError);
        }
    }

}