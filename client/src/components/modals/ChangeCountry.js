import React, { useState, useContext } from 'react';
import { Dropdown, Form } from 'react-bootstrap';
import { Context } from '../../index';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { changeCountry } from '../../http/movieAPI';
import { observer } from 'mobx-react-lite';

const ChangeCountry = observer(({ show, onHide }) => {
  const { movie } = useContext(Context);
  const [value, setValue] = useState('');
  const [countryError, setCountryError] = useState('');
  const [nameError, setNameError] = useState('');

  const updateCountry = async () => {
    try {
      let data
      if (!movie.selectedCountry) {
        setCountryError('Please select a country');
        return;
      }

      if (value.length < 3 || value.length > 12) {
        setNameError('Country name should be between 3 and 12 characters');
        return;
      } else if (!/^[a-zA-Z]+$/.test(value)) {
        setNameError('*Genre name should be contain only characters');
        return;
      }

      const formData = new FormData();
      formData.append('Country_id', movie.selectedCountry.Country_id);
      formData.append('Country_name', value);      
      data = await changeCountry(formData).then(() => {
        setValue('');
        movie.setSelectedCountry('');
        setCountryError('');
        setNameError('');
        alert('Страна успешно изменена!')
        onHide()
      });
    } catch (e) {
      alert(e.response.data.message)
    }
  };

  const handleCountrySelect = (country) => {
    movie.setSelectedCountry(country);
    setCountryError('');
  };

  const handleChange = (e) => {
    setValue(e.target.value);
    setNameError('');
  };

  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>Change country</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Dropdown>
          <Dropdown.Toggle>
            {movie.selectedCountry ? movie.selectedCountry.Country_name : 'Pick country'}
          </Dropdown.Toggle>
          <Dropdown.Menu>
            {movie.countries.map((country) => (
              <Dropdown.Item
                onClick={() => handleCountrySelect(country)}
                key={country.Country_id}
              >
                {country.Country_name}
              </Dropdown.Item>
            ))}
          </Dropdown.Menu>
        </Dropdown>
        {countryError && <div className="error-message">{countryError}</div>}
        <Form className="mt-3">
          <Form.Control
            value={value}
            onChange={handleChange}
            placeholder={'Input country name'}
          />
          {nameError && <div className="error-message">{nameError}</div>}
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Close
        </Button>
        <Button variant="primary" onClick={updateCountry}>
          Change
        </Button>
      </Modal.Footer>
    </Modal>
  );
});

export default ChangeCountry;