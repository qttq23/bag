import React from 'react';
import axios from 'axios';
import { Section } from '../../../../model/Section';
import { PaperApi } from '../../../../api/PaperApi';
import Form from 'react-bootstrap/esm/Form';
import Button from 'react-bootstrap/esm/Button';


type MyProps = {
    // using `interface` is also ok
    // message: string;
    section: Section;
    onSectionChange: (section: Section) => void,
    onSectionSave: (secton: Section) => void

};
type MyState = {
    // localSection: Section;
};

export class SectionPanel extends React.Component<MyProps, MyState> {

    // state: MyState = {
    //     localSection: null
    // };
    refText = React.createRef<HTMLTextAreaElement>();



    componentDidMount() {

    }

    handleInputChange = (event: any) => {
        let section = this.props.section;
        section.content = event.target.value;
        this.props.onSectionChange(section);
    }

    handleSaveClick = (event: any) => {
        let section = this.props.section;
        this.props.onSectionSave(section);
    }

    handleCopyClick = (event: any) => {
        if (this.refText.current) {
            let textArea = this.refText.current;
            textArea.select();
            textArea.setSelectionRange(0, 99999);  /* For mobile devices */
            document.execCommand("copy");
        }

    }

    render() {

        let section = this.props.section;

        return (
            <div >
                <Form.Control
                    as="textarea"
                    placeholder="Leave a comment here"
                    style={{ height: '100px' }}

                    ref={this.refText}
                    value={section.content}
                    onChange={this.handleInputChange}
                />
                {/* <textarea
                    ref={this.refText}
                    style={{ width: '100%', height: '100px' }}
                    value={section.content}
                    onChange={this.handleInputChange}></textarea> */}

                <div className="d-flex justify-content-center">
                    <Button variant="primary" onClick={this.handleSaveClick}>save</Button>
                       &emsp;
                    <Button variant="secondary" onClick={this.handleCopyClick}>copy</Button>

                </div>
                <br/>
            </div >
        );
    }

}

