import React, { useRef } from 'react';
import axios from 'axios';
import { Section } from '../../../../model/Section';
import { PaperApi } from '../../../../api/PaperApi';
import Form from 'react-bootstrap/esm/Form';
import Button from 'react-bootstrap/esm/Button';
import { FiMaximize2 } from "react-icons/fi";

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


export const SectionPanel = (props: MyProps) => {

    let section = props.section;
    let refText = useRef<HTMLTextAreaElement>(null);
    let refDiv = useRef<HTMLDivElement>(null);

    let handleInputChange = (event: any) => {
        let section = props.section;
        section.content = event.target.value;
        props.onSectionChange(section);
    }

    let handleSaveClick = (event: any) => {
        let section = props.section;
        props.onSectionSave(section);
    }

    let handleCopyClick = (event: any) => {
        if (refText.current) {
            let textArea = refText.current;
            textArea.select();
            textArea.setSelectionRange(0, 99999);  /* For mobile devices */
            document.execCommand("copy");
        }

    }

    let handleFullScreenClick = (event: any)=>{
        if (!document.fullscreenElement) {
            refDiv.current?.requestFullscreen();

        } else {
            document.exitFullscreen();
        }
    }

    // React.useEffect(() => {

    //     function showFullScreen(event: MouseEvent) {
    //         if (!document.fullscreenElement) {
    //             refText.current?.requestFullscreen();

    //         } else {
    //             document.exitFullscreen();
    //         }
    //     }
    //     function registerFullScreen() {
    //         if (refText.current) {
    //             refText.current.addEventListener('dblclick', showFullScreen);
    //         }
    //     }
    //     function unRegisterFullScreen() {
    //         if (refText.current) {
    //             refText.current.removeEventListener('dblclick', showFullScreen);
    //         }
    //     }

    //     registerFullScreen();
    //     return unRegisterFullScreen;

    // }, []);

    return (
        <div ref={refDiv}>
            <Form.Control
                as="textarea"
                placeholder="Leave a comment here"
                style={{ height: '100px' }}

                ref={refText}
                value={section.content}
                onChange={handleInputChange}
            />

            <div className="d-flex justify-content-center">
                <Button variant="primary" onClick={handleSaveClick}>save</Button>
                       &emsp;
                <Button variant="secondary" onClick={handleCopyClick}>copy</Button>
                    &emsp;
                <Button onClick={handleFullScreenClick}>
                    <FiMaximize2 />
                </Button>

            </div>
            <br />
        </div >
    );
};

