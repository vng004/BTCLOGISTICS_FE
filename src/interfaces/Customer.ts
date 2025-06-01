import { Parcel } from "./Parcel";

export interface Customer{
    _id:string ,
    customerCode: string,
    fullName: string,
    address: string,
    phone: string,
    email: string,
    parcels?: Parcel[]
}