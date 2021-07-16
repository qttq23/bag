
import { Paper } from '../model/Paper';
import { Section } from '../model/Section';
import { Schema, model, connect, Types, Document } from 'mongoose';
import { SectionRepo } from './SectionRepo';
import { PersonRepo } from './PersonRepo';
import { Repo } from './Repo';

// construct Mongoose's model
const collectionName = 'Paper';

const schema = new Schema<Paper>({
	_id: Schema.Types.ObjectId,
	name: { type: String, required: true },
	description: String,
	author: { type: String, ref: 'Person' },
	sections: [{ type: Schema.Types.ObjectId, ref: 'Section' }],

}, { collection: collectionName });

export const PaperModel = model<Paper>(collectionName, schema);


// make repo
export class PaperRepo extends Repo {

	all = async (userId: string): Promise<(Paper & Document<any, any, Paper>)[]> => {


		let users = await (new PersonRepo()).find({ _id: userId });
		if (users.length <= 0) return [];
		let user = users[0];

		return await PaperModel.find({
			author: user._id
		}).exec();
	};

	one = async (userId: string, paperId: string): Promise<Paper & Document<any, any, Paper>> => {


		let users = await (new PersonRepo()).find({ _id: userId });
		if (users.length <= 0) return null;
		let user = users[0];

		return await PaperModel.findOne({
			_id: paperId,
			author: user
		})
			.populate('author')
			.populate('sections')
			.exec();
	};

	find = async (paperInfo: Object): Promise<(Paper & Document<any, any, Paper>)[]> => {
		return await PaperModel.find(paperInfo).populate('author').populate('sections').exec();
	};

	save = async (paper: Paper): Promise<Paper & Document<any, any, Paper>> => {

		const doc = new PaperModel(paper);
		return await doc.save();
	};

	addSection = async (paper: Paper & Document<any, any, Paper>, additionalSections: Section[]): Promise<Paper & Document<any, any, Paper>> => {

		// save sections
		let sectionRepo = new SectionRepo();
		for (let section of additionalSections) {
			await sectionRepo.save(section);
		}

		// update paper
		paper.sections.push(...additionalSections);
		return await paper.save();
	};

	updateSection = async (paper: Paper & Document<any, any, Paper>, updatedSection: Section): Promise<Paper & Document<any, any, Paper>> => {

		// save sections
		let sectionRepo = new SectionRepo();
		await sectionRepo.save(updatedSection);

		return await paper;
	};

	// remove section



}