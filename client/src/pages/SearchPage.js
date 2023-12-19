import React, { useContext, useEffect, useState } from "react";
import { Container, Col, Row } from "react-bootstrap";
import SearchBar from "../components/SearchBar";
import CountryBar from "../components/CountryBar";
import MovieList from "../components/MovieList";
import SearchTitleBar from "../components/SearchTitleBar";
import { observer } from "mobx-react-lite";
import { Context } from "..";
import { fetchGenre, fetchCountry, fetchMovie, fetchFolder, getOneUser } from '../http/movieAPI'
import Pages from "../components/Pages";


const SearchPage = observer(() => {
  const {movie} = useContext(Context)
  const {user} = useContext(Context)
  const [gang, setGang] = useState(false)
  movie.setFolders(null)


  useEffect( () => {
    movie.setSelectedGenre('')
    movie.setSelectedCountry('')
    if(user.isAuth) {
      getOneUser(user.userID).then((data)=>{
        setGang(data.Is_blocked);
      })
      fetchFolder(user.userID).then((data) => {
        movie.setFolders(data.rows)
      })
    }    
    fetchGenre().then(data => movie.setGenres(data))
    fetchCountry().then(data => movie.setCountries(data))
    fetchMovie(null, null, null, 1, 5).then(data => {
      movie.setMovies(data.rows)
      movie.setTotalCount(data.count)
    })
    
  }, [user, movie])

  

  useEffect( () => {
    if(user.isAuth) {
      getOneUser(user.userID).then((data)=>{
        setGang(data.Is_blocked);
      })
      fetchFolder(user.userID).then((data) => {
        movie.setFolders(data.rows)
      })
    }  
    fetchMovie(movie.searchTitle, movie.selectedGenre.Genre_id, movie.selectedCountry.Country_id, movie.page, 5).then(data => {
      movie.setMovies(data.rows)
      movie.setTotalCount(data.count)
    })
  }, [movie, movie.page, movie.searchTitle, movie.selectedGenre, movie.selectedCountry,])

  return (
    <Container>      
      <Row className="mt-3">
        <Col md={2}>
          <SearchBar/>
        </Col>
        <Col md={10}>
          {gang && (
            <div style={{textAlign: 'center', width: '100%', fontSize: '32px', fontWeight: 'bold'}}>YOUR ACCOUNT IS BLOCKED! SOME FUNCTIONS ARE NO LONGER AVAILABLE!</div>
          )}
          <SearchTitleBar/>
          <CountryBar/>
          <MovieList/>
          <Pages/>
        </Col>
      </Row>
    </Container>
  )
})

export default SearchPage;