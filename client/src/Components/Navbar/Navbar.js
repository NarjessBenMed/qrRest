import React, { Fragment, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { logout } from '../../features/authSlice';
import { HiMenuAlt3 } from 'react-icons/hi';
import { MdRestaurantMenu } from 'react-icons/md';
import { IconContext } from 'react-icons';
import ScrollComponent from '../../utils/scroll';
import './Navbar.css';

const Navbar = () => {
  const [click, setClick] = useState(false);
  const handleClick = () => setClick(!click);
  const closeMobileMenu = () => setClick(false);
  const dispatch = useDispatch();

  const isAuth = useSelector((state) => state.auth.isAuthenticated);
  const isClient = useSelector((state) => state.auth.isClient);
  const user = useSelector((state) => state.auth.user);
  const handleLog = () => {
    dispatch(logout());
  };

  const adminMenu = (
    <Fragment>
      <Link to='/admin-section'>
        <span className='navbar__link'>Home</span>
      </Link>
      <Link to='/'>
        <span className='navbar__link' onClick={handleLog}>
          Déconnexion
        </span>
      </Link>
    </Fragment>
  );
  const ownerMenu = (
    <Fragment>
      <Link to='/owner-section'>
        <span className='navbar__link'>Home</span>
      </Link>
      <Link to='/'>
        <span className='navbar__link' onClick={handleLog}>
          Déconnexion
        </span>
      </Link>
    </Fragment>
  );
  const homeMenu = (
    <Fragment>
      <Link to='/'>
        <span className='navbar__link' onClick={closeMobileMenu}>
          Home
        </span>
      </Link>
      <div
        className={click ? 'navbar__first-menu active' : 'navbar__first-menu'}
        onClick={closeMobileMenu}>
        <ScrollComponent section='sect1'>
          <span className='navbar__link' onClick={closeMobileMenu}>
            fonctionnement
          </span>
        </ScrollComponent>

        <ScrollComponent section='sect2'>
          <span className='navbar__link' onClick={closeMobileMenu}>
            avantages
          </span>
        </ScrollComponent>
        <ScrollComponent section='sect3'>
          <span className='navbar__link' onClick={closeMobileMenu}>
            adhérents
          </span>
        </ScrollComponent>
        <ScrollComponent section='sect1'>
          <span className='navbar__link' onClick={closeMobileMenu}>
            Nous contacter
          </span>
        </ScrollComponent>
      </div>
      <div className='navbar__second-menu'>
        <Link to='/signin' onClick={closeMobileMenu}>
          <span className='navbar__link'>se connecter</span>
        </Link>
        <div className='mobile-menu' onClick={handleClick}>
          {click ? (
            <IconContext.Provider value={{ className: 'menu-icon' }}>
              <div>
                <MdRestaurantMenu />
              </div>
            </IconContext.Provider>
          ) : (
            <IconContext.Provider value={{ className: 'menu-icon' }}>
              <div>
                <HiMenuAlt3 />
              </div>
            </IconContext.Provider>
          )}
        </div>
      </div>
    </Fragment>
  );
  const clientMenu = (
    <Fragment>
      <Link to='/client-page'>
        <span className='navbar__link'>Menu</span>
      </Link>
      <Link to='/'>
        <span className='navbar__link'>Deconnexion</span>
      </Link>
    </Fragment>
  );
  const workerMenu = (
    <Fragment>
      <Link to='/worker-section'>
        <span className='navbar__link active'>Home</span>
      </Link>
      <Link to='/'>
        <span className='navbar__link' onClick={handleLog}>
          Déconnexion
        </span>
      </Link>
    </Fragment>
  );
  const navMenu = isAuth
    ? user.role === 'owner'
      ? ownerMenu
      : user.role === 'admin'
      ? adminMenu
      : workerMenu
    : isClient
    ? clientMenu
    : homeMenu;

  return <div className='navbar'>{navMenu}</div>;
};

export default Navbar;
