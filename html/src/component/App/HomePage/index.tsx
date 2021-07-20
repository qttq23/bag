import React from 'react';
import axios from 'axios';
import { PaperApi } from '../../../api/PaperApi';
import { Paper } from '../../../model/Paper';
import { SectionPanel} from './SectionPanel';
import { Section } from '../../../model/Section';
import { FirebaseAPI } from '../../../fb';
import Container from 'react-bootstrap/esm/Container';
import Row from 'react-bootstrap/esm/Row';
import Col from 'react-bootstrap/esm/Col';
import Navbar from 'react-bootstrap/esm/Navbar';
import Button from 'react-bootstrap/esm/Button';

import { ProSidebar, Menu, MenuItem, SubMenu } from 'react-pro-sidebar';
import 'react-pro-sidebar/dist/css/styles.css';
import { FaGem, FaHeart, FaUserAlt } from 'react-icons/fa';
import { IoMenu } from "react-icons/io5";

type MyProps = {
    // using `interface` is also ok
    // message: string;
    onSignOut: () => void;

};
type MyState = {
    papers: Paper[];
    selectedPaper: Paper | null;
    statusMessage: string,
    userEmail: string,
    isCollapse: boolean,
    isToggled: boolean
};

class HomePageOld extends React.Component<MyProps, MyState> {

    state: MyState = {
        papers: [],
        selectedPaper: null,
        statusMessage: 'empty...',
        userEmail: 'empty email...',
        isCollapse: false,
        isToggled: true
    };


    componentDidMount() {

        // get user's name
        let fb = new FirebaseAPI();
        fb.getUser().then(user => {
            if (!user) return;

            this.setState({
                userEmail: user.email || 'email not found'
            });

            // get papers
            this.getPapers();
        });


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
        let customNavBar = <Navbar bg="primary" variant="dark" expand="md" fixed={undefined}>
            <Container style={{ backgroundColor: '' }} fluid>



                <Navbar.Brand href="#home">
                    <Button
                        variant="dark"
                        className="d-none d-md-inline"
                        onClick={() => {
                            this.setState({
                                isCollapse: !this.state.isCollapse
                            });

                        }}>
                        <IoMenu size={20} />

                    </Button>

                    <Button
                        variant="light"
                        className="d-inline d-md-none"
                        onClick={() => {
                            this.setState({
                                isCollapse: false,
                                isToggled: !this.state.isToggled
                            });

                        }}>
                        <IoMenu size={20} />

                    </Button>


                                &emsp;
                                Bag Homepage
                            </Navbar.Brand>
                <Navbar.Toggle children={
                    <FaUserAlt />
                } />
                <Navbar.Collapse className="justify-content-end">
                    <Navbar.Brand>
                        {this.state.userEmail}
                                &emsp;
                                <Button variant="secondary"
                            onClick={this.handleSignOut}
                        >sign out</Button>

                    </Navbar.Brand>
                </Navbar.Collapse>
            </Container>
        </Navbar>;


        return (
            <div style={{ backgroundColor: '', height: '100%' }} className="d-flex flex-column">
                <div className="d-none d-md-block ">
                    {customNavBar}
                </div>


                <div className="d-flex flex-row flex-fill" style={{ backgroundColor: '' }}>
                    <div style={{ backgroundColor: '' }}>
                        <ProSidebar
                            collapsed={this.state.isCollapse}
                            breakPoint="md"
                            onToggle={() => {
                                this.setState({
                                    isToggled: !this.state.isToggled
                                })
                            }}
                            toggled={this.state.isToggled}
                        >
                            <Menu iconShape="square">

                                <MenuItem icon={<FaGem />}>Dashboard</MenuItem>

                                <SubMenu title="Papers" icon={<FaHeart />} defaultOpen={true}>
                                    {papers.map((paper) =>
                                        <MenuItem key={paper._id} onClick={() => this.handlePaperClick(paper._id)}>
                                            {paper.name}
                                        </MenuItem>
                                    )}
                                </SubMenu>

                                <SubMenu title="Items" icon={<FaHeart />} defaultOpen={true}>
                                    <MenuItem>item 1</MenuItem>
                                    <MenuItem>item 2</MenuItem>
                                </SubMenu>
                            </Menu>
                        </ProSidebar>
                    </div>
                    <div className="flex-fill d-flex flex-column" style={{ backgroundColor: '' }} >

                        <div className="d-block d-md-none">
                            {customNavBar}
                        </div>


                        <Container style={{ backgroundColor: '' }} >

                            <Row>


                                <Col>



                                    <div style={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        margin: 'auto'
                                    }} >
                                        {/* hoome page, user: {this.state.userEmail} */}
                                        <div>status: {statusMessageElement}</div>




                                        <div>
                                            {selectedPaper?.sections.map((section) =>
                                                <SectionPanel key={section._id}
                                                    section={section}
                                                    onSectionChange={this.handleSectionChange}
                                                    onSectionSave={this.handleSectionSave}
                                                />
                                            )}
                                        </div>
                                        <br />
                                        {
                                            selectedPaper ?
                                                <Button variant="outline-primary" onClick={this.handleAddClick}>Add section</Button>
                                                : ''
                                        }
                                        <Button variant="outline-primary" onClick={this.handleAddClick}>Add section</Button>
                                        <Button variant="outline-primary" onClick={this.handleAddClick}>Add section</Button>
                                        <Button variant="outline-primary" onClick={this.handleAddClick}>Add section</Button>
                                        <Button variant="outline-primary" onClick={this.handleAddClick}>Add section</Button>
                                        <Button variant="outline-primary" onClick={this.handleAddClick}>Add section</Button>
                                        <Button variant="outline-primary" onClick={this.handleAddClick}>Add section</Button>
                                        <Button variant="outline-primary" onClick={this.handleAddClick}>Add section</Button>
                                        <Button variant="outline-primary" onClick={this.handleAddClick}>Add section</Button>
                                    </div>

                                </Col>
                            </Row>
                        </Container>




                    </div>


                </div>
            </div>
        );
    }

}

