
const path = require('path');

export class Util {

    getAppRootPath = (pathToGet: string = '') => {

        let appRoot = path.resolve(__dirname, '../../');
        return path.join(appRoot, pathToGet);
    }

    loadEnv = () => {

        try {
            let envObj;
            if (process.env.NODE_ENV == 'production') {
                let env = process.env.BAG_ENV;
                envObj = JSON.parse(env);
            }
            else {
                envObj = require(this.getAppRootPath('.env.json'));
            }
            process.env = { ...process.env, ...envObj };

        }
        catch (error) {
            console.log(error);
        }

    }
}