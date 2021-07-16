
import {Person} from '../model/Person';
import { Schema, model, connect, Document } from 'mongoose';


// construct Mongoose's model
const collectionName = 'Person';
const schema = new Schema<Person>({
	_id: String,
	name: { type: String, required: true },
	email: { type: String, required: true },
	description: String,
},{ collection: collectionName });

export const PersonModel = model<Person>(collectionName, schema);


// make repo
export class PersonRepo {

	save = async (person: Person): Promise<Person & Document<any, any, Person>> =>{

		const doc = new PersonModel(person);
		return await doc.save();
	};


	find = async(personInfo: Object): Promise<(Person & Document<any, any, Person>)[]>=>{
		return await PersonModel.find(personInfo);
	};
}