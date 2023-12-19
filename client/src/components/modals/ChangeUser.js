import React, {useContext, useState} from 'react'
import { Form } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import {changeUser} from '../../http/movieAPI'
import { observer } from 'mobx-react-lite';
import { Context } from '../..';

const ChangeUser = observer(({
        show,
        onHide,
        username,
        setUsername,
        email,
        setEmail,
        bdDate,
        setBDdate,
    }) => {
    const {user} = useContext(Context)
    const [file, setFile] = useState(null)

    const [errorUsername, setUsernameError] = useState('');
    const [errorEmail, setEmailError] = useState('');
    const [errorDate, setDateError] = useState('');
    const [errorAvatar, setAvatarError] = useState('');

    const validateForm = () => {
      let isValid = true;

      if (username.length < 3 || username.length > 12) {
        setUsernameError('*Username must be 3-12 characters long.')
        isValid = false;
      } else if (!/^[a-zA-Z0-9]+$/.test(username)) {
        setUsernameError('*Username can only contain letters and numbers.')
        isValid = false;
      }
      else {
        setUsernameError('');
      }

      if (!/\S+@\S+\.\S+/.test(email)) {
        setEmailError('*Please enter a valid email address (xxx@xxx.xxx).')
        isValid = false;
      }
      else if (!email) {
        setEmailError('*Please enter a email!');
        isValid = false;
      }
      else {
        setEmailError('')
      }

      if (!bdDate) {
        setDateError('*Please select the bdDate!');
        isValid = false;
      }    
      else if (new Date(bdDate) > new Date()) {
        setDateError('*Release date cannot be in the future!');
          isValid = false;
      }
      else {
        setDateError('');
      }
  
      return isValid;
    }

    const selectFile = e => {
        setFile(e.target.files[0])
    }

    const updateUser = async () => {
      if (!validateForm()) {
        return;
      } else {
        try {
          let data
          const formData = new FormData()
          formData.append('User_id', user.userID)
          formData.append('Username', username)
          formData.append('Email', email)
          formData.append('Birthday_date', bdDate)
          if(file) {
              formData.append('Avatar', file)
          } else {
              formData.append('Avatar', null)
          }
          data = await changeUser(formData).then(() => {
            alert('Информация об аккаунте успешно изменена!')
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
          <Modal.Title>Edit information</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <Form>
                <Form.Label>Avatar:</Form.Label>
                <Form.Control
                        placeholder='Input username'
                        type="file"
                        onChange={selectFile}
                />
                {errorAvatar && <div>{errorAvatar}</div>}
                <Form.Label className='mt-3'>Username:</Form.Label>
                <Form.Control
                        placeholder='Input username'
                        value={username}
                        onChange={e => setUsername(e.target.value)}
                />
                {errorUsername && <div>{errorUsername}</div>}
                <Form.Label className='mt-3'>Email:</Form.Label>
                <Form.Control
                        placeholder='Input email'
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                />
                {errorEmail && <div>{errorEmail}</div>}
                <Form.Label className='mt-3'>Birthday_date: {new Date(bdDate).toLocaleDateString()}</Form.Label>
                <Form.Control
                        placeholder='Input date'
                        type='date'
                        value={bdDate}
                        onChange={e => setBDdate(e.target.value)}
                />
                {errorDate && <div>{errorDate}</div>}
            </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={onHide}>
            Close
          </Button>
          <Button variant="primary" onClick={updateUser}>
            Change
          </Button>
        </Modal.Footer>
      </Modal>
  );
})

export default ChangeUser;