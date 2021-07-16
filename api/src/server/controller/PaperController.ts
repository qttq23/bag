
import express from 'express';
import { Types } from 'mongoose';
import { Db } from '../../db/Db';
import { Section } from '../../db/model/Section';
import { PaperRepo } from '../../db/repo/PaperRepo';
import { PersonRepo } from '../../db/repo/PersonRepo';
import { SectionRepo } from '../../db/repo/SectionRepo';

export class PaperController {

    protected _router: express.Router;
    protected _prefixPath: string;
    protected _db: Db;

    constructor(prefixPath: string, db: Db) {
        this._prefixPath = prefixPath;
        this._db = db;
        this._setup();
    }

    getRouter = (): express.Router => {
        return this._router;
    }

    protected _setup = (): void => {
        this._router = express.Router();

        // config routes
        let router = this._router;
        router.get('/', this._getAll.bind(this));
        router.get('/:id', this._get.bind(this));

        // create new paper
        // router.post('/', this._post.bind(this));
        // create new section inside a paper
        router.put('/:id', this.createSection.bind(this));
        // update section inside a paper
        router.put('/:id/:sectionId', this.updateSection.bind(this));


        router.use(this._handleError.bind(this));

    }

    protected async _getAll(req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> {

        console.log('paper getall');

        // user info
        let userId: string = res.locals.userId;
        console.log(userId);
        if (!userId) {
            res.status(400).json({ result: 'not found user' })
            return;
        };


        // get list of papers
        let repo = this._db.getRepo(PaperRepo);
        let papers = await repo.all(userId);

        if (papers.length > 0) {

            res.json({
                result: papers
            });
        }
        else {

            res.status(404).json({
                result: 'not found papers'
            });
        }

    }

    protected async _get(req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> {
        console.log('paper get');

        // user info
        let userId = res.locals.userId;
        if (!userId) res.status(400).json({ result: 'not found user' });

        // paper id
        let paperId = req.params.id;

        // get list of papers
        let repo = this._db.getRepo(PaperRepo);
        let paper = await repo.one(userId, paperId);
        // if papers not found???

        if (paper) {
            res.json({
                result: paper
            });

        }
        else {
            res.status(404).json({
                result: 'not found paper'
            });
        }

    }


    protected async createSection(req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> {

        console.log('create section');

        // user info
        let userId = res.locals.userId;
        if (!userId) res.status(400).json({ result: 'not found user' });

        // paper
        let paperId = req.params.id;

        // section 
        let section: Section = {
            _id: new Types.ObjectId(),
            name: 'default1',
            content: ' '
        };

        let repo = this._db.getRepo(PaperRepo);
        let paper = await repo.one(userId, paperId);
        if(!paper){
            res.status(404).json({
                result: 'paper not found'
            });
            return;
        }
        await repo.addSection(paper, [section]);

        res.status(201).json({
            result: section
        });
    }

    protected async updateSection(req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> {
        console.log('update section');

        // user info
        let userId = res.locals.userId;
        if (!userId) res.status(400).json({ result: 'not found user' });

        // paper
        let paperId = req.params.id;

        // section 
        let sectionId = req.params.sectionId;

        // find
        let paperRepo = this._db.getRepo(PaperRepo);
        let paper = await paperRepo.one(userId, paperId);
        if (!paper) {
            res.status(404).json({
                result: 'paper not found'
            });
            return;
        }

        let isExist = false;
        for (let sec of paper.sections) {
            if (sec._id.equals(sectionId)) {
                isExist = true;
            }
        }

        if (!isExist) {
            res.status(404).json({
                result: 'section not exist for this user'
            });
        }


        let sectionRepo = this._db.getRepo(SectionRepo);
        let sections = await sectionRepo.find({
            _id: sectionId
        });
        let targetSection = sections[0];

        // update
        targetSection.content = req.body.content;
        let updatedSection = await targetSection.save();

        res.status(201).json({
            result: updatedSection
        });
    }

    protected async _handleError(
        err: any,
        req: express.Request,
        res: express.Response,
        next: any
    ): Promise<void> {

        console.error(err.stack);
        res.status(500).send('Something broke! from paper router');
    }


}


