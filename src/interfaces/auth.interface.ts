
export interface IRegisterEmployerPayload {
    fullName: string;
    email: string;
    phone: string;
    password: string;
}

export interface ILogin {
    email: string;
    password: string;
}