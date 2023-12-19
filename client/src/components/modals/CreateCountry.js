import React, { useState } from 'react';
import { Form } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { createCountry } from '../../http/movieAPI';
import { observer } from 'mobx-react-lite';

const CreateCountry = observer(({ show, onHide }) => {
  const [value, setValue] = useState('');
  const [error, setError] = useState('');

  const addCountry = async () => {
    try {
      let data;
      if (value.length < 3 || value.length > 12) {
        setError('Country name should be between 3 and 12 characters');
        return;
      } else if (!/^[a-zA-Z]+$/.test(value)) {
        setError('*Genre name should be contain only characters');
        return;
      }

      data = await createCountry({ Country_name: value }).then(() => {
        setValue('');
        setError('');
        alert('Страна ' + value + ' успешно добавлена!')
        onHide();
      });
    } catch (e) {
      alert(e.response.data.message)
    }
  };

  const handleChange = (e) => {
    setValue(e.target.value);
    setError('');
  };

  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>Add new country</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Control
            value={value}
            onChange={handleChange}
            placeholder={'Input country name'}
          />
          {error && <div className="error-message">{error}</div>}
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Close
        </Button>
        <Button variant="primary" onClick={addCountry}>
          Add
        </Button>
      </Modal.Footer>
    </Modal>
  );
});

export default CreateCountry;