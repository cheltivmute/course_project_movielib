import React, { useContext, useState} from 'react'
import { Form } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { Context } from "../../index";
import { changeFolder} from '../../http/movieAPI'
import { observer } from 'mobx-react-lite';


const ChangeFolder = observer(({
        show,
        onHide,
        folderName,
        folderDescr,
        folderId,
        setFolderName,
        setFolderDescr
    }) => {
    const {user} = useContext(Context)
    const [file, setFile] = useState(null)
    const [errorTitle, setErrorTitle] = useState('');
    const [errorCover, setErrorCover] = useState('');
    const [errorDescription, setErrorDescription] = useState('');

    const validateForm = () => {
        let isValid = true;
        if(!folderName) {
            setErrorTitle('*Please enter the title!');
            isValid = false;
        }
        else if (folderName.length > 13) {
            setErrorTitle('*Title should be less then 13 characters');
            isValid = false;
        }
        else if (!/^[a-zA-Zа-яА-Я0-9\s!"#$%&'()*+,-./:;<=>?@[\]^_`{|}~]+$/.test(folderName)) {
            setErrorTitle('*Title should only contain letters, numbers, spaces, and special characters');
            isValid = false;
        } else {
            setErrorTitle('');
        }
    
        if (!folderDescr) {
            setErrorDescription('*Please enter the description!');
            isValid = false;
        }
        else if (folderDescr.length > 110) {
            setErrorDescription('Description should be less then 110 characters');
            isValid = false;
        } else {
            setErrorDescription('');
        }
    
        return isValid;
    }

    const selectFile = e => {
        setFile(e.target.files[0])
    }

    const updateFolder = async () => {
        if (!validateForm()) {
            return;
        } else {
            try {
                let data
                const formData = new FormData()
                formData.append('User_id', user.userID)
                formData.append('Folder_id', folderId)
                formData.append('Folder_name', folderName)
                if(file) {
                    formData.append('Cover', file)
                } else {
                    formData.append('Cover', null)
                }
                formData.append('Description', folderDescr)
                data = await changeFolder(formData).then(() => {
                    alert('Папка успешно изменена!')
                    onHide()
                })
            } catch (e) {
                alert(e.response.data.message)
            }
        }    
    }
    
    return (
        <Modal show={show} onHide={onHide}>
            <Modal.Header closeButton>
            <Modal.Title>Edit folder</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Control
                        value={folderName}
                        onChange={e => setFolderName(e.target.value)}
                        className='mt-3'
                        placeholder='Input folder name'
                    />
                    {errorTitle && <div>{errorTitle}</div>}          
                    <Form.Control
                        className='mt-3'
                        placeholder='Add folder cover'
                        type='file'
                        onChange={selectFile}
                    />
                    {errorCover && <div>{errorCover}</div>}  
                    <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
                        <Form.Label>Input description:</Form.Label>
                        <Form.Control
                            value={folderDescr}
                            onChange={e => setFolderDescr(e.target.value)}
                            as="textarea"
                            rows={3}
                        />
                    </Form.Group>
                    {errorDescription && <div>{errorDescription}</div>}  
                </Form>
            </Modal.Body>
            <Modal.Footer>
            <Button variant="secondary" onClick={() => {
                    onHide()
                }}>
                Close
            </Button>
            <Button variant="primary" onClick={updateFolder}>
                Change
            </Button>
            </Modal.Footer>
        </Modal>
    );
})

export default ChangeFolder;