
import {Section} from '../model/Section';
import { Schema, model, connect, Document } from 'mongoose';


// construct Mongoose's model
const collectionName = 'Section';
const schema = new Schema<Section>({
	_id: Schema.Types.ObjectId,
	name: { type: String, required: true },
	content: { type: String, required: true },
},{ collection: collectionName });

export const SectionModel = model<Section>(collectionName, schema);


// make repo
export class SectionRepo {

	save = async (section: Section): Promise<Section & Document<any, any, Section>> =>{

		const doc = new SectionModel(section);
		return await doc.save();
	};


	find = async(sectionInfo: Object): Promise<(Section & Document<any, any, Section>)[]>=>{
		return await SectionModel.find(sectionInfo);
	};
}