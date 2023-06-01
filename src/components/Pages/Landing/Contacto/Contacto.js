import React from 'react';
import './contacto.scss';
import { Link } from 'react-router-dom';

export default function Contacto() {
  return (
    <div>
      <div className="footer">
        <img
          src="https://firebasestorage.googleapis.com/v0/b/rincon-urbano.appspot.com/o/web-images%2FIcons%2FlogotipoVerdeBlanco.png?alt=media&token=7e2b6ea0-bfe3-488f-a6e6-4ac27542ad09"
          alt="white-logo"
          className="nav-logo"
        ></img>
        <div className="contacto">
          <span>Contactanos</span>
          <div className="social-net">
            <a
              href="https://www.facebook.com/rinconurbanoclub"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                src="https://firebasestorage.googleapis.com/v0/b/rincon-urbano.appspot.com/o/web-images%2FIcons%2FWhite%20facebook%20%5Blogo%5D%20-%20contact.png?alt=media&token=32150268-81d3-4ff9-98d0-251124040e06"
                alt=""
                className="social-img"
              />
            </a>
            <a
              href="https://www.instagram.com/rinconurbanok/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                src="https://firebasestorage.googleapis.com/v0/b/rincon-urbano.appspot.com/o/web-images%2FIcons%2FWhite%20instagram%20%5Blogo%5D%20-%20contact.png?alt=media&token=4dfb4dde-b61a-4aeb-898f-0d2d2978fa2f"
                alt=""
                className="social-img"
              />
            </a>
            <a
              href="https://bit.ly/ruContactanos"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                src="https://firebasestorage.googleapis.com/v0/b/rincon-urbano.appspot.com/o/web-images%2FIcons%2FWhite%20whatsapp%20%5Blogo%5D%20-%20contact.png?alt=media&token=af9e1573-3aa3-4c3f-bedd-8c957011344a"
                alt=""
                className="social-img"
              />
            </a>
          </div>
        </div>
      </div>
      <div className="registered-trademark">
        <span>2020 Rincón Urbano®</span>
        <Link
          to="/legal/privacy-policy"
          className="legal"
        >{` - Políticas de Privacidad - `}</Link>
        <Link
          to="/legal/terms-and-conditions"
          className="legal"
        >{`Términos y Condiciones`}</Link>
      </div>
    </div>
  );
}
