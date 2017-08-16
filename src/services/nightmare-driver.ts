
import {Nightmare} from './nightmare'


export class NightmareDriver {


    promise: Promise<any>
    constructor(private  _nightmare: Nightmare, public reqID: number) {

    }


    goto(url: string) {
        console.log(this.reqID, 'client.goto', url);
        this._nightmare = this._nightmare.goto(url);
        // .inject('js', 'node_modules/jquery/dist/jquery.min.js')
        // .inject('js', 'jqextract.js');
        return this;
    }

    extract(fn: Function) {
        console.log(this.reqID, 'client.extract');
        this._nightmare = this._nightmare.evaluate(fn as any);
        return this._nightmare;
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


    nightmare(): Nightmare{
        return this._nightmare;
    }

}
