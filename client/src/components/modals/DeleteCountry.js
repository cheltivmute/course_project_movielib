import React, { useContext, useState} from 'react'
import { Dropdown} from 'react-bootstrap';
import { Context } from "../../index";
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { deleteCountry } from '../../http/movieAPI'
import { observer } from 'mobx-react-lite';
import AcceptModal from './AcceptModal';

const DeleteCountry = observer(({show, onHide}) => {
    const {movie} = useContext(Context)
    const [error, setError] = useState('')
    const [showAcceptModal, setAcceptShowModal] = useState(false);

    const delCountry = async () => {
      try {
          let data;
          data = await deleteCountry(movie.selectedCountry.Country_id).then((data) => {
            alert('Вы успешно удалили страну!')
            movie.setSelectedCountry('');
            onHide()
        })
      } catch (e) {
        alert(e.response.data.message)
      }
        
    }    

    return (
      <Modal show={show} onHide={onHide}>
        <Modal.Header closeButton>
          <Modal.Title>Delete country</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <Dropdown>
                <Dropdown.Toggle>{movie.selectedCountry.Country_name || 'Pick country'}</Dropdown.Toggle>
                <Dropdown.Menu>
                    {movie.countries.map(country =>
                        <Dropdown.Item onClick={() => movie.setSelectedCountry(country)} key={country.Country_id}>{country.Country_name}</Dropdown.Item>
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
                if(!movie.selectedCountry.Country_id) {
                    setError('*Select the country!')
                } else {
                    setAcceptShowModal(true)
                }                
            }}>
            Delete
          </Button>
        </Modal.Footer>
        <AcceptModal
          let message={'Вы уверены, что хотите удалить эту страну?'}
          show={showAcceptModal} 
          onHide={(answer) => {
          if(answer) {
            delCountry();
          } else {              
            alert('Вы отказались от удаления страны!')
          }                    
          setAcceptShowModal(false);                      
          }}
        />
      </Modal>
  );
})

export default DeleteCountry;