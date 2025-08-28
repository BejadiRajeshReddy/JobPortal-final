export class Response {
    status: number;
    module: string;
    subModule: string;
    message: string;
    result: Array<any>;

    constructor(status: number, module: string, subModule: string, message: string, result: any) {
        this.status = status;
        this.module = module;
        this.subModule = subModule;
        this.message = message;
        this.result = result;
    }

}

