import React, { useContext, useState, useEffect } from "react";
import { Container, Col, Image, Button } from "react-bootstrap";
import { observer } from "mobx-react-lite";
import { Context } from "..";
import { getOneUser } from '../http/movieAPI'
import '../components/css/AccountPage.css'
import ChangeUser from "../components/modals/ChangeUser";

const AccountPage = observer(() => {
  const { movie } = useContext(Context);
  const { user } = useContext(Context);

  const [changeUserVisible, setChangeUserVisible] = useState(false)

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [bdDate, setBDdate] = useState(null);
  
  movie.setFolders(null);

  useEffect(() => {
    getOneUser(user.userID).then((data) => {
      movie.setUsers(data);
    });
  }, [user.userID, movie]);

  return (
    <Container>
      <Col md={12}>
        <div className="div-main-acc">
          <div className="div-image-acc">
            <Image width={300} height={300} src={"http://klyuchna9:5000/" + movie.users.Avatar} />            
          </div>
          <div className="div-info-acc">        
            <div className="div-description-acc">
              Username:<br/>
              Email:<br/>
              Birthday_date:
            </div>
            <div className="div-description-acc2">
              {movie.users.Username}<br/>
              {movie.users.Email}<br/>
              {new Date(movie.users.Birthday_date).toLocaleDateString()}
            </div>
          </div>
        </div>
        <Button
            style={{width: '100%'}}
            variant={'outline-dark'}
            className="mt-2"
            onClick={() => {
                setChangeUserVisible(true);
                setUsername(movie.users.Username)
                setEmail(movie.users.Email)
                setBDdate(movie.users.Birthday_date)
            }}
        >
            Edit
        </Button>
      </Col>
        <ChangeUser
            username={username}
            setUsername={setUsername}
            email={email}
            setEmail={setEmail}
            bdDate={bdDate}
            setBDdate={setBDdate}
            
            show={changeUserVisible}            
            onHide={() => {
                setChangeUserVisible(false)
                getOneUser(user.userID).then((data) => {
                    movie.setUsers(data);
                });
            }}
        />
    </Container>
  );
});

export default AccountPage;