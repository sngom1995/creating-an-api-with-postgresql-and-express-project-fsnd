class CustomExpressError extends Error {
    status: number;
    constructor(message:string, status: number){
        super();
        this.message = message;
        this.status = status;
        console.error(this.stack)
    }
}

export default CustomExpressError;