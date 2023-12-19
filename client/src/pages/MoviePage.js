import React, { useContext, useEffect, useState } from "react";
import { Button, Container, Image, Form } from "react-bootstrap";
import '../components/css/MoviePage.css'
import {useParams} from 'react-router-dom'
import {fetchOneMovie, createRating, checkRating, changeRating, getAvgRating, deleteRating, fetchReview, delReview, getOneFolder, createMovieToFolder, delAllReview, deleteAllRating, deleteAllMovieToFolder, deleteMovie, getOneUser} from '../http/movieAPI'
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Popover from 'react-bootstrap/Popover';
import { observer } from "mobx-react-lite";
import { Context } from "..";
import ReviewList from "../components/ReviewList";
import CreateReview from '../components/modals/CreateReview'
import ChangeReview from '../components/modals/ChangeReview'
import ChangeMovie from "../components/modals/ChangeMovie";
import { useHistory } from "react-router-dom/cjs/react-router-dom";
import { SEARCH_ROUTE } from "../utils/consts";
import AcceptModal from "../components/modals/AcceptModal";

const MoviePage = observer(() => {
  const {user} = useContext(Context)
  const {movie} = useContext(Context)
  const {Movie_id} = useParams()
  const [hearts, setHearts] = useState('♡♡♡♡♡♡♡♡♡♡');
  const [heartsPick, setHeartsPick] = useState('♡♡♡♡♡♡♡♡♡♡'); 
  const [ratingValue, setRatingValue] = useState(null);
  const [avgRatingValue, setAvgRatingValue] = useState(null);   
  const [reviewVisible, setReviewVisible] = useState(false)
  const [showAcceptModal, setAcceptShowModal] = useState(false);
  const [changeReviewVisible, setChangeReviewVisible] = useState(false)
  const [changeMovieVisible, setChangeMovieVisible] = useState(false)
  const [reviewText, setReviewText] = useState('');
  const [reviewId, setReviewId] = useState(null);
  const [movID, setMovID] = useState('');
  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newUpdtDescription, setNewUpdtDescription] = useState('');
  const [newReleaseDate, setNewRealeaseDate] = useState(null);
  const [gang, setGang] = useState(true)
  const history = useHistory()

  const openChangeReviewModal = () => {
    setChangeReviewVisible(true);
  };
  
  useEffect( () => {
     if(user.isAuth) {
      getOneUser(user.userID).then((data)=>{
        setGang(data.Is_blocked);
      })
     }
      
      fetchOneMovie(Movie_id).then((data)=>{
        movie.setMovies(data)
        setNewUpdtDescription(data.Description)
      });
      fetchReview(Movie_id).then(datag => {
        movie.setReviews(datag)
      })
      checkRating(+user.userID, +Movie_id).then((data)=> {
        if(data) {
          setRatingValue(data.Rating_value)
          let updatedHearts = hearts.split('');
          for (let i = data.Rating_value; i < 10; i++) {      
            updatedHearts[i] = '♡';      
          }
          for (let i = 0; i < data.Rating_value; i++) { 
            updatedHearts[i] = '♥';            
          }
          setHeartsPick(updatedHearts.join(''));
        }
      })
      getAvgRating(+Movie_id).then((data)=>{      
      setAvgRatingValue(data.averageRating)
      })
  }, [Movie_id, hearts, movie, user.userID]) 

  const handleHeartHover = (index) => {
    let updatedHearts = hearts.split('');
    for (let i = index; i < 10; i++) {      
      updatedHearts[i] = '♡';      
    }
    for (let i = 0; i <= index; i++) { 
       updatedHearts[i] = '♥';            
    }
    setHearts(updatedHearts.join(''));
  };

  const handleHeartClick = (index) => {
    let updatedHearts = hearts.split('');
    for (let i = index; i < 10; i++) {      
      updatedHearts[i] = '♡';      
    }
    for (let i = 0; i <= index; i++) { 
       updatedHearts[i] = '♥';            
    }
    
    const formData = new FormData()
    formData.append('User_id', user.userID)
    formData.append('Movie_id', Movie_id)
    formData.append('Rating_value', ratingValue)

    setRatingValue(index + 1);
    checkRating(+user.userID, +Movie_id).then((data) => {
      if(data) {
        changeRating(+user.userID, +Movie_id, index + 1).then(()=> {
          getAvgRating(+Movie_id).then((dataq)=>{ 
            setAvgRatingValue(dataq.averageRating)
          })
        })
      } else {
        createRating(+user.userID, +Movie_id, index + 1).then(() => {
          getAvgRating(+Movie_id).then((dataq)=>{ 
            setAvgRatingValue(dataq.averageRating)
          })
        })
      }
    })
    setHeartsPick(updatedHearts.join(''));
  };

  const deleteRateClick = () => {
    checkRating(+user.userID, +Movie_id).then((data) => {
      if(data) {
        deleteRating(+user.userID, +Movie_id).then(() => {
          setRatingValue(null);          
          getAvgRating(+Movie_id).then((dataz)=>{ 
            setAvgRatingValue(dataz.averageRating)
          })
          setHeartsPick('♡♡♡♡♡♡♡♡♡♡');
          setHearts('♡♡♡♡♡♡♡♡♡♡');
        })
      }
    })
  };

  const deleteThisReview = (revId) => {
    delReview(revId).then(() => {
      fetchReview(Movie_id).then(datag => {
        alert('Вы успешно удалили обзор!')
        movie.setReviews(datag)
      })
    })      
  }

  return (
    <Container>      
        <div className="div-main1">
          <div className="div-image1">
            <Image width={300} height={400} src={"http://klyuchna9:5000/" +  movie.movies.Cover}/>
          </div>
          <div className="div-movieinfo">
            <div className="div-title1">{movie.movies.Title}</div>
            <div className="div-info1">
              <div className="div-info-name">
                Country:<br/>
                Genre:<br/>          
                Release date:<br/>
                Description:
              </div>
              <div className="div-info-answer">
              {movie && (
                <>
                  {movie.movies.Country && movie.movies.Country.Country_name}<br/>
                  {movie.movies.Genre && movie.movies.Genre.Genre_name}<br/>
                  {movie.movies.Release_date && new Date(movie.movies.Release_date).toLocaleDateString()}<br/>
                  {newUpdtDescription && (
                    <Form.Control
                      style={{ width: '100%', height: '200px', border: 'none', fontSize: '18px', padding: '0px' }}
                      value={newUpdtDescription}
                      as="textarea"
                      readOnly
                    />
                  )}
                </>
              )}
              </div>
            </div>
          </div>
          <div className="div-image1">
          {(user.isAuth && !gang) ? (
            <>
            <div className="div-rating1">
            <OverlayTrigger
              trigger="click"
              
              key="top"
              placement="top"
              overlay={
                <Popover id="popover-positioned-top">
                  <Popover.Header as="h3"></Popover.Header>
                  <Popover.Body>
                    <span style={{ fontSize: '32px', cursor: 'pointer'}} onMouseLeave={() => {setHearts(heartsPick)}}>
                      {hearts.split('').map((heart, index) => (
                        <span                          
                          key={index}
                          onMouseEnter={() => handleHeartHover(index)}
                          onMouseLeave={() => handleHeartHover(index)}
                          onClick={() => { handleHeartClick(index)}}
                        >
                          {heart}
                        </span>
                      ))}
                    </span>
                  </Popover.Body>
                </Popover>
              }
            >
                <Button className="rate-button" variant="outline-dark" onClick={() => {setHearts(heartsPick)}}>Rate</Button>
            </OverlayTrigger>
            </div>
            {ratingValue && (
            <div className="div-rating1">
              <Button className="rate-button" variant="outline-dark" onClick={() => {deleteRateClick()}}>Delete rate</Button>
            </div> )}            
            <div className="div-rating2">
              {ratingValue? (
                <>
                  Your rate: 
                  <div className="div-rating-num1">
                    {ratingValue}
                  </div>                  
                </>
              ) : (
                <>
                  Rate movie pls: 
                  <div className="div-rating-num1">
                    {':)'}
                  </div>
                </>
              )}
            </div>
            </>) : (
              <div className="div-rating2">
                 This is not available to you!
              </div>
            )}
            <div className="div-rating2">
              Average rate:
              {avgRatingValue ? (
                <>                   
                  <div className="div-rating-num1">
                    {avgRatingValue}
                  </div>
                </>
              ) : (
                <>                   
                  <div className="div-rating-num1">
                    {'Do it first :)'}
                  </div>
                </>
              )}
            </div>
          </div>          
        </div>

        {(user.isAuth && !gang) ? (
            <>
            <Button 
              variant={'outline-dark'}
              className="rate-button"
              onClick={() => setReviewVisible(true)}
            >
              Add review
            </Button>
            </>) : (
              <div className="div-rating1">
                This is not available to you!
              </div>
            )}

        {user.isAdmin && (
          <>
            <Button 
              style={{width: '100%'}}
              variant={'outline-dark'}
              className="mt-2 rate-button"
              onClick={() => {
                setMovID(Movie_id)
                setNewTitle(movie.movies.Title)
                setNewDescription(movie.movies.Description)
                setNewRealeaseDate(movie.movies.Release_date)
                setChangeMovieVisible(true)
                movie.setSelectedGenre(movie.movies.Genre)
                movie.setSelectedCountry(movie.movies.Country)
              }}
            >
              Edit
            </Button>
            <Button 
              style={{width: '100%'}}
              variant={'outline-dark'}
              className="mt-2 rate-button"
              onClick={() => {
                  setAcceptShowModal(true) 
              }}
            >
              Delete
            </Button>
          </>
        )}
        {!gang ? (
        <ReviewList className="mt-4" openChangeReviewModal={openChangeReviewModal}  setReviewText={setReviewText} setReviewId={setReviewId} deleteThisReview={deleteThisReview}/>
        ) : (
          'Reviews is not available to you!'
        )}
        <CreateReview show={reviewVisible} onHide={() => {
          
          setReviewVisible(false)
          fetchReview(Movie_id).then(datag => {
            movie.setReviews(datag)
          })
        }}/>
        <ChangeReview show={changeReviewVisible} reviewText={reviewText} setReviewText={setReviewText} reviewId={reviewId} onHide={() => {          
          
          setChangeReviewVisible(false);
          fetchReview(Movie_id).then(datag => {
            movie.setReviews(datag)
          })     
        }}/>

        <ChangeMovie
          movID={movID}
          setMovID={setMovID}
          newTitle={newTitle}
          setNewTitle={setNewTitle}
          newDescription={newDescription}
          setNewDescription={setNewDescription}
          newReleaseDate={newReleaseDate}
          setNewRealeaseDate={setNewRealeaseDate}
          show={changeMovieVisible} 
          onHide={() => {
            fetchOneMovie(Movie_id).then((data)=>{
              movie.setMovies(data)
              setNewUpdtDescription(data.Description)
            }); 
            setChangeMovieVisible(false);                       
          }}
        />

        <AcceptModal
          let message={'Вы уверены, что хотите удалить этот фильм?'}
          show={showAcceptModal} 
          onHide={(answer) => {
            if(answer) {
              delAllReview(Movie_id).then(()=>{
                deleteAllRating(Movie_id).then(()=>{
                  deleteAllMovieToFolder(Movie_id).then(()=>{
                    deleteMovie(Movie_id).then(()=>{
                      alert('Фильм успешно удален!')
                      history.push(SEARCH_ROUTE)
                    })
                  })
                })
              })
            } else {
              alert('Вы отказались от удаления фильма!')
            }
            
            setAcceptShowModal(false);                      
          }}
        />
        
    </Container>
  );
}); 

export default MoviePage;