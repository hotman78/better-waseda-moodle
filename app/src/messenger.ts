export class MessengerServer {
    instructions: { [key: string]: Function; } = {};
    constructor() {
        browser.runtime.onConnect.addListener(port => {
            port.onMessage.addListener((message: any) => {
                (async () => {
                    const inst = message.inst;
                    const args = message.args;
                    const id = message.id;

                    try {
                        const ret = await this.instructions[inst].apply(undefined, args);
                        port.postMessage({
                            inst: '__retOk',
                            ret,
                            id,
                        });
                    } catch (error) {
                        console.error(`Error while executing instruction '${inst}'`, error);
                        port.postMessage({
                            inst: '__retErr',
                            error: error.message,
                            id,
                        });
                    }
                })();
            });
        });
    }
    addInstruction(name: string, f: Function): void {
        if (name in this.instructions) {
            throw new Error(`Instruction '${name}' already exists`);
        }
        this.instructions[name] = f;
    }
}

export class MessengerClient {
    promises: { [key: number]: { resolve: Function, reject: Function; }; } = {};
    port: browser.runtime.Port;
    constructor(port?: browser.runtime.Port) {
        this.port = port ?? browser.runtime.connect();

        this.port.onMessage.addListener((message: any) => {
            const inst = message.inst;
            const id = message.id;

            switch (inst) {
                case '__retOk':
                    this.promises[id].resolve(message.ret);
                    break;
                case '__retErr':
                    this.promises[id].reject(Error(message.error));
                    break;
                default:
                    throw new Error(`unknown instruction '${inst}'`);
            }
            delete this.promises[id];
        });
    }

    exec(inst: string, ...args: any[]): Promise<any> {
        const id = Math.random();
        const promise = new Promise((resolve, reject) => this.promises[id] = { resolve, reject });
        this.port.postMessage({
            inst,
            args,
            id,
        });

        return promise;
    }
}