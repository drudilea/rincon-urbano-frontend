import React from 'react';
import './nosotros.scss';

function Nosotros(props) {
  return (
    <div>
      <section id="nosotros" className="nosotros-section">
        <div className="nosotros-container">
          <h1>Llevá la academia a donde estés</h1>
          <hr />
          <p>
            En Rincón Urbano queremos que tengas la mejor experiencia al tomar
            una clase, apreciando todo el contenido y sacándole el mayor
            provecho de forma simple y segura. <br />
            <br />
            Registrate y tomá las clases que quieras, cuantas veces quieras y en
            el horario que más cómodo te quede.
          </p>
          <img
            src="https://firebasestorage.googleapis.com/v0/b/rincon-urbano.appspot.com/o/web-images%2FdancerWithGreen.jpeg?alt=media&token=b70e9cfe-2dbb-4e65-8843-2e22042f05e1"
            alt="bailarin"
            className="nosotros-image"
          ></img>
        </div>
      </section>
    </div>
  );
}

export default Nosotros;
