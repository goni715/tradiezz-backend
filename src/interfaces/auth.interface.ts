
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

export interface IVerifyOTp {
    email: string;
    otp: string;
}

export interface INewPassword {
    email: string;
    otp: string;
    password: string
}

export interface IChangePassword {
    currentPassword: string;
    newPassword: string;
}