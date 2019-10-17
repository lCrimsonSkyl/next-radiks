

/* eslint-disable */
import React from 'react';

const Messages = ({
    number = 0,
    style = {},
    color = '#FFFFFF',
    colorSecondary = '#F80021',
    // width = '100%',
    className = '',
    height = '100%',
    viewBox = '0 0 62.4 65.6',
}) =>
    <svg
        // width={width}
        style={style}
        height={height}
        viewBox={viewBox}
        className={className}
        xmlns="http://www.w3.org/2000/svg"
    >
        <path fill={color} d="M29.689 59.052c-.04.257-.06.519-.06.785 0 3.154 2.912 5.715 6.5 5.715 3.587 0 6.5-2.561 6.5-5.715 0-.266-.021-.528-.061-.785H29.689z" />
        {number == 0 ?
            <>
                <path fill={color} d="M39.379 10.152v-.6c0-1.655-1.457-3-3.25-3-1.794 0-3.25 1.345-3.25 3v.6c2.321-.263 4.498-.253 6.5 0z" />
                <path fill={color} d="M13.15 48.052c2.271-1.349 3.581-6.839 3.3-16.5.372-10.754 10.208-18.56 20.19-18.4 9.213.121 18.976 8.018 19.21 18.4.187 11.719 1.086 15.169 3.3 16.5 5.008 3.188 3.906 7.993-1 8h-43c-5.578.016-7.547-3.968-2-8z" />
            </>
            :
            <>
                <path fill={color} d="M35.306 9.973c1.424-.046 2.785.016 4.073.179v-.6c0-1.655-1.457-3-3.25-3-.853 0-1.629.304-2.201.808.528.828.992 1.699 1.378 2.613z" />
                <path fill={color} d="M16.392 37.99c-.017.197-.129 1.435-.141 1.567-.458 4.75-1.558 7.578-3.101 8.495-5.547 4.032-3.578 8.016 2 8h43c4.906-.007 6.008-4.812 1-8-2.214-1.331-3.113-4.781-3.3-16.5-.233-10.342-9.921-18.218-19.103-18.398-.015 0-.147 0-.338-.001.386 1.553.591 3.176.591 4.847 0 11.038-8.962 20-20 20-.203 0-.406-.003-.608-.01z" />
                <circle cx="17" cy="18" r="17" fill={colorSecondary} vector-effect="non-scaling-stroke" />
                <text fill={color} font-family="Roboto" font-size="23" font-weight="900" transform={number.toString().length > 1 ? "translate(2.975 26.586)" : "translate(10.5 26.586)"}>{number}</text>
            </>
        }
    </svg>;

export default Messages;