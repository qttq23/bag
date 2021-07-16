import {Person} from './Person';
import {Section} from './Section';
import { Schema, model, connect, Types, Document } from 'mongoose';

export interface Paper {
	_id: Types.ObjectId;
	name: string;
	description?: string;
	author: Person;
	sections: Section[];
}