export const HomePage = (props: MyProps) => {

    const [state, setState] = React.useState<MyState>({
        papers: [],
        selectedPaper: null,
        statusMessage: 'empty...',
        userEmail: 'empty email...',
        isCollapse: false,
        isToggled: true
    });

    async function getPapers() {
        state.statusMessage = 'getting papers...';
        setState({...state});

        let api = new PaperApi();
        let papers = await api.getListPaper(
            await new FirebaseAPI().getIdToken());
        console.log(papers);

        state.papers = papers;
        state.statusMessage = 'done papers';
        setState({...state});

        getOnePaper(papers[0]._id);
    }

    async function getOnePaper(paperId: string) {
        state.statusMessage = 'getting one paper...';
        setState({...state});

        let api = new PaperApi();
        let paper = await api.getOnePaper(
            await new FirebaseAPI().getIdToken(), paperId);
        console.log(paper);

        state.selectedPaper = paper;
        state.statusMessage = 'done one paper';
        setState({...state});
    }

    async function updateSection(paperId: string, section: Section) {
        state.statusMessage = 'updating section...';
        setState({...state});

        let api = new PaperApi();
        let updatedSection = await api.updateSection(
            await new FirebaseAPI().getIdToken(), paperId, section);
        console.log(updatedSection);

        //
        let sections = state.selectedPaper?.sections || [];
        for (let sec of sections) {
            if (sec._id === updatedSection?._id) {
                sec = updatedSection;
            }
        }
        state.selectedPaper = state.selectedPaper;
        state.statusMessage = 'done update section';
        setState({...state});
    }

    async function addSection(paperId: string) {
        state.statusMessage = 'adding section...';
        setState({...state});

        let api = new PaperApi();
        let newSection = await api.addSection(
            await new FirebaseAPI().getIdToken(), paperId);
        console.log(newSection);

        let sections = state.selectedPaper?.sections || [];
        if (newSection) {
            sections.push(newSection);
            state.selectedPaper = state.selectedPaper;
            setState({...state});
        }

        state.statusMessage = 'done add section';
        setState({...state});
    }

    let handlePaperClick = (paperId: string) => {
        getOnePaper(paperId);
    }

    let handleSectionChange = (section: Section) => {

        let sections = state.selectedPaper?.sections || [];
        for (let sec of sections) {
            if (sec._id === section._id) {
                sec.content = section.content;
                break;
            }
        }

        state.selectedPaper = state.selectedPaper;
        setState({...state});
    }

    let handleSectionSave = (section: Section) => {
        let paperId = state.selectedPaper?._id;
        if (!paperId) return;

        updateSection(paperId, section);
    }

    let handleAddClick = (event: any) => {
        if (state.selectedPaper) {

            addSection(state.selectedPaper._id);
        }
    }

    let handleSignOut = async (event: any) => {

        // let fb = new FirebaseAPI();
        // await fb.signOut();

        // localStorage.setItem('isSignedIn', 'false');
        props.onSignOut();
    }

    React.useEffect(() => {
        console.log('home page effect..');

        // get user's name
        let fb = new FirebaseAPI();
        fb.getUser().then(user => {
            if (!user) return;

            state.userEmail = user.email || 'email not found';
            setState({...state});

            // get papers
            getPapers();
        });

    }, []);


    let papers = state.papers;
    let selectedPaper = state.selectedPaper;
    let statusMessage = state.statusMessage;
    let statusMessageElement = <p>{statusMessage}</p>;
    if (statusMessage.startsWith('done')) {
        statusMessageElement = <p style={{ color: 'green', fontWeight: 'bold' }}>{statusMessage}</p>;
    }
    let customNavBar = <Navbar bg="primary" variant="dark" expand="md" fixed={undefined}>
        <Container style={{ backgroundColor: '' }} fluid>



            <Navbar.Brand href="#home">
                <Button
                    variant="dark"
                    className="d-none d-md-inline"
                    onClick={() => {
                        state.isCollapse = !state.isCollapse;
                        setState({...state});

                    }}>
                    <IoMenu size={20} />

                </Button>

                <Button
                    variant="light"
                    className="d-inline d-md-none"
                    onClick={() => {
                        state.isCollapse =  false;
                        state.isToggled = !state.isToggled;
                        setState({...state});

                    }}>
                    <IoMenu size={20} />

                </Button>


                                &emsp;
                                Bag Homepage
                            </Navbar.Brand>
            <Navbar.Toggle children={
                <FaUserAlt />
            } />
            <Navbar.Collapse className="justify-content-end">
                <Navbar.Brand>
                    {state.userEmail}
                                &emsp;
                                <Button variant="secondary"
                        onClick={handleSignOut}
                    >sign out</Button>

                </Navbar.Brand>
            </Navbar.Collapse>
        </Container>
    </Navbar>;


    return (
        <div style={{ backgroundColor: '', height: '100%' }} className="d-flex flex-column">
            <div className="d-none d-md-block ">
                {customNavBar}
            </div>


            <div className="d-flex flex-row flex-fill" style={{ backgroundColor: '' }}>
                <div style={{ backgroundColor: '' }}>
                    <ProSidebar
                        collapsed={state.isCollapse}
                        breakPoint="md"
                        onToggle={() => {
                            state.isToggled = !state.isToggled;
                            setState({...state});
                        }}
                        toggled={state.isToggled}
                    >
                        <Menu iconShape="square">

                            <MenuItem icon={<FaGem />}>Dashboard</MenuItem>

                            <SubMenu title="Papers" icon={<FaHeart />} defaultOpen={true}>
                                {papers.map((paper) =>
                                    <MenuItem key={paper._id} onClick={() => handlePaperClick(paper._id)}>
                                        {paper.name}
                                    </MenuItem>
                                )}
                            </SubMenu>

                            <SubMenu title="Items" icon={<FaHeart />} defaultOpen={true}>
                                <MenuItem>item 1</MenuItem>
                                <MenuItem>item 2</MenuItem>
                            </SubMenu>
                        </Menu>
                    </ProSidebar>
                </div>
                <div className="flex-fill d-flex flex-column" style={{ backgroundColor: '' }} >

                    <div className="d-block d-md-none">
                        {customNavBar}
                    </div>


                    <Container style={{ backgroundColor: '' }} >

                        <Row>

                            <Col>

                                <div style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    margin: 'auto'
                                }} >
                                    {/* hoome page, user: {this.state.userEmail} */}
                                    <div>status: {statusMessageElement}</div>




                                    <div>
                                        {selectedPaper?.sections.map((section) =>
                                            <SectionPanel key={section._id}
                                                section={section}
                                                onSectionChange={handleSectionChange}
                                                onSectionSave={handleSectionSave}
                                            />
                                        )}
                                    </div>
                                    <br />
                                    {
                                        selectedPaper ?
                                            <Button variant="outline-primary" onClick={handleAddClick}>Add section</Button>
                                            : ''
                                    }
                                    <Button variant="outline-primary" onClick={handleAddClick}>Add section</Button>
                                    <Button variant="outline-primary" onClick={handleAddClick}>Add section</Button>
                                    <Button variant="outline-primary" onClick={handleAddClick}>Add section</Button>
                                    <Button variant="outline-primary" onClick={handleAddClick}>Add section</Button>
                                    <Button variant="outline-primary" onClick={handleAddClick}>Add section</Button>
                                    <Button variant="outline-primary" onClick={handleAddClick}>Add section</Button>
                                    <Button variant="outline-primary" onClick={handleAddClick}>Add section</Button>
                                    <Button variant="outline-primary" onClick={handleAddClick}>Add section</Button>
                                </div>

                            </Col>
                        </Row>
                    </Container>




                </div>


            </div>
        </div>
    );

}
