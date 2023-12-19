import React, { useContext, useState } from 'react';
import { Dropdown, Form } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { Context } from "../../index";
import { createMovie } from '../../http/movieAPI';
import { observer } from 'mobx-react-lite';

const CreateMovie = observer(({ show, onHide }) => {
  const { movie } = useContext(Context);
  const [title, setTitle] = useState('');
  const [file, setFile] = useState(null);
  const [description, setDescription] = useState(null);
  const [bdDate, setBdDate] = useState(null);
  const [errorTitle, setErrorTitle] = useState('');
  const [errorGenre, setErrorGenre] = useState('');
  const [errorCountry, setErrorCountry] = useState('');
  const [errorDate, setErrorDate] = useState('');
  const [errorCover, setErrorCover] = useState('');
  const [errorDescription, setErrorDescription] = useState('');

  const validateForm = () => {
    let isValid = true;
    if(!title) {
        setErrorTitle('*Please enter the title!');
        isValid = false;
    }
    else if (title.length > 35) {
        setErrorTitle('*Title should be less then 35 characters');
        isValid = false;
    }
    else if (!/^[a-zA-Zа-яА-Я0-9\s!"#$%&'()*+,-./:;<=>?@[\]^_`{|}~]+$/.test(title)) {
        setErrorTitle('*Title should only contain letters, numbers, spaces, and special characters');
        isValid = false;
    } else {
        setErrorTitle('');
    }


    if (!movie.selectedGenre) {
        setErrorGenre('*Please select the genre!');
        isValid = false;
    } else {
        setErrorGenre('');
    }


    if (!movie.selectedCountry) {
        setErrorCountry('*Please select the country!');
        isValid = false;
    } else {
        setErrorCountry('');
    }


    if (!bdDate) {
        setErrorDate('*Please select the bdDate!');
        isValid = false;
    }    
    else if (new Date(bdDate) > new Date()) {
        setErrorDate('*Release date cannot be in the future!');
        isValid = false;
    } else {
        setErrorDate('');
    }
 

    if (!file) {
        setErrorCover('*Please select the file!');
        isValid = false;
    } else {
        setErrorCover('');
    }

    if (!description) {
        setErrorDescription('*Please enter the description!');
        isValid = false;
    }
    else if (description.length > 500) {
        setErrorDescription('Description should be less then 500 characters');
        isValid = false;
    } else {
        setErrorDescription('');
    }

    return isValid;
  }

  const selectFile = e => {
    setFile(e.target.files[0]);
  };

  const addMovie = async () => {
    if (!validateForm()) {
        return;
    } else {
        try {
            let data;    
            const formData = new FormData();
            formData.append('Title', title);
            formData.append('Cover', file);
            formData.append('Genre_id', movie.selectedGenre.Genre_id);
            formData.append('Country_id', movie.selectedCountry.Country_id);
            formData.append('Description', description);
            formData.append('Release_date', bdDate);
    
            data = await createMovie(formData).then(() => {                
                setErrorTitle('');
                setErrorGenre('');
                setErrorCountry('');
                setErrorDate('');
                setErrorCover('');
                setErrorDescription('');
                alert('Фильм успешно добавлен!');
                movie.setSelectedGenre('');
                movie.setSelectedCountry('');
                setTitle('');
                setFile(null);
                setDescription(null);
                setBdDate(null);
                onHide();
            })
        } catch (e) {
          alert(e.response.data.message);
        }
    }    
  };

  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>Add new movie</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Control
            value={title}
            onChange={e => setTitle(e.target.value)}
            className='mt-3'
            placeholder='Input movie title'
          />
          {errorTitle && <div>{errorTitle}</div>}
          <Dropdown className='mt-3'>
            <Dropdown.Toggle>{movie.selectedGenre.Genre_name || 'Add genre'}</Dropdown.Toggle>
            <Dropdown.Menu>
              {movie.genres.map(genre =>
                <Dropdown.Item onClick={() => movie.setSelectedGenre(genre)} key={genre.Genre_id}>{genre.Genre_name}</Dropdown.Item>
              )}
            </Dropdown.Menu>
          </Dropdown>
          {errorGenre && <div>{errorGenre}</div>}
          <Dropdown className='mt-3'>
            <Dropdown.Toggle>{movie.selectedCountry.Country_name || 'Add country'}</Dropdown.Toggle>
            <Dropdown.Menu>
              {movie.countries.map(country =>
                <Dropdown.Item onClick={() => movie.setSelectedCountry(country)} key={country.Country_id}>{country.Country_name}</Dropdown.Item>
              )}
            </Dropdown.Menu>
          </Dropdown>
          {errorCountry && <div>{errorCountry}</div>}
          <Form.Control
            className='mt-3'
            placeholder='Add movie cover'
            type='file'
            onChange={selectFile}
          />
          {errorCover && <div>{errorCover}</div>}
          <Form.Control
            value={bdDate}
            onChange={e => setBdDate(e.target.value)}
            className='mt-3'
            placeholder='Movie release date DD/MM/YYYY'
            type='date'
          />
          {errorDate && <div>{errorDate}</div>}
          <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
            <Form.Label>Input description:</Form.Label>
            {errorDescription && <div>{errorDescription}</div>}
            <Form.Control
              value={description}
              onChange={e => setDescription(e.target.value)}
              as="textarea"
              rows={3}
            />            
          </Form.Group>          
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={() => onHide()}>
          Close
        </Button>
        <Button variant="primary" onClick={addMovie}>
          Add
        </Button>
      </Modal.Footer>
    </Modal>
  );
});

export default CreateMovie;