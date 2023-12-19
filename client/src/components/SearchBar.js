import { observer } from "mobx-react-lite";
import React, { useContext } from "react";
import { Context } from "..";
import { ListGroup } from "react-bootstrap";
import "./css/CountryBar.css";

const SearchBar = observer(() => {
  const { movie } = useContext(Context);

  const handleGenreClick = (genre) => {
    if (genre.Genre_id === movie.selectedGenre.Genre_id) {
      movie.setSelectedGenre('');
    } else {
      movie.setSelectedGenre(genre);
    }
  };

  return (
    <ListGroup>
      {movie.genres.map((genre) => (
        <ListGroup.Item
          className="popoir"
          style={{ cursor: "pointer"}}
          active={genre.Genre_id === movie.selectedGenre?.Genre_id}
          onClick={() => handleGenreClick(genre)}
          key={genre.Genre_id}
        >
          {genre.Genre_name}
        </ListGroup.Item>
      ))}
    </ListGroup>
  );
});

export default SearchBar;