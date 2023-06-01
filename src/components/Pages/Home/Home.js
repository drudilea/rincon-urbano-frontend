import React, { Component } from 'react'
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs'
import { compose } from 'recompose'

import { withAuthorization } from '../../Session/Session'
import { withFirebase } from '../../Firebase'
import Navigation from '../../Shared/NavigationNon-Auth/Navigation'

import Progress from './Tab Contents/Progress'
import WeekStreams from './Tab Contents/WeekStreams'
import MonthSchedule from './Tab Contents/MonthSchedule'

import './home.scss'

class HomePageBase extends Component {
  constructor(props) {
    super(props)

    this.state = {
      tabIndex: 1,
      loading: true,
      user: JSON.parse(sessionStorage.getItem('authUser')),
      userFreeClasses: null,
    }
  }

  // Compara los packs en el arreglo de User-Packs y los ordena por fecha de compra
  compare(a, b) {
    let comparison = 0
    if (a.purchaseDate > b.purchaseDate) {
      comparison = 1
    } else if (a.purchaseDate < b.purchaseDate) {
      comparison = -1
    }
    return comparison
  }

  componentDidMount() {
    this.setState({ userFreeClasses: this.state.user.freeClasses })

    // Traemos todos los packs comprados por el user (para ver si puede entrar a una clase o no, y para pasarselo como props a Progress)
    try {
      this.props.firebase
        .userpacks()
        .orderByChild('uid')
        .equalTo(this.state.user.uid)
        .once('value', (snapshot) => {
          let userPackList
          let streamsLeft = 0
          const userPackObject = snapshot.val()
          if (userPackObject) {
            userPackList = Object.keys(userPackObject).map((key) => ({
              ...userPackObject[key],
              uid: key,
            }))
            userPackList.sort(this.compare)

            userPackList.forEach(
              (userPack) => (streamsLeft += userPack.streamsLeft),
            )

            this.setState({
              loading: false,
              userPackList,
              streamsLeft,
              noPacks: false,
            })
          } else {
            this.setState({
              loading: false,
              noPacks: true,
            })
          }
        })
    } catch (e) {
      console.log('Problema en DB Teachers: ', e)
    }
  }

  componentWillUnmount() {}

  render() {
    if (JSON.parse(sessionStorage.getItem('authUser')) === null) {
      window.location.reload()
    }
    return (
      <div>
        <section className='home-container'>
          {this.state.userFreeClasses > 1 && (
            <div className='free-class-adv'>
              Todavía tenes{' '}
              {this.state.userFreeClasses > 1
                ? `tus clases gratis disponibles. Podés usarlas para cualquier clase.`
                : `tu clase gratis disponible. Podés usarla para cualquier clase.`}
            </div>
          )}
          <Navigation />

          <h2>
            Hola {this.state.user.firstName}, nos alegra tenerte con nosotros.
          </h2>
          <hr />

          <Tabs
            className='tabs-container'
            selectedIndex={this.state.tabIndex}
            onSelect={(tabIndex) => this.setState({ tabIndex })}
          >
            <TabList className='tab-list-container'>
              <Tab
                className={
                  'tab-item-container left ' +
                  (this.state.tabIndex === 0 ? 'active' : null)
                }
              >
                Mi cuenta
              </Tab>
              <Tab
                className={
                  'tab-item-container ' +
                  (this.state.tabIndex === 1 ? 'active' : null)
                }
              >
                Clases de la semana
              </Tab>
              <Tab
                className={
                  'tab-item-container right ' +
                  (this.state.tabIndex === 2 ? 'active' : null)
                }
              >
                Clases del mes
              </Tab>
            </TabList>
            <TabPanel>
              <Progress />
            </TabPanel>
            <TabPanel>
              <WeekStreams
                user={this.state.user}
                userPacks={this.state.userPackList}
                loading={this.state.loading}
                streamsLeft={this.state.streamsLeft}
              />
            </TabPanel>
            <TabPanel>
              <MonthSchedule />
            </TabPanel>
          </Tabs>
        </section>
      </div>
    )
  }
}

const condition = (authUser) => !!authUser
const HomePage = withFirebase(HomePageBase)
export default compose(withAuthorization(condition))(HomePage)
