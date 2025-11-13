import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";

function AdoptionForm() {
  const { id } = useParams();
  const nav = useNavigate();
  const [name, setName] = useState("");

  function submitForm(e) {
    e.preventDefault();

    fetch(`http://localhost:8080/animals/${id}/adopt`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ adopter: name })
    })
      .then(() => nav("/thank-you"));
  }

  return (
    <form onSubmit={submitForm} className="form">
      <h2>Adoptoi eläin</h2>

      <label>Nimesi</label>
      <input value={name} onChange={(e) => setName(e.target.value)} required />

      <button className="btn adopt">Lähetä hakemus</button>
    </form>
  );
}

export default AdoptionForm;
