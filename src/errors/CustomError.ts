class CustomError extends Error {
    public statusCode:number;
    
    constructor(statusCode:number, message:string) {
        super(message);
        this.statusCode = statusCode;

        // Maintain proper stack trace
        Error.captureStackTrace(this, this.constructor);
    }
}

export default CustomError;