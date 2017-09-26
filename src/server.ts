


import * as express from 'express';
import { NightmareDriver } from './services/nightmare-driver';
import { Express, Request, Response } from 'express';

import { join } from 'path';
import { TemplateService } from './services/template-service';


var
    app = express(),
    bodyParser = require('body-parser'),
    fs = require('fs'),
    sprintf = require('sprintf'),
    _ = require('lodash'),
    Nightmare = require('nightmare'),
    nightmareOpts = {
        show: false,
        switches: {
            'ignore-certificate-errors': true
        }
    },
    nightmare = new Nightmare(nightmareOpts);

app.use(bodyParser.text({ type: "*/*" }));

var queue: any[] = [];
// This must be limited to 1 (or boolean) as long as this process is limited to 1 nightmare/electron.
var dispatching = false;
var requestId = 0;

app.get('/*', handleExpressReq);

app.post('/*', handleExpressReq);


const templateService = new TemplateService();
templateService.loadTemplates();

// const server = app.listen(3000, function () {
//     console.log('server.js listening on port 3000!');
// });


function handleExpressReq(req: Request, res: Response) {
    req.setTimeout(0, () => { });
    queue.push({ req: req, res: res });
    dispatchNext();
}

function dispatchNext() {

    // TODO promises will probably help coalesce callbacks and exception handling

    try {
        if (dispatching) {
            console.log('I am too busy. Enqueued request. Queue:', queue.length, 'Dispatching:', dispatching);
            return;
        }

        if (!queue.length) {
            console.log('No more requests queued up. Queue:', queue.length, 'Dispatching:', dispatching);
            return;
        }

        var requestTuple = queue.shift(),
            req = requestTuple.req,
            res = requestTuple.res,
            reqId = ++requestId;

        dispatching = true;
        console.log(reqId, 'Dispatching request', req.path, '. Queue:', queue.length, 'Dispatching:', dispatching);

        if (req.query.template) {
            const templatePath = join(__dirname, '..', 'templates', req.query.template + '.js');
            try {
                let fnStr = templateService.getTemplate(req.query.template, req.query.url);
                return driveRequest(fnStr, reqId);
            } catch (error) {
                if (error.message === 'TEMPLATE.NOT.FOUND') {
                    errorResponse(400, error);
                }

                if (error.message === 'NOT A FUNCTION') {
                    errorResponse(500, error);
                }

            }
        } else {
            return driveRequest(req.body, reqId);
        }

    } catch (e) {
        errorResponse(500, e);
    }

    function driveRequest(fnStr: string, reqId: number) {
        try {
            var userScript = eval(fnStr);
            if (!_.isFunction(userScript)) {
                return errorResponse(400, 'Request body is not a function. Should follow the form (function(driver|nightmare){ /* ... */ })')
            }
            var script;
            if (req.path.indexOf('/driver') == 0) {
                script = userScript;
            } else {
                // Wrap it up as a raw nightmare script
                script = ((driver: NightmareDriver) => {
                    return userScript(driver.nightmare());
                });
            }

            if (nightmare.ended || nightmare.ending) {
                nightmare = new Nightmare(nightmareOpts)
            }

            new NightmareDriver(nightmare, reqId)
                //   .reset()
                .runDriverScript(script)
                .finish((status: number, result: any) => {
                    res.status(status).send(result);
                    res.end();
                    dispatching = false;
                    console.log(reqId, 'Finished positive response. Queue:', queue.length, 'Dispatching:', dispatching);

                    if (!nightmare.ended || !nightmare.ending) {
                        nightmare.end().then(() => dispatchNext()).catch((e: Error) => {
                            console.log('nightmare.end() error')
                            console.log(e)
                            nightmare = new Nightmare(nightmareOpts)
                            dispatchNext()
                        })
                    } else {
                        dispatchNext()
                    }
                });

        } catch (e) {
            errorResponse(400, e);
        }
    }

    function errorResponse(status: number, error: any) {
        console.error(error);
        res.status(status).send(error.toString());
        res.end();
        dispatching = false;
        console.log(reqId, 'Finished error response. Queue:', queue.length, 'Dispatching:', dispatching);
        dispatchNext();
    }

}


export default app;
