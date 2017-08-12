



export class NightmareDriver {


    promise: Promise<any>
    constructor(public nightmare: any, public reqID: number) {

    }


    goto(url: String) {
        console.log(this.reqID, 'client.goto', url);
        this.nightmare = this.nightmare.goto(url);
        // .inject('js', 'node_modules/jquery/dist/jquery.min.js')
        // .inject('js', 'jqextract.js');
        return this;
    }

    extract(fn: Function) {
        console.log(this.reqID, 'client.extract');
        this.nightmare = this.nightmare.evaluate(fn);
        return this.nightmare;
    }


    runDriverScript(driverScript: any) {
        console.log(this.reqID, 'server.runDriverScript');
        try {
            this.promise = driverScript(this);

        } catch (error) {
            console.log(error);
        }
        return this;
    }

    finish(serverFn: any) {
        this.promise.then((result) => {
            serverFn(200, result);
        }).catch((error) => {
            serverFn(500, error);
        }).then(() => {
            console.log(this.reqID, 'server.finish');
        });
        return this;
    }

}
