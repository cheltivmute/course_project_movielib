import React, { useContext, useState, useEffect } from 'react'
import { Dropdown, Form } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { Context } from "../../index";
import { changeMovie, fetchGenre, fetchCountry} from '../../http/movieAPI'
import { observer } from 'mobx-react-lite';

const ChangeMovie = observer(({
        show,
        onHide,
        movID,
        newTitle,
        setNewTitle,
        newDescription,
        setNewDescription,
        newReleaseDate,
        setNewRealeaseDate,
    }) => {
    const {movie} = useContext(Context)
    const [file, setFile] = useState(null)
    const [errorTitle, setErrorTitle] = useState('');
    const [errorGenre, setErrorGenre] = useState('');
    const [errorCountry, setErrorCountry] = useState('');
    const [errorDate, setErrorDate] = useState('');
    const [errorCover, setErrorCover] = useState('');
    const [errorDescription, setErrorDescription] = useState('');

    useEffect( () => {
        fetchGenre().then(data => movie.setGenres(data))
        fetchCountry().then(data => movie.setCountries(data))
      }, [movie])

      const validateForm = () => {
        let isValid = true;

        if(!newTitle) {
            setErrorTitle('*Please enter the title!');
            isValid = false;
        }
        else if (newTitle.length > 35) {
            setErrorTitle('*Title should be less then 35 characters');
            isValid = false;
        }
        else if (!/^[a-zA-Zа-яА-Я0-9\s!"#$%&'()*+,-./:;<=>?@[\]^_`{|}~]+$/.test(newTitle)) {
            setErrorTitle('*Title should only contain letters, numbers, spaces, and special characters');
            isValid = false;
        } else {
            setErrorTitle('');
        }
    
    
        if (!newReleaseDate) {
            setErrorDate('*Please select the bdDate!');
            isValid = false;
        }    
        else if (new Date(newReleaseDate) > new Date()) {
            setErrorDate('*Release date cannot be in the future!');
            isValid = false;
        } else {
            setErrorDate('');
        }
    
        if (!newDescription) {
            setErrorDescription('*Please enter the description!');
            isValid = false;
        }
        else if (newDescription.length > 500) {
            setErrorDescription('Description should be less then 500 characters');
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
                const formDataMovie = new FormData()
                formDataMovie.append('Movie_id', movID)
                formDataMovie.append('Title', newTitle)
                formDataMovie.append('Genre_id', movie.selectedGenre.Genre_id)
                formDataMovie.append('Country_id', movie.selectedCountry.Country_id)
                if(file) {
                    formDataMovie.append('Cover', file)
                } else {
                    formDataMovie.append('Cover', null)
                }
                formDataMovie.append('Description', newDescription)
                formDataMovie.append('Release_date', newReleaseDate)        
                data = await changeMovie(formDataMovie).then(() => {
                    setErrorTitle('');
                    setErrorGenre('');
                    setErrorCountry('');
                    setErrorDate('');
                    setErrorCover('');
                    setErrorDescription('');
                    alert('Фильм успешно изменён!');
                    movie.setSelectedGenre('');
                    movie.setSelectedCountry('');
                    onHide()
                }) 
            } catch (e) {
                alert(e.response.data.message);
            }
        }
    }
    
    return (
        <Modal show={show} onHide={onHide}>
            <Modal.Header closeButton>
            <Modal.Title>Edit movie</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Label>Cover:</Form.Label>
                    <Form.Control
                            placeholder='Select cover'
                            type="file"
                            onChange={selectFile}
                    />
                    {errorCover && <div>{errorCover}</div>}
                    <Form.Label className='mt-3'>Title:</Form.Label>
                    <Form.Control
                            placeholder='Input movie title'
                            value={newTitle}
                            onChange={e => setNewTitle(e.target.value)}
                    />
                    {errorTitle && <div>{errorTitle}</div>}
                    <Dropdown className='mt-3'>
                        <Dropdown.Toggle>{movie.selectedGenre.Genre_name || 'Edit genre'}</Dropdown.Toggle>
                        <Dropdown.Menu>
                            {movie.genres.map(genre =>
                                <Dropdown.Item onClick={() => movie.setSelectedGenre(genre)} key={genre.Genre_id}>{genre.Genre_name}</Dropdown.Item>
                            )}
                        </Dropdown.Menu>
                    </Dropdown>
                    {errorGenre && <div>{errorGenre}</div>}
                    <Dropdown className='mt-3'>
                        <Dropdown.Toggle>{movie.selectedCountry.Country_name || 'Edit country'}</Dropdown.Toggle>
                        <Dropdown.Menu>
                            {movie.countries.map(country =>
                                <Dropdown.Item onClick={() => movie.setSelectedCountry(country)} key={country.Country_id}>{country.Country_name}</Dropdown.Item>
                            )}
                        </Dropdown.Menu>
                    </Dropdown>
                    {errorCountry && <div>{errorCountry}</div>}                    
                    <Form.Label className='mt-3'>Release date: {new Date(newReleaseDate).toLocaleDateString()}</Form.Label>
                    <Form.Control
                            placeholder='Input release date'
                            type='date'
                            value={newReleaseDate}
                            onChange={e => setNewRealeaseDate(e.target.value)}
                    />
                    {errorDate && <div>{errorDate}</div>}
                    <Form.Group className="mt-3" controlId="exampleForm.ControlTextarea1">
                        <Form.Label>Description:</Form.Label>
                        {errorDescription && <div>{errorDescription}</div>}
                        <Form.Control
                            value={newDescription}
                            onChange={e => setNewDescription(e.target.value)}
                            as="textarea"
                            rows={5}
                        />
                    </Form.Group>
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

export default ChangeMovie;