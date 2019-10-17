/* eslint-disable jsx-a11y/label-has-associated-control */
import React from 'react';
import { withStyles } from '@material-ui/styles';

function TextField(args) {
    const { classes, label, type, style, ...otherArgs } = args;
    return (
        <>
            <div style={style}>
                <div className={classes.container}>
                    <input {...otherArgs} className={classes.input} type={type || 'text'} required="required" />
                    <div className={classes.bar} />
                    <label className={classes.label}>{label}</label>
                </div>
            </div>
        </>
    );
}

const styles = () => ({
    container: {
        position: 'relative',
        marginTop: 12,
    },
    input: {
        background: 'none',
        color: 'black',
        fontSize: 18,
        padding: '7px 7px 7px 5px',
        display: 'block',
        width: '100%',
        border: 'none',
        borderRadius: 0,
        borderBottom: '1px solid grey',
        '&:focus': {
            outline: 'none',
        },
        '&:focus ~ label': {
            top: -14,
            fontSize: 12,
            color: '#2196F3',
        },
        '&:valid ~ label': {
            top: -14,
            fontSize: 12,
            color: '#2196F3',
        },
        '&:focus ~ div': {
            width: 'calc(100% + 12px)',
        },
    },
    label: {
        color: '#4d4d4d',
        fontSize: 16,
        // fontFamily: 'roboto',
        position: 'absolute',
        pointerEvents: 'none',
        left: 5,
        top: 10,
        transition: '300ms ease all',
    },
    bar: {
        margin: '-2px auto 0 auto',
        width: '0%',
        height: 2,
        backgroundColor: '#2196F3',
        transition: '300ms ease all',
    },
});

export default withStyles(styles)(TextField);