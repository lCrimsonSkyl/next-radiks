import React, { useState } from 'react';
import {
    Person,
} from 'blockstack';
import Link from 'next/link';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/styles';
import Logo from '../static/images/paradigmaSVG';
import HomeIcon from '../static/icons/home';
import NetworkIcon from '../static/icons/network';
import MessagesIcon from '../static/icons/messages';
import NotificationIcon from '../static/icons/notification';

import LateralMenu from './LateralMenu';

const tabSize = 75;
const tabCount = 5;
const indicatorWrapper = (tabSize * tabCount) + 10 * tabCount;

function NavBar(props) {

    const { loadUserData } = props;
    const userData = loadUserData();
    const person = new Person(userData.profile);
    const avatarUrl = person.avatarUrl();
    const avatar = avatarUrl ? `url(${avatarUrl})` : 'url(/static/images/placeholder.svg)';

    // comes from _app
    const { handleSignOut } = props;

    const [index, setIndex] = useState(0);
    const { classes } = props;
    const indicatorMargin = (tabSize + 10) * index;

    return (
        <>
            <header className={classes.container}>
                <LateralMenu handleSignOut={handleSignOut} />
                <Logo color="white" height="70%" style={{ marginLeft: '3em', padding: '0px 10px' }} />
                <div className={classes.navigation}>
                    <div className={classes.indicator}>
                        <div style={{ marginLeft: indicatorMargin }} />
                    </div>
                    <Link href="/main">
                        <a className={classes.tab} onClick={() => setIndex(0)} >
                            <HomeIcon height="50%" />
                            <b>Home</b>
                        </a>
                    </Link>
                    <Link href="/network">
                        <a className={classes.tab} onClick={() => setIndex(1)} >
                            <NetworkIcon height="50%" style={{ margin: '0px 5px' }} />
                            <b>Network</b>
                        </a>
                    </Link>
                    <Link href="/oldMain">
                        <a className={classes.tab} onClick={() => setIndex(2)} >
                            <MessagesIcon height="50%" style={{ margin: '0px 5px' }} />
                            <b>Messages</b>
                        </a>
                    </Link>
                    <Link href="/main">
                        <a className={classes.tab} onClick={() => setIndex(3)} >
                            <NotificationIcon number={0} height="50%" style={{ margin: '0px 5px' }} />
                            <b>Notifications</b>
                        </a>
                    </Link>
                    <Link href="/main">
                        <a className={classes.tab} onClick={() => setIndex(4)} >
                            <div
                                className={classes.avatar}
                                style={{
                                    margin: '0px 5px',
                                    backgroundImage: avatar,
                                }}
                            />
                            <b>Me</b>
                        </a>
                    </Link>
                </div>
            </header>
        </>
    );
}

NavBar.propTypes = {
    classes: PropTypes.object.isRequired,
    handleSignOut: PropTypes.func.isRequired,
};

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
        width: indicatorWrapper, // var
        height: '4px',
        '& div': {
            height: '100%',
            width: tabSize,
            backgroundColor: 'white',
            padding: '0px 5px',
            transition: 'all 0.35s ease-in',
        },
    },
    tab: {
        backgroundColor: 'transparent',
        width: tabSize, // var
        textDecoration: 'none',
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        margin: '0px 5px',
        '& b': {
            fontWeight: 600,
            color: '#FFFFFF',
            fontSize: 13,
            margin: 0,
        },
    },
    avatar: {
        width: 30,
        height: 30,
        borderRadius: '100%',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',
        backgroundColor: 'white',
    },
});

export default withStyles(styles)(NavBar);
