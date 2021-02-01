import React from 'react';
import { Link } from 'react-scroll';

const ScrollComponent = (props) => {
  return (
    <Link
      activeClass='active'
      to={props.section}
      spy={true}
      smooth={true}
      offset={-70}
      duration={900}>
      {props.children}
    </Link>
  );
};

export default ScrollComponent;
