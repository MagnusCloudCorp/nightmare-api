import * as path from 'path';
import * as fs from 'fs';
import * as _ from 'lodash';

const sprintf = require('sprintf');

export class TemplateService {


    private templateCache: { [x: string]: any } = {};


    loadTemplates(templateDir:string) {
        let templates = fs.readdirSync(templateDir, 'UTF-8')
            .filter((file: string) => file.endsWith('.js')).map((file: string) => path.join(templateDir, file));

        let promises = templates
            .map((file: string) => this.readFile(file)
                .then(content => {


                    let obj: any = {};
                    obj.name = path.basename(file, '.js');
                    obj.template = content;
                    return obj;
                }));

        return Promise.all(promises).then(files => {

            console.log(files.length);
            this.templateCache = files.reduce((acc, val) => {


                acc[val.name] = val.template;
                return acc;
            }, {});
            return true;
        })

    }



    getTemplate(name: string, url: string): string {
        const template = this.templateCache[name];
        if (!template) {
            throw new Error('TEMPLATE.NOT.FOUND')
        }

        var fnStr = sprintf(template, { url });


        // const userScript = eval(fnStr);

        // if (!_.isFunction(userScript)) {
        //     throw new Error('NOT A FUNCTION')
        // }

        return fnStr;
    }

    private readFile(file: string): Promise<string> {
        return new Promise((resolve, reject) => {
            fs.readFile(file, { encoding: 'UTF-8' }, (err, content) => {
                if (err) reject(err);

                resolve(content)
            })
        })
    }

}
