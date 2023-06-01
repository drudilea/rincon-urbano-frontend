import * as ROUTES from '../constants/routes'

import { confirmAlert } from 'react-confirm-alert'
import 'react-confirm-alert/src/react-confirm-alert.css'
import { userEnterClassQuery } from '../components/Firebase/Queries/streams'

export const assignStreamTeacherProps = (teachers, weekStreams) => {
  let index = 0
  const displayStreams = []
  if (weekStreams) {
    teachers.forEach((teacher) =>
      weekStreams.forEach(function (stream) {
        if (stream.teacher === teacher.uid) {
          displayStreams[index] = {
            teacherUid: teacher.uid,
            teacherFirstName: teacher.firstName,
            teacherLastName: teacher.lastName,
            teacherStyle: teacher.style,
            teacherDisplayImg: teacher.displayImg,
            teacherCountry: teacher.country,
            streamUrl: stream.streamUrl,
            streamRoom: stream.room,
            streamId: stream.streamId,
            streamWeek: stream.weekNumberOfTheYear,
            streamStartTime: stream.startDateTimeAsNumber,
            streamSong: stream.song,
            streamArtist: stream.artist,
          }
          index += 1
          return
        }
      }),
    )
  }

  return displayStreams
}

export const userEnterStreamProcess = (
  { enterClass, freeDay, freeClass, freeClassesLeft, alreadyInClass },
  stream,
  history,
  userId,
) => {
  if (alreadyInClass) {
    history.push({
      pathname: `${ROUTES.STREAM}/${stream.streamId}`,
      state: { streamUrl: stream.streamUrl, streamId: stream.streamId },
    })
  } else if (enterClass) {
    let customMessage = null
    if (freeDay)
      customMessage =
        'Ésta clase es gratuita! No descontaremos ninguna clase de tus paquetes, disfrutala!'
    else if (freeClass)
      customMessage =
        'Al confirmar, descontaremos la clase gratuita correspondiente a tu usuario de Rincón Urbano. Podrás visualizarla desde el horario de comienzo hasta 48hs posterior a la clase'
    else
      customMessage =
        'Al confirmar descontaremos una clase de tu paquete y podrás visualizarla desde el horario de comienzo hasta 48hs posterior a la clase'

    confirmAlert({
      title: `Estas a punto de entrar a la clase de ${stream.teacherFirstName} ${stream.teacherLastName}`,
      message: customMessage,
      buttons: [
        {
          label: 'Si, llévame ahora',
          onClick: async () => {
            try {
              const userEnterClassResponse = await userEnterClassQuery(
                userId,
                stream.streamId,
              )

              if (userEnterClassResponse.ok) {
                history.push({
                  pathname: `${ROUTES.STREAM}/${stream.streamId}`,
                  state: {
                    streamUrl: stream.streamUrl,
                    streamId: stream.streamId,
                  },
                })
              }
            } catch (e) {
              console.log('Error fetching enter-class API', e)
              confirmAlert({
                title: 'Tuvimos un problema con esta clase',
                message:
                  'Estamos realizando arreglos para darte una mejor experiencia',
                buttons: [
                  {
                    label: 'Volver',
                    onClick: () => history.push(ROUTES.HOME),
                  },
                ],
              })
            }
          },
        },
        {
          label: 'Cancelar',
        },
      ],
    })
  } else {
    confirmAlert({
      title: 'No tienes clases disponibles',
      message: '¿Deseas comprar algun pack?',
      buttons: [
        {
          label: 'Si, llévame ahora',
          onClick: () => history.push(ROUTES.BUY_PACK),
        },
        {
          label: 'No gracias',
        },
      ],
    })
  }
}

export const separateStreamsByWeek = (streams) => {
  return streams.sort(compareReverse).groupBy('streamWeek')
}

export const adminSeparateStreamsByWeek = (streams) => {
  return streams.sort(compare).groupBy('streamWeek')
}

// Util functions
function compare(a, b) {
  let comparison = 0
  if (a.streamStartTime > b.streamStartTime) {
    comparison = 1
  } else if (a.streamStartTime < b.streamStartTime) {
    comparison = -1
  }
  return comparison
}

// Util functions
function compareReverse(a, b) {
  let comparison = 0
  if (a.streamStartTime < b.streamStartTime) {
    comparison = 1
  } else if (a.streamStartTime > b.streamStartTime) {
    comparison = -1
  }
  return comparison
}

// Prototype functions
// eslint-disable-next-line no-extend-native
Array.prototype.groupBy = function (key) {
  return this.reduce(function (r, a, i) {
    if (!i || r[r.length - 1][0][key] !== a[key]) {
      return r.concat([[a]])
    }
    r[r.length - 1].push(a)
    return r
  }, [])
}
