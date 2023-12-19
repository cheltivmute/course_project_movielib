import React, { useContext, useEffect, useState} from 'react';
import { Context } from '../index';
import { Button, Nav } from 'react-bootstrap';
import { NavLink } from 'react-router-dom/cjs/react-router-dom.min';
import { ACCOUNT_ROUTE, ADMIN_ROUTE, FOLDER_ROUTE, LOGIN_ROUTE, SEARCH_ROUTE,  } from '../utils/consts';
import { getOneUser} from '../http/movieAPI'
import { observer } from 'mobx-react-lite'
import './css/Navbar.css';
import { useHistory } from 'react-router-dom'

const NavBar = observer(() => {
    const {user} = useContext(Context)
    const {movie} = useContext(Context)
    const history = useHistory()
    const [gang, setGang] = useState(false)

    useEffect( () => {
      if(user.isAuth) {
          getOneUser(user.userID).then((data)=>{
              setGang(data.Is_blocked);
            })
          }
        })

    const logOut = () => {
      user.setUser({})
      user.setIsAuth(false)
      user.setIsAdmin(false)
      user.setUserID(null)
      movie.setFolders(null)
      localStorage.removeItem('isAdmin');
      localStorage.removeItem('token');
      localStorage.removeItem('isAuth')
    }

    const goAdmin = () => {
      history.push(ADMIN_ROUTE)
    }

    return(
      <div className='navbar-main'>        
          <NavLink className='navbar-brand' to={SEARCH_ROUTE}>MovieLib</NavLink>
          <div className='navbar-div-main'>
            {user.isAuth ?
              <>
                {!gang && (
                  <>
                  <NavLink className='navbar-item' to={FOLDER_ROUTE}>catalog</NavLink>
                  <NavLink className='navbar-item' to={ACCOUNT_ROUTE + '/' + user.userID}>account</NavLink>
                  </>
                )}
                
                {user.isAdmin && (
                  <div  className='navbar-div-button-admin'>
                    <Button className='navbar-button' variant={'outline-light'} onClick={() => {goAdmin()}}>admin</Button>
                  </div>                  
                )}
                <div className='navbar-div-button'>
                  <Button className='navbar-button' variant={'outline-light'} onClick={() => {logOut(); history.push(LOGIN_ROUTE)}}>sign out</Button>
                </div>
              </>  
              :
              <>
                <div className='navbar-div-button'>
                  <Button variant={'outline-light'} onClick={() => {history.push(LOGIN_ROUTE)}}>sign in</Button>   
                </div>       
              </>
            }
          </div>
      </div>
    )
});

export default NavBar;