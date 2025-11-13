import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function AnimalList() {
  const [animals, setAnimals] = useState([]);

  useEffect(() => {
    fetch("http://localhost:8080/animals")
      .then((res) => res.json())
      .then((data) => setAnimals(data));
  }, []);

  return (
    <div className="container">
      <h1>Adoptoitavat eläimet</h1>

      <div className="grid">
        {animals.map((a) => (
          <div className="card" key={a.id}>
            <img src={a.image} alt={a.name} />

            <div className="card-content">
              <h3>{a.name}</h3>
              <p className="meta">
                {a.type} • {a.age} vuotta
              </p>
              <Link to={`/animal/${a.id}`} className="btn primary">
                Katso lisää
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AnimalList;
