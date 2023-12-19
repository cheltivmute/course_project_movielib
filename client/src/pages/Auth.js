import React, {useContext, useState} from "react";
import { Container, Form } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Row from "react-bootstrap/Row";
import { LOGIN_ROUTE, REGISTRATION_ROUTE, SEARCH_ROUTE } from "../utils/consts";
import {NavLink, useLocation, useHistory} from 'react-router-dom'
import { registration, login } from "../http/userAPI";
import { observer } from 'mobx-react-lite'
import { Context } from "..";

const Auth = observer(() => {
  const { user } = useContext(Context)
  const location = useLocation()
  const isLogin = location.pathname === LOGIN_ROUTE
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [birthday_date, setBirthday] = useState('')
  const [usernameError, setUsernameError] = useState('')
  const [emailError, setEmailError] = useState('')
  const [passwordError, setPasswordError] = useState('')
  const [birthdayError, setBirthdayError] = useState('')
  
  const history = useHistory()

  const validateForm = () => {
    let isValid = true;
    if (!isLogin) {
      // Проверка имени пользователя
      if (username.trim() === '') {
        setUsernameError('*Please enter a username.')
        isValid = false;
      } else if (username.length < 3 || username.length > 12) {
        setUsernameError('*Username must be 3-12 characters long.')
        isValid = false;
      } else if (!/^[a-zA-Z0-9]+$/.test(username)) {
        setUsernameError('*Username can only contain letters and numbers.')
        isValid = false;
      } else {
        setUsernameError('')
      }

      // Проверка адреса электронной почты
      if (email.trim() === '') {
        setEmailError('*Please enter an email address.')
        isValid = false;
      } else if (!/\S+@\S+\.\S+/.test(email)) {
        setEmailError('*Please enter a valid email address (xxx@xxx.xxx).')
        isValid = false;
      } else {
        setEmailError('')
      }

      // Проверка пароля
      if (password.trim() === '') {
        setPasswordError('*Please enter a password.')
        isValid = false;
      } else if (password.length < 8) {
        setPasswordError('*Password must be more than 8 characters long.')
        isValid = false;
      } else if (!/[A-Z]/.test(password)) {
        setPasswordError('*Password must contain one uppercase letter.')
        isValid = false;
      } else if (!/\d/.test(password)) {
        setPasswordError('*Password must contain one digit .')
        isValid = false;
      } else {
        setPasswordError('')
      }

      // Проверка даты рождения
      if (birthday_date.trim() === '') {
        setBirthdayError('*Please enter your birthday.')
        isValid = false;
      } else if (new Date(birthday_date) >= new Date()) {
        setBirthdayError('*Invalid birthday')
        isValid = false;
      } else {
        setBirthdayError('')
      }

      return isValid;
    }
  }
    

  const click = async () => {
    if(!isLogin) {
      if (!validateForm()) {
        return;
      }
    }   

    try {
      let data;
      if (isLogin) {
        data = await login(username, password);
        
        user.setUser(user)
        
        user.setUserID(data.id)
        localStorage.setItem('userID', data.id);
        if (data.role === 'ADMIN') {
          user.setIsAdmin(true)
          localStorage.setItem('isAdmin', true);
        }
        user.setIsAuth(true)        
        history.push(SEARCH_ROUTE);
      } else {
        data = await registration(username, email, password, birthday_date);
        history.push(LOGIN_ROUTE);
        
      }
    } catch (error) {
      alert(error.response.data.message)
    }

  }

  return (
    <Container
      className="d-flex justify-content-center align-items-center"
      style={{ height: window.innerHeight - 50 }}

    >
      <Card style={{ width: 600 }} className="p-5">
        <h2 className="m-auto">{isLogin ? 'SIGN IN' : 'SIGN UP'}</h2>
        {isLogin ?
          <Form className="d-flex flex-column">
            <Form.Control
              className="mt-3"
              placeholder="Username:"
              value={username}
              onChange={e => setUsername(e.target.value)}
            />

            <Form.Control
              className="mt-3"
              placeholder="Password:"
              value={password}
              onChange={e => setPassword(e.target.value)}
              type="password"
            />
          </Form>
          :
          <Form className="d-flex flex-column">
            <Form.Control
              className="mt-3"
              placeholder="Username:"
              value={username}
              onChange={e => setUsername(e.target.value)}
            />
            <div>{usernameError}</div>
            <Form.Control
              className="mt-3"
              placeholder="Email:"
              value={email}
              onChange={e => setEmail(e.target.value)}
            />
            <div>{emailError}</div>
            <Form.Control
              className="mt-3"
              placeholder="Password:"
              value={password}
              onChange={e => setPassword(e.target.value)}
              type="password"
            />
            <div>{passwordError}</div>
            <Form.Control
              className="mt-3"
              placeholder="Birth Day:"
              value={birthday_date}
              onChange={e => setBirthday(e.target.value)}
              type="date"
            />
            <div>{birthdayError}</div>
          </Form>
        }
        <Row className="d-flex justify-content-between mt-3 pl-3 pr-3">
          {isLogin ?
            <div>
              No acc? <NavLink to={REGISTRATION_ROUTE}>Sign up!</NavLink>
           </div>
            :
            <div>
              Have acc? <NavLink to={LOGIN_ROUTE}>Sign in!</NavLink>
            </div>
          }
          <Button className="mt-3" variant={"outline-success"} onClick={click}>
            {isLogin ? 'LESHGO' : 'START'}
          </Button>
        </Row>

      </Card>

    </Container>
  )
})

export default Auth;