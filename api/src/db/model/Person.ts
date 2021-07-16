
import { Schema, model, connect, Types } from 'mongoose';

export interface Person {
	_id: string;
	name: string;
	email: string;
	description?: string;
}