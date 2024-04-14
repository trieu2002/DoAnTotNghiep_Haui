export interface IUser{
    _id:string;
    email:string;
    name:string;
    role:{
        _id:string,
        email:string
    },
    permissions?:{
        _id:string;
        name:string;
        apiPath:string;
        module:string
    }[]
}