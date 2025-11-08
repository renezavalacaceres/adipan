import axios from 'axios'
const ApiAdipanApp = axios.create({
    baseURL: 'http://192.168.18.12:3001/api',
    headers:{
        'Content-Type': 'application/json'
    }
})
export {ApiAdipanApp}