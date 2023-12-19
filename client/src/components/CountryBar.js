import { observer } from "mobx-react-lite";
import React, { useContext } from "react";
import { Context } from "..";
import { Card, Row } from "react-bootstrap";
import "./css/CountryBar.css";

const CountryBar = observer(() => {
  const { movie } = useContext(Context);

  const handleCountryClick = (country) => {
    if (country.Country_id === movie.selectedCountry.Country_id) {
      // Если выбран тот же элемент, что и ранее, сбросить выбранный элемент
      movie.setSelectedCountry('');
    } else {
      // Иначе, установить новый выбранный элемент
      movie.setSelectedCountry(country);
    }
  };

  return (
    <Row className="row-main">
      {movie.countries.map((country) => (
        <Card
          className="country-card"
          style={{ cursor: "pointer" }}
          key={country.Country_id}
          onClick={() => handleCountryClick(country)} // Используем обновленный обработчик клика
          border={country.Country_id === movie.selectedCountry?.Country_id ? "danger" : "dark"} // Используем условное свойство
        >
          {country.Country_name}
        </Card>
      ))}
    </Row>
  );
});

export default CountryBar;