import { Paper } from "../model/Paper";
import axios from 'axios';
import { Section } from "../model/Section";

export class AuthApi {

    // baseUrl: string = 'http://localhost:10000/api/auth';
    baseUrl: string = 'https://bag-api-4lendyksaa-uc.a.run.app/api/auth';



    async acquireFirstTimeSetUp(token: string): Promise<void> {

        try {
            const response3 = await axios({
                method: 'get',
                url: `${this.baseUrl}/first_time_setup`,
                headers: {
                    'Authorization': token
                }
            });
            let rawSection = response3.data.result;


        } catch (error) {
            console.log(error.response.data);
            console.log(error.response.status);
            console.log(error.response.headers);
        }

    }

}