import React from 'react';
// import { pure } from 'recompose';
import _JSXStyle from 'styled-jsx/style';
import './textField.css';

const Button = (props) => {
  // const { text, ...otherProps } = props;

  return (
    <>

      <div className="wrapper">
        <form>
          <h1>Material Inputs</h1>
          <h5>Inspired by Google's Material Design guidelines for text fields</h5>
          <div className="btn-box"><a className="btn btn-link" href="https://material.google.com/components/text-fields.html" target="_blank">Design Docs</a></div>
          <hr className="sep" />

          <div className="group">
            <input type="text" required="required" />
            <span className="highlight"></span>
            <span className="bar"></span>
            <label>Name</label>
          </div>

          <div className="group">
            <input type="text" required="required" /><span className="highlight"></span><span className="bar"></span>
            <label>Email</label>
          </div>
          <div className="group">
            <input type="password" required="required" /><span className="highlight"></span><span className="bar"></span>
            <label>Password</label>
          </div>
          <div className="group">
            <input type="number" required="required" /><span className="highlight"></span><span className="bar"></span>
            <label>Number</label>
          </div>
          <div className="group">
            <textarea type="textarea" rows="5" required="required"></textarea><span className="highlight"></span><span className="bar"></span>
            <label>Message</label>
          </div>
          <div className="btn-box">
            <button className="btn btn-submit" type="submit">submit</button>
            <button className="btn btn-cancel" type="button">cancel</button>
            <h5>*these buttons do nothing <span className="emoji">&#x1F609;</span></h5>
          </div>
        </form>
      </div>
    </>
  );
}

export default Button;