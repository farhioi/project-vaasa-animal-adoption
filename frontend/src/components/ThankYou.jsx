import { Link } from "react-router-dom";

function ThankYou() {
  return (
    <div className="thankyou">
      <h1>Kiitos hakemuksestasi! 😊</h1>
      <p>Olemme vastaanottaneet adoptiohakemuksesi.</p>

      <Link to="/" className="btn">
        Palaa etusivulle
      </Link>
    </div>
  );
}

export default ThankYou;
