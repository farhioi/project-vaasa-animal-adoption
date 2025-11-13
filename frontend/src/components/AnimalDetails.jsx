import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";

function AnimalDetails() {
  const { id } = useParams();
  const [animal, setAnimal] = useState(null);

  useEffect(() => {
    fetch(`http://localhost:8080/animals/${id}`)
      .then((res) => res.json())
      .then((data) => setAnimal(data));
  }, [id]);

  if (!animal) return <p>Ladataan...</p>;

  return (
    <div className="details">
      <img src={animal.image} alt={animal.name} className="big-img" />

      <h2>{animal.name}</h2>
      <p><b>Ikä:</b> {animal.age}</p>
      <p><b>Rotu:</b> {animal.breed}</p>
      <p>{animal.description}</p>

      <Link to={`/animal/${id}/adopt`} className="btn adopt">
        Adoptoi minut
      </Link>
    </div>
  );
}

export default AnimalDetails;
