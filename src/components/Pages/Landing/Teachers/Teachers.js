import React, { Component } from 'react';
import Carousel from '@brainhubeu/react-carousel';
import '@brainhubeu/react-carousel/lib/style.css';
import './teachers.scss';
import TeacherItem from './TeacherItem';

import { getTeachersQuery } from '../../../Firebase/Queries/users';

export class Teachers extends Component {
  constructor(props) {
    super(props);
    this.state = { teachers: [], error: null };
  }

  async componentDidMount() {
    const teachersResponse = await getTeachersQuery();
    if (teachersResponse.status === 200)
      this.setState({ teachers: teachersResponse.data });
    else {
      console.log(
        'Error fetching Teachers ROLES DB ',
        teachersResponse.message
      );
      this.setState({ error: teachersResponse.message });
    }
  }

  render() {
    const teachers = this.state.teachers;
    return (
      <div>
        <section className="profes" id="profes">
          <h1>Nuestros profes</h1>
          <hr></hr>
          {teachers && (
            <div className="carousel-container">
              <Carousel
                centered
                infinite
                slidesPerPage={3}
                stopAutoPlayOnHover
                draggable
                arrows
              >
                {teachers.map((teacher) => (
                  <TeacherItem teacher={teacher} key={teacher.uid} />
                ))}
              </Carousel>
            </div>
          )}
        </section>
      </div>
    );
  }
}

export default Teachers;
