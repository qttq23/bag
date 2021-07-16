import {Person} from './Person';
import {Section} from './Section';

export interface Paper {
	_id: string;
	name: string;
	description?: string;
	author: Person;
	sections: Section[];
}