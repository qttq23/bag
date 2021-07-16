import { Schema, model, connect, Types } from 'mongoose';

export interface Section {
	_id: Types.ObjectId;
	name: string;
	content: string;
}