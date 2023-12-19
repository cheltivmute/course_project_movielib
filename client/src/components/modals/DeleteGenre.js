import React, { useContext, useState} from 'react'
import { Dropdown} from 'react-bootstrap';
import { Context } from "../../index";
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { deleteGenre } from '../../http/movieAPI'
import { observer } from 'mobx-react-lite';
import AcceptModal from './AcceptModal';

const DeleteGenre = observer(({show, onHide}) => {
    const {movie} = useContext(Context)
    const [error, setError] = useState('')
    const [showAcceptModal, setAcceptShowModal] = useState(false);

    const delGenre = async () => {
      try {
          let data;
          data = await deleteGenre(movie.selectedGenre.Genre_id).then((data) => {
            alert('Вы успешно удалили жанр!')
            movie.setSelectedGenre('');
            onHide()
          })
      } catch (e) {
        alert(e.response.data.message)
      }
        
    }    

    return (
      <Modal show={show} onHide={onHide}>
        <Modal.Header closeButton>
          <Modal.Title>Delete genre</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <Dropdown>
                <Dropdown.Toggle>{movie.selectedGenre.Genre_name || 'Pick genre'}</Dropdown.Toggle>
                <Dropdown.Menu>
                    {movie.genres.map(genre =>
                        <Dropdown.Item onClick={() => movie.setSelectedGenre(genre)} key={genre.Genre_id}>{genre.Genre_name}</Dropdown.Item>
                    )}
                </Dropdown.Menu>
                {error && (<div>{error}</div>)}
            </Dropdown>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={onHide}>
            Close
          </Button>
          <Button variant="primary" onClick={() => {
              if(!movie.selectedGenre.Genre_id) {
                setError('*Select the genre!')
              } else {
                setAcceptShowModal(true)
              }
            }}>
            Delete
          </Button>
        </Modal.Footer>
        <AcceptModal
          let message={'Вы уверены, что хотите удалить этот жанр?'}
          show={showAcceptModal} 
          onHide={(answer) => {
          if(answer) {
            delGenre();
          } else {              
            alert('Вы отказались от удаления жанра!')
          }                    
          setAcceptShowModal(false);                      
          }}
        />
      </Modal>
  );
})

export default DeleteGenre;