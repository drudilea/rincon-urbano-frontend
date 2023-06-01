import React from 'react';
import './tab-devices.scss';
function TabContent() {
  return (
    <div>
      <div className="devices-content-container">
        <div className="tab-content">
          <span>
            Quisimos que tengas la mejor experiencia de aprendizaje, por eso
            creamos una plataforma accesible desde cualquier dispositivo
            (computadora, celular o tablet){' '}
            <strong>sin necesidad de descargar ninguna aplicación</strong>.
          </span>
          <div className="content-image-container">
            <img
              src="https://firebasestorage.googleapis.com/v0/b/rincon-urbano.appspot.com/o/web-images%2FFotos%20Paginas%2FAllDevices-LANDING.png?alt=media&token=9971d563-5d70-4bb1-89d8-f04d91c01d72"
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
