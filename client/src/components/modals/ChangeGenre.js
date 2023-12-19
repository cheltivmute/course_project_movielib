import React, { useState, useContext} from 'react';
import { Dropdown, Form } from 'react-bootstrap';
import { Context } from '../../index';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { changeGenre } from '../../http/movieAPI';
import { observer } from 'mobx-react-lite';

const ChangeGenre = observer(({ show, onHide }) => {
  const { movie } = useContext(Context);
  const [value, setValue] = useState('');
  const [genreError, setGenreError] = useState('');
  const [nameError, setNameError] = useState('');

  const updateGenre = async () => {
    try{
      let data
      if (!movie.selectedGenre) {
        setGenreError('Please select a genre');
        return;
      }
      if (value.length < 3 || value.length > 12) {
        setNameError('Genre name should be between 3 and 12 characters');
        return;
      } else if (!/^[a-zA-Z]+$/.test(value)) {
        setNameError('*Genre name should be contain only characters');
        return;
      }
      const formData = new FormData();
      formData.append('Genre_id', movie.selectedGenre.Genre_id);
      formData.append('Genre_name', value);
      
      data = await changeGenre(formData).then(() => {
        setValue('');
        movie.setSelectedGenre('');
        setGenreError('');
        setNameError('');
        alert('Жанр успешно изменен!')
        onHide()
      });
    } catch (e) {
      alert(e.response.data.message)
    }
  };

  const handleGenreSelect = (genre) => {
    movie.setSelectedGenre(genre);
    setGenreError('');
  };

  const handleChange = (e) => {
    setValue(e.target.value);
    setNameError('');
  };

  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>Change genre</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Dropdown>
          <Dropdown.Toggle>
            {movie.selectedGenre ? movie.selectedGenre.Genre_name : 'Pick genre'}
          </Dropdown.Toggle>
          <Dropdown.Menu>
            {movie.genres.map((genre) => (
              <Dropdown.Item onClick={() => handleGenreSelect(genre)} key={genre.Genre_id}>
                {genre.Genre_name}
              </Dropdown.Item>
            ))}
          </Dropdown.Menu>
        </Dropdown>
        {genreError && <div className="error-message">{genreError}</div>}
        <Form className="mt-3">
          <Form.Control
            value={value}
            onChange={handleChange}
            placeholder={'Input genre name'}
          />
          {nameError && <div className="error-message">{nameError}</div>}
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Close
        </Button>
        <Button variant="primary" onClick={updateGenre}>
          Change
        </Button>
      </Modal.Footer>
    </Modal>
  );
});

export default ChangeGenre;