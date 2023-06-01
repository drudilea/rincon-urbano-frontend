import React from 'react';
import './tab-rooms.scss';
function TabContent() {
  return (
    <div>
      <div className="rooms-content-container">
        <div className="tab-content">
          <span>
            En Rincón Urbano te ofrecemos clases grabadas en alta definición con
            la posibilidad de{' '}
            <strong>
              pausar, retroceder y controlar la velocidad del video
            </strong>{' '}
            para que no te pierdas ningún detalle y las disfrutes a tu gusto.
            <br />
            <br />
            Todas las semanas se suben nuevas clases de cada estilo con una
            duración de <strong>40 a 60 minutos</strong>. Cada clase tiene una
            vigencia de 4 semanas.
          </span>
          <div className="content-image-container">
            <img
              src="https://firebasestorage.googleapis.com/v0/b/rincon-urbano.appspot.com/o/web-images%2FFotos%20Paginas%2FTwoDailyClasses-LANDING.png?alt=media&token=aa5d6162-efdb-405b-aad2-a2bcd409a5cd"
              alt=""
              className="content-img live"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default TabContent;
