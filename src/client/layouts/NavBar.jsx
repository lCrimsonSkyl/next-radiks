import React, { useState } from 'react';
import Link from 'next/link';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/styles';
import Logo from '../static/images/paradigmaSVG';
import HomeIcon from '../static/icons/home';
import NetworkIcon from '../static/icons/network';
import MessagesIcon from '../static/icons/messages';
import NotificationIcon from '../static/icons/notification';

const styles = () => ({
    container: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: 55,
        width: '100vw',
        backgroundColor: '#2196F3',
    },
    navigation: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
        padding: '0 10px',
    },
    indicator: {
        position: 'absolute',
        alignSelf: 'flex-end',
        width: 'calc(100px * 4)',
        height: '4px',
        '& div': {
            height: '100%',
            width: 90,
            backgroundColor: 'white',
            padding: '0px 5px',
            transition: 'all 0.5s ease-in',
        },
    },
    tab: {
        backgroundColor: 'transparent',
        width: 90,
        textDecoration: 'none',
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        margin: '0px 5px',
    }

});

function NavBar(props) {
    const [index, setIndex] = useState(0);

    const { classes } = props;
    let indicatorMargin;
    if (index === 0) indicatorMargin = 0;
    if (index === 1) indicatorMargin = 100;
    if (index === 2) indicatorMargin = 100 * 2;
    if (index === 3) indicatorMargin = 100 * 3;

    return (
        <>
            <header className={classes.container}>
                <Logo color="white" height="70%" style={{ margin: '0px 10px' }} />
                <div className={classes.navigation}>
                    <div className={classes.indicator}>
                        <div style={{ marginLeft: indicatorMargin }} />
                    </div>
                    <Link href="/main">
                        <a className={classes.tab} onClick={() => setIndex(0)} >
                            <HomeIcon height="50%" />
                            <b style={{ fontWeight: 600, color: '#FFFFFF', fontSize: 14, margin: 0 }}>Home</b>
                        </a>
                    </Link>
                    <Link href="/main">
                        <a className={classes.tab} onClick={() => setIndex(1)} >
                            <NetworkIcon height="50%" style={{ margin: '0px 5px' }} />
                            <b style={{ fontWeight: 600, color: '#FFFFFF', fontSize: 14, margin: 0 }}>Network</b>
                        </a>
                    </Link>
                    <Link href="/main">
                        <a className={classes.tab} onClick={() => setIndex(2)} >
                            <MessagesIcon height="50%" style={{ margin: '0px 5px' }} />
                            <b style={{ fontWeight: 600, color: '#FFFFFF', fontSize: 14, margin: 0 }}>Messages</b>
                        </a>
                    </Link>
                    <Link href="/main">
                        <a className={classes.tab} onClick={() => setIndex(3)} >
                            <NotificationIcon number={0} height="50%" style={{ margin: '0px 5px' }} />
                            <b style={{ fontWeight: 600, color: '#FFFFFF', fontSize: 14, margin: 0 }}>Notifications</b>
                        </a>
                    </Link>

                </div>
            </header>
        </>
    );
}

NavBar.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(NavBar);

