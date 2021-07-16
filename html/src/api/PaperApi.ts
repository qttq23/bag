import { Paper } from "../model/Paper";
import axios from 'axios';
import { Section } from "../model/Section";

export class PaperApi {

    // baseUrl: string = 'http://localhost:10000/api/paper';
    baseUrl: string = 'https://bag-api-4lendyksaa-uc.a.run.app/api/paper';

    async getListPaper(token: string): Promise<Paper[]> {

        let papers: Paper[] = [];

        try {
            let response = await axios({
                method: 'get',
                url: `${this.baseUrl}/`,
                headers: {
                    'Authorization': token
                }
            });
            let rawList = response.data.result;

            for (let item of rawList) {
                let paper: Paper = {
                    _id: item._id,
                    name: item.name,
                    description: item.description,
                    author: item.author,
                    sections: item.sections
                }
                papers.push(paper);
            }
        } catch (error) {
            console.log(error.response.data);
            console.log(error.response.status);
            console.log(error.response.headers);
        }

        return papers;
    }


    async getOnePaper(token: string, paperId: string): Promise<Paper | null> {

        try {
            let response = await axios({
                method: 'get',
                url: `${this.baseUrl}/${paperId}`,
                headers: {
                    'Authorization': token
                }
            });
            let item = response.data.result;

            let paper: Paper = {
                _id: item._id,
                name: item.name,
                description: item.description,
                author: item.author,
                sections: item.sections
            }
            return paper;

        } catch (error) {
            console.log(error.response.data);
            console.log(error.response.status);
            console.log(error.response.headers);
        }

        return null;
    }

    async updateSection(token: string, paperId: string, section: Section): Promise<Section | null> {

        try {
            const response4 = await axios({
                method: 'put',
                url: `${this.baseUrl}/${paperId}/${section._id}`,
                headers: {
                    'Authorization': token
                },
                data: {
                    content: section.content
                }
            });
            let rawSection = response4.data.result;

            let updatedSection: Section = {
                _id: rawSection._id,
                name: rawSection.name,
                content: rawSection.content,
            }
            return updatedSection;

        } catch (error) {
            console.log(error.response.data);
            console.log(error.response.status);
            console.log(error.response.headers);
        }

        return null;
    }



    async addSection(token: string, paperId: string): Promise<Section | null> {

        try {
            const response3 = await axios({
                method: 'put',
                url: `${this.baseUrl}/${paperId}`,
                headers: {
                    'Authorization': token
                }
            });
            let rawSection = response3.data.result;

            let newSection: Section = {
                _id: rawSection._id,
                name: rawSection.name,
                content: rawSection.content,
            }
            return newSection;

        } catch (error) {
            console.log(error.response.data);
            console.log(error.response.status);
            console.log(error.response.headers);
        }

        return null;
    }



}