import React from 'react'

function DesktopWeekStreams({ onClickHandler, weekStreams }) {
  return (
    <div className='non-carousel-responsive'>
      {weekStreams.map((stream) => (
        <div
          className={'stream-item'}
          key={stream.streamId}
          disabled={stream.disableAccess}
        >
          <div className='top-stream-item'>
            <div className='top-left-stream-item'>
              <img src={stream.teacherDisplayImg} alt='' srcSet='' />
            </div>
            <div className='top-right-stream-item'>
              <span
                className={
                  'stream-item-style ' +
                  stream.teacherStyle.toLowerCase().replace(/\s/g, '')
                }
              >
                {stream.teacherStyle}
              </span>
              <div className='stream-item-teacher'>
                <span className='stream-item-teacher-firstname'>
                  {stream.teacherFirstName}
                </span>
                <span className='stream-item-teacher-lastname'>
                  {stream.teacherLastName}
                </span>
              </div>
              {stream.streamSong && (
                <span className='stream-item-song'>
                  <span className='stream-song-name'>{stream.streamSong}</span>
                  <span className='stream-song-artist'>
                    {' '}
                    {stream.streamArtist}
                  </span>
                </span>
              )}
              {!stream.streamSong && (
                <span className='stream-item-song'>Canción sorpresa</span>
              )}
            </div>
          </div>
          <div className='bottom-stream-item'>
            <button onClick={(e) => onClickHandler(stream, e)}>
              <span className='button-text'>Tomar clase</span>
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}

export default DesktopWeekStreams
