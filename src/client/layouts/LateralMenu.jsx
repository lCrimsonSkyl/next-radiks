/* eslint-disable jsx-a11y/label-has-associated-control */
import React from 'react';
import './LateralMenu.css';

function NavBar(props) {
    // comes from _app/NavBar
    const { handleSignOut } = props;
    return (
        <>
            <input className="input" type="checkbox" id="navcheck" role="button" title="menu" />
            <label htmlFor="navcheck" aria-hidden="true" >
                <span className="burger">
                    <span className="bar">
                        <span className="visuallyhidden">Menu</span>
                    </span>
                </span>
            </label>
            <nav id="menu">
                <a href="#">Lorem.</a>
                <a href="#">Nesciunt!</a>
                <a href="#">Magnam.</a>
                <a href="#">Ipsum.</a>
                <a href="#">Voluptatem.</a>
                {/* <a href="#">Quibusdam.</a> */}
                <a style={{ marginTop: 20 }} onClick={handleSignOut}>SignOut</a>
            </nav>
        </>
    );
}

export default NavBar;

