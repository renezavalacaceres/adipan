export interface User {
    id?:             string;
    name:            string;
    dni:             string;
    phone:           string;
    direccion:       string;
    region:          string;
    provincia:       string;
    distrito:        string;
    email:           string;
    password:        string;
    session_token?:  string;
    notification_token?:  string;
    credito?: number;          // Monto de crédito o valor numérico
    creditoActivo?: Number | boolean; 
}