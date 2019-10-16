import React from 'react';
// import { pure } from 'recompose';
import _JSXStyle from 'styled-jsx/style';

const Button = (props) => {
  // const { text, ...otherProps } = props;

  return (
    <>
      <style jsx>
        {`
                    *,
                    :before,
                    :after {
                      box-sizing: border-box;
                    }
                    
                    form {
                      width: 320px;
                      margin: 45px auto;
                    }
                    form h1 {
                      font-size: 3em;
                      font-weight: 300;
                      text-align: center;
                      color: #2196F3;
                    }
                    form h5 {
                      text-align: center;
                      text-transform: uppercase;
                      color: #c6c6c6;
                    }
                    form hr.sep {
                      background: #2196F3;
                      box-shadow: none;
                      border: none;
                      height: 2px;
                      width: 25%;
                      margin: 0px auto 45px auto;
                    }
                    form .emoji {
                      font-size: 1.2em;
                    }
                    
                    .group {
                      position: relative;
                      margin: 45px 0;
                    }
                    
                    textarea {
                      resize: none;
                    }
                    
                    input,
                    textarea {
                      background: none;
                      color: #2e2e2e;
                      font-size: 18px;
                      padding: 10px 10px 10px 5px;
                      display: block;
                      width: 320px;
                      border: none;
                      border-radius: 0;
                      border-bottom: 1px solid #c6c6c6;
                    }
                    input:focus,
                    textarea:focus {
                      outline: none;
                    }
                    input:focus ~ label, input:valid ~ label,
                    textarea:focus ~ label,
                    textarea:valid ~ label {
                      top: -14px;
                      font-size: 12px;
                      color: #2196F3;
                    }
                    input:focus ~ .bar:before,
                    textarea:focus ~ .bar:before {
                      width: 320px;
                    }
                    
                    input[type="password"] {
                      letter-spacing: 0.3em;
                    }
                    
                    label {
                      color: #4d4d4d;
                      font-size: 16px;
                      font-weight: normal;
                      position: absolute;
                      pointer-events: none;
                      left: 5px;
                      top: 10px;
                      transition: 300ms ease all;
                    }
                    
                    .bar {
                      position: relative;
                      display: block;
                      width: 320px;
                    }
                    .bar:before {
                      content: '';
                      height: 2px;
                      width: 0;
                      bottom: 0px;
                      position: absolute;
                      background: #2196F3;
                      transition: 300ms ease all;
                      left: 0%;
                    }
                `}
      </style>

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