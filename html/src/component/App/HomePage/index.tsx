import React from 'react';
import axios from 'axios';
import { PaperApi } from '../../../api/PaperApi';
import { Paper } from '../../../model/Paper';
import { SectionPanel } from './SectionPanel';
import { Section } from '../../../model/Section';
import { FirebaseAPI } from '../../../fb';


type MyProps = {
    // using `interface` is also ok
    // message: string;
    onSignOut: () => void;

};
type MyState = {
    papers: Paper[];
    selectedPaper: Paper | null;
    statusMessage: string,
    userEmail: string
};

export class HomePage extends React.Component<MyProps, MyState> {

    state: MyState = {
        papers: [],
        selectedPaper: null,
        statusMessage: 'empty...',
        userEmail: 'empty email...'
    };


    componentDidMount() {

        // get user's name
        let fb = new FirebaseAPI();
        fb.getUser().then(user => {
            if (!user) return;

            this.setState({
                userEmail: user.email || 'email not found'
            });
        });

        // get papers
        this.getPapers();

    }

    async getPapers() {
        this.setState({
            statusMessage: 'getting papers...'
        });

        let api = new PaperApi();
        let papers = await api.getListPaper(
            await new FirebaseAPI().getIdToken());
        console.log(papers);
        this.setState({
            papers: papers,
            statusMessage: 'done papers'
        });

        this.getOnePaper(papers[0]._id);
    }

    async getOnePaper(paperId: string) {
        this.setState({
            statusMessage: 'getting one paper...'
        });

        let api = new PaperApi();
        let paper = await api.getOnePaper(
            await new FirebaseAPI().getIdToken(), paperId);
        console.log(paper);
        this.setState({
            selectedPaper: paper,
            statusMessage: 'done one paper'
        });
    }

    async updateSection(paperId: string, section: Section) {
        this.setState({
            statusMessage: 'updating section...'
        });

        let api = new PaperApi();
        let updatedSection = await api.updateSection(
            await new FirebaseAPI().getIdToken(), paperId, section);
        console.log(updatedSection);

        //
        let sections = this.state.selectedPaper?.sections || [];
        for (let sec of sections) {
            if (sec._id === updatedSection?._id) {
                sec = updatedSection;
            }
        }
        this.setState({
            selectedPaper: this.state.selectedPaper,
            statusMessage: 'done update section'
        });
    }

    async addSection(paperId: string) {
        this.setState({
            statusMessage: 'adding section...'
        });

        let api = new PaperApi();
        let newSection = await api.addSection(
            await new FirebaseAPI().getIdToken(), paperId);
        console.log(newSection);

        let sections = this.state.selectedPaper?.sections || [];
        if (newSection) {
            sections.push(newSection);
            this.setState({
                selectedPaper: this.state.selectedPaper
            });
        }

        this.setState({
            statusMessage: 'done add section'
        });
    }

    handlePaperClick = (paperId: string) => {
        this.getOnePaper(paperId);
    }

    handleSectionChange = (section: Section) => {

        let sections = this.state.selectedPaper?.sections || [];
        for (let sec of sections) {
            if (sec._id === section._id) {
                sec.content = section.content;
                break;
            }
        }

        this.setState({
            selectedPaper: this.state.selectedPaper
        });
    }

    handleSectionSave = (section: Section) => {
        let paperId = this.state.selectedPaper?._id;
        if (!paperId) return;

        this.updateSection(paperId, section);
    }

    handleAddClick = (event: any) => {
        if (this.state.selectedPaper) {

            this.addSection(this.state.selectedPaper._id);
        }
    }

    handleSignOut = async (event: any) => {
        let fb = new FirebaseAPI();
        await fb.signOut();

        localStorage.setItem('isSignedIn', 'false');
        this.props.onSignOut();
    }

    render() {

        let papers = this.state.papers;
        let selectedPaper = this.state.selectedPaper;
        let statusMessage = this.state.statusMessage;
        let statusMessageElement = <p>{statusMessage}</p>;
        if (statusMessage.startsWith('done')) {
            statusMessageElement = <p style={{ color: 'green', fontWeight: 'bold' }}>{statusMessage}</p>;
        }

        return (
            <div style={{
                display: 'flex',
                flexDirection: 'column',
                margin: 'auto'
            }} >
                hoome page, user: {this.state.userEmail}
                <button onClick={this.handleSignOut}>sign out</button>
                <div>status: {statusMessageElement}</div>


                <ul>
                    {papers.map((paper) =>
                        <li key={paper._id}>
                            <button onClick={() => this.handlePaperClick(paper._id)}>{paper.name}</button>
                        </li>
                    )}
                </ul>

                <div>
                    paper content
                </div>
                <ul>
                    {selectedPaper?.sections.map((section) =>
                        <SectionPanel key={section._id}
                            section={section}
                            onSectionChange={this.handleSectionChange}
                            onSectionSave={this.handleSectionSave}
                        />
                    )}
                </ul>
                {
                    selectedPaper ?
                        <button onClick={this.handleAddClick}>Add section</button>
                        : ''
                }
            </div>
        );
    }

}

