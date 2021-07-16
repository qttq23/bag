// import dotenv from 'dotenv';
// dotenv.config();

import { Db } from './db/Db';
import { Person } from './db/model/Person';
import { Paper } from './db/model/Paper';
import { Section } from './db/model/Section';
import { PersonRepo } from './db/repo/PersonRepo';
import { SectionRepo } from './db/repo/SectionRepo';
import { PaperRepo } from './db/repo/PaperRepo';
import { Schema, model, connect, Types } from 'mongoose';

async function main() {

    // connect
    let db = new Db();
    let connection = await db.open(`mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASS}@${process.env.MONGO_HOST}/${process.env.MONGO_DB}?retryWrites=true&w=majority`);


    // TODO

    // person
    let p1: Person = {
        _id: 'tui2',
        name: 'Bill23456',
        email: 'bill@initech.com2',
        description: 'https://i.imgur.com/dM7Thhn.png',
    };

    let repo = new PersonRepo();
    let res = await repo.save(p1);
    console.log(res);



    // paper
    let pa1: Paper = {
        _id: new Types.ObjectId(),
        name: 'pay23456',
        description: 'des for pay2',
        author: p1,
        sections: []
    };
    // let paperRepo = new PaperRepo();
    let paperRepo = db.getRepo(PaperRepo);
    let res3 = await paperRepo.save(pa1);
    console.log(res3);


    // section
    let sec1: Section = {
        _id: new Types.ObjectId(),
        name: 's1g',
        content: '<html>abc xyz</html>'
    };
    let sec2: Section = {
        _id: new Types.ObjectId(),
        name: 's2g',
        content: '<html>abc xyz</html>'
    };
    // let sectionRepo = new SectionRepo();
    // await sectionRepo.save(sec1);
    // await sectionRepo.save(sec2);
    let res7 = await paperRepo.find({ _id: pa1._id });
    let res8 = await paperRepo.addSection(res7[0], [sec1, sec2]);
    console.log(res8);

    // // query
    // let res4 = await paperRepo.find({
    // 	_id: pa1._id
    // });
    // console.log(res4);


    // close
    await db.close();

}

// main();
import {Util} from './util/Util';

new Util().loadEnv();
console.log(process.env.SERVICE_ACCOUNT);