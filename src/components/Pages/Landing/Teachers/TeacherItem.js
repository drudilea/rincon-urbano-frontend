import React from 'react';

export default function TeacherItem(props) {
  return (
    <div className="profe-container">
      <a
        href={props.teacher.linkInstagram}
        target="_blank"
        rel="noopener noreferrer"
      >
        <img src={props.teacher.landingImg} alt="profe" className="profe-img" />
      </a>
      <span className="fullname">
        <span
          className={
            'name ' + props.teacher.style.toLowerCase().replace(/\s/g, '')
          }
        >
          {props.teacher.firstName}
        </span>
        <span className="lastname">{props.teacher.lastName}</span>
      </span>
    </div>
  );
}
