import React, { useState } from 'react';
import { Form } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { createGenre } from '../../http/movieAPI';
import { observer } from 'mobx-react-lite';

const CreateGenre = observer(({ show, onHide }) => {
  const [value, setValue] = useState('');
  const [error, setError] = useState('');

  const addGenre = async () => {
    
      try {
        let data
        if (value.length < 3 || value.length > 12) {
          setError('*Genre name should be between 3 and 12 characters');
          return;
        } else if (!/^[a-zA-Z]+$/.test(value)) {
          setError('*Genre name should be contain only characters');
          return;
        }

        data = await createGenre({ Genre_name: value }).then(() => {
          setValue('');
          setError('');
          alert('Жанр ' + value + ' успешно добавлен!')
          onHide();

        })        
      } catch (e) {
        alert(e.response.data.message)
      }
  } 

  const handleChange = (e) => {
    setValue(e.target.value);
    setError('');
  };

  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>Add new genre</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Control
            value={value}
            onChange={handleChange}
            placeholder={'Input genre name'}
          />
          {error && <div className="error-message">{error}</div>}
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Close
        </Button>
        <Button variant="primary" onClick={addGenre}>
          Add
        </Button>
      </Modal.Footer>
    </Modal>
  );
});

export default CreateGenre;