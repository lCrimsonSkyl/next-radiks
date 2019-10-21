import React from 'react';
import PropTypes from 'prop-types';
import Router from 'next/router';
import _JSXStyle from 'styled-jsx/style';
import { withStyles } from '@material-ui/styles';
import Button from '../components/Button';

function Login(props) {

    const { isUserSignedIn, handleSignIn } = props;

    if (isUserSignedIn) {
        Router.push('/main');
        return null;
    }

    const { classes } = props;
    return (
        <>
            <style jsx>
                {`
                    .rainbowText {
                        background: #17e7f9; /* Old browsers */
                        background: -moz-linear-gradient(45deg, #17e7f9 0%, #1c86b8 100%); /* FF3.6-15 */
                        background: -ms-linear-gradient(45deg, #17e7f9 0%, #1c86b8 100%); /* FF3.6-15 */
                        background: -o-linear-gradient(45deg, #17e7f9 0%, #1c86b8 100%); /* FF3.6-15 */
                        background: -webkit-linear-gradient(45deg, #17e7f9 0%,#1c86b8 100%); /* Chrome10-25,Safari5.1-6 */
                        filter: progid:DXImageTransform.Microsoft.gradient( startColorstr='#17e7f9', endColorstr='#1c86b8',GradientType=1 );
                        background: linear-gradient(45deg, #17e7f9 0%,#1c86b8 100%); /* W3C, IE10+, FF16+, Chrome26+, Opera12+, Safari7+ */
                        color:transparent;
                        -webkit-background-clip: text;
                        background-clip: text;
                    }
                `}
            </style>
            <div className={classes.container}>
                <section>
                    <div className={classes.textWrapper}>
                        <p className="rainbowText" >
                            Smart Contract to CrossCheck virtually any Event
                    </p>
                        <div className="rainbowText" >
                            You are almost there!
                    </div>
                    </div>

                    <div style={{ height: 50, marginBottom: 15 }}>
                        <div className={classes.arrowWrapper} >
                            <div className={classes.arrow} aria-hidden="true" />
                        </div>
                    </div>

                    <Button
                        label="Secure login with blockstack browser"
                        onClick={handleSignIn}
                        style={{ marginBottom: 15 }}
                    />

                    <div style={{ color: 'white' }}>
                        <div>
                            Unknown to Blockstack?
                    </div>
                        <a href="https://blockstack.org/install" style={{ color: 'white', fontWeight: "bold", textDecoration: 'none' }}>
                            Download Blockstack Browser here
                    </a>
                    </div>
                </section>
            </div>
        </>
    );
}

const styles = () => ({
    container: {
        display: 'flex',
        height: '100vh',
        width: '100vw',
        flexDirection: 'column',
        alignItems: 'flex-end',
        justifyContent: 'center',
        background: 'url(/static/images/background.png)',
        backgroundImage: 'url(/static/images/background.png)',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',
        '& section': {
            margin: 20,
            textAlign: 'center',
            maxWidth: '40%',
        },
    },
    textWrapper: {
        fontWeight: 'bold',
        fontSize: 35,
        marginBottom: 15,
    },
    // rainbowText: {

    // },
    arrow: {
        width: 20,
        height: 20,
        border: '5px solid',
        borderColor: 'white transparent transparent white',
        transform: 'rotate(-135deg)',
    },
    '@keyframes arrowAnimation': {
        from: {
            transform: 'translateY(0px)',
        },
        '50%': {
            transform: 'translateY(6px)',
        },
        to: {
            transform: 'translateY(0px)',
        },
    },
    arrowWrapper: {
        display: 'inline-block',
        color: '#F07F0A',
        fontSize: '4rem',
        animationName: 'arrowAnimation',
        '-webkit-animation': 'arrowAnimation 2s ease-in-out infinite',
        '-moz-animation': 'arrowAnimation 2s ease-in-out infinite',
        animation: 'arrowAnimation 2s ease-in-out infinite',
        animationDuration: '2s',
        animationTimingFunction: 'ease-in-out',
        animationIterationCount: 'infinite',
    },
});

Login.propTypes = {
    classes: PropTypes.object,
    handleSignIn: PropTypes.func,
    isUserSignedIn: PropTypes.bool,
}

export default withStyles(styles)(Login);