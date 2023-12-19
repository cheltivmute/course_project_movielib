import React, { useContext, useEffect, useState } from "react";
import { Button, Container, Row, Image } from "react-bootstrap";
import CreateGenre from '../components/modals/CreateGenre'
import ChangeGenre from '../components/modals/ChangeGenre'
import DeleteGenre from '../components/modals/DeleteGenre'
import CreateCountry from '../components/modals/CreateCountry'
import ChangeCountry from '../components/modals/ChangeCountry'
import CreateMovie from '../components/modals/CreateMovie'
import { changeUserIsBlock, changeUserRole, getAllUsers, fetchGenre, fetchCountry, fetchMovie } from "../http/movieAPI";
import '../components/css/AdminPage.css'
import { observer } from "mobx-react-lite";
import { Context } from "..";
import DeleteCountry from "../components/modals/DeleteCountry";

const Admin = observer(() => {
  const [users, setUsers] = useState([])
  const {movie} = useContext(Context)
  const {user} = useContext(Context)

  useEffect(() => {
    getAllUsers().then((data) => {      
      setUsers(data.rows)
    })
    fetchGenre().then(data => movie.setGenres(data))
    fetchCountry().then(data => movie.setCountries(data))
    fetchMovie().then(data => movie.setMovies(data.rows))
  }, [movie])

  const usersToRender  = Array.isArray(users) ? users : [];
  

  const [genreVisible, setGenreVisible] = useState(false)
  const [changeGenreVisible, setChangeGenreVisible] = useState(false)
  const [deleteGenreVisible, setDeleteGenreVisible] = useState(false)
  const [countryVisible, setCountryVisible] = useState(false)
  const [changeCountryVisible, setChangeCountryVisible] = useState(false)
  const [deleteCountryVisible, setDeleteCountryVisible] = useState(false)
  const [movieVisible, setMovieVisible] = useState(false)

  const updateUserRole = (usID, roleUser) => {
    if (usID !== user.userID) {
      if (roleUser === 'USER') {
        changeUserRole(usID, 'ADMIN').then(() => {
          getAllUsers().then((data) => {      
            setUsers(data.rows)
          })
        })
      } else {
        changeUserRole(usID, 'USER').then(() => {
          getAllUsers().then((data) => {      
            setUsers(data.rows)
          })
        })
      }
    } else {
      alert('Вы не можете поменять свою роль!')
    }
    
    
  }

  const updateIsBlocked = (usID, gang) => {
    if(usID !== user.userID) {
      if(gang) {
        changeUserIsBlock(usID, false).then(() => {
          getAllUsers().then((data) => {      
            setUsers(data.rows)
          })
        })
      } else {
        changeUserIsBlock(usID, true).then(() => {
          getAllUsers().then((data) => {      
            setUsers(data.rows)
          })
        })
      }
    } else {
      alert('Вы не можете заблокировать самого себя!')
    }
    
    
  }

  return (
    <Container className="d-flex flex-column" style={{padding: '0px'}}>
      
      <Button 
        variant={'outline-dark'}
        className="mt-2"
        onClick={() => setGenreVisible(true)}
      >
        Add genre
      </Button>

      <Button 
        variant={'outline-dark'}
        className="mt-2"
        onClick={() => setChangeGenreVisible(true)}
      >
        Change genre
      </Button>

      <Button 
        variant={'outline-dark'}
        className="mt-2"
        onClick={() => setDeleteGenreVisible(true)}
      >
        Delete genre
      </Button>

      <br/>

      <Button 
        variant={'outline-dark'}
        className="mt-4"
        onClick={() => setCountryVisible(true)}
      >
        Add country
      </Button>

      <Button 
        variant={'outline-dark'}
        className="mt-2"
        onClick={() => setChangeCountryVisible(true)}
      >
        Change country
      </Button>

      <Button 
        variant={'outline-dark'}
        className="mt-2"
        onClick={() => setDeleteCountryVisible(true)}
      >
        Delete contry
      </Button>

      <br/>

      <Button
        variant={'outline-dark'}
        className="mt-4"
        onClick={() => setMovieVisible(true)}
      >
        Add Movie
      </Button>

      <Row className="d-flex mt-5" style={{borderTop: "1px solid black"} }>
          
               <div className="div-users-main">
                  <div className="div-users-image">
                    
                  </div>
                  <div className="div-users-id">
                    ID
                  </div>
                  <div className="div-users-username">
                    Username
                  </div>
                  <div className="div-users-email">
                    Email
                  </div>
                  <div className="div-users-bd">
                    Birthday date
                  </div>
                  <div className="div-users-role">
                    Role
                  </div>
                  <div className="div-users-isblock">
                    Is block?
                  </div>
                  <div className="div-users-setrole">
                  </div>
                  <div className="div-users-setblock">
                  </div>
              </div>
      </Row>
      <Row className="d-flex" style={{borderTop: "1px solid black"}}>
          {usersToRender.map(userq =>
               <div key={userq.User_id} className="div-users-main">
                  <div className="div-users-image">
                    <Image width={50} height={50} src={"http://klyuchna9:5000/" + userq.Avatar} />
                  </div>
                  <div className="div-users-id">
                    {userq.User_id}
                  </div>
                  <div className="div-users-username">
                    {userq.Username}
                  </div>
                  <div className="div-users-email">
                    {userq.Email}
                  </div>
                  <div className="div-users-bd">
                    {new Date(userq.Birthday_date).toLocaleDateString()}
                  </div>
                  <div className="div-users-role">
                    {userq.Role}
                  </div>
                  <div className="div-users-isblock">
                    {userq.Is_blocked ? (
                      ':('
                    ): (
                      ':)'
                    )}
                  </div>
                  <div className="div-users-setrole">
                    <Button variant="secondary" onClick={() => {                   
                      updateUserRole(userq.User_id, userq.Role)
                      }}>
                      Изменить роль
                    </Button>
                  </div>
                  <div className="div-users-setblock">
                    
                      <Button variant="secondary" onClick={() => {
                        updateIsBlocked(userq.User_id, userq.Is_blocked)
                        }}>
                        {userq.Is_blocked ? ('Разблокировать'):('Заблокировать')}
                      </Button>
                  </div>
              </div>
          )}
      </Row>
      <br/><br/>

      <CreateGenre show={genreVisible} onHide={() => {
        setGenreVisible(false);
        
        movie.setSelectedGenre('')
        movie.setSelectedCountry('')
        fetchGenre().then(data => movie.setGenres(data))
      }}/>
      <ChangeGenre show={changeGenreVisible} onHide={() => {
        setChangeGenreVisible(false)
        movie.setSelectedGenre('')
        movie.setSelectedCountry('')
        fetchGenre().then(data => movie.setGenres(data))
      }}/>
      <DeleteGenre show={deleteGenreVisible} onHide={() => {
        movie.setSelectedGenre('')
        movie.setSelectedCountry('')
        setDeleteGenreVisible(false)
        fetchGenre().then(data => movie.setGenres(data))
      }}/>

      <CreateCountry show={countryVisible} onHide={() => {
        setCountryVisible(false)
        movie.setSelectedGenre('')
        movie.setSelectedCountry('')
        fetchCountry().then(data => movie.setCountries(data))
      }}/>
      <ChangeCountry show={changeCountryVisible} onHide={() => {
        setChangeCountryVisible(false)
        movie.setSelectedGenre('')
        movie.setSelectedCountry('')
        fetchCountry().then(data => movie.setCountries(data))
        }}/>
      <DeleteCountry show={deleteCountryVisible} onHide={() => {
        movie.setSelectedGenre('')
        movie.setSelectedCountry('')
        setDeleteCountryVisible(false)
        fetchCountry().then(data => movie.setCountries(data))
      }}/>

      <CreateMovie show={movieVisible} onHide={() => {
        movie.setSelectedGenre('')
        movie.setSelectedCountry('')
        setMovieVisible(false)
      }}/>
    </Container>    
  )
})

export default Admin;

