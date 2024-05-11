export interface IUser{
    _id?:string;
    email?:string;
    name?:string;
    age?:number,
    address?:string,
    gender?:string,
    role?:{
        _id:string,
        email:string
    },
    permissions?:{
        _id:string;
        name:string;
        apiPath:string;
        module:string
    }[],
   
}
export interface IRole{
    _id:string,
    name:string
}