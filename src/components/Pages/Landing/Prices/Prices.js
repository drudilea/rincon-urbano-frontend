import React from 'react'

import './prices.scss'

function Nosotros(props) {
  return (
    <div>
      <section id='precios' className='prices-section'>
        <div className='prices-container'>
          <h1>Opciones que se ajustan a vos</h1>
          <hr></hr>
          <div className='content-container'>
            <div className='left-side-container'>
              <p>
                <strong>
                  ¡Te ofrecemos estos packs para que no dejes de formarte!
                </strong>
                <br />
                <br />
                Entrá a la clase que más te guste y la descontaremos del pack
                adquirido. Desde el día de tu compra, tenés{' '}
                <strong>UN MES</strong> para utilizarlas cuando y como quieras.
                <br />
                <br />
                Tus pagos estarán respaldados por Mercado Pago® que brinda una
                gran variedad de cuotas y formas de pago.{' '}
              </p>
              <br />

              <img
                src='https://firebasestorage.googleapis.com/v0/b/rincon-urbano.appspot.com/o/web-images%2FIcons%2Flogo-mp-final.png?alt=media&token=06fcabfe-a7b2-48fd-8745-0efebef2fc2a'
                alt=''
              />
            </div>
            <div className='content-prices-container'>
              <div className='prices-item'>
                <span className='pack'>Paquete 1 clase</span>
                <span className='price'>$ 200</span>
              </div>
              <div className='prices-item'>
                <span className='pack'>Paquete 4 clases</span>
                <span className='price'>$ 650</span>
              </div>
              <div className='prices-item'>
                <span className='pack'>Paquete 8 clases</span>
                <span className='price'>$ 1200</span>
              </div>
              <div className='prices-item'>
                <span className='pack'>Paquete 16 clases</span>
                <span className='price'>$ 2200</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Nosotros
