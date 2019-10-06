
import React, { Component } from 'react';
import Router from 'next/router';
import PropTypes from 'prop-types';

class App extends Component {
    static propTypes = {
        isUserSignedIn: PropTypes.func,
        isSignInPending: PropTypes.func,
        handlePendingSignIn: PropTypes.func,
        handleSignIn: PropTypes.func,
        handleSignOut: PropTypes.func,
    };

    componentDidMount = async () => {
        const { isUserSignedIn, isSignInPending, handlePendingSignIn } = this.props;
        if (!isUserSignedIn() && isSignInPending()) {
            const userData = await handlePendingSignIn();
            if (!userData.username) {
                throw new Error('This app requires a username');
            }
            Router.push('/');
        }
    };

    handleGoToProfile = () => {
        Router.push('/profile');
    }

    render() {
        const { isUserSignedIn } = this.props;
        return (
            <div className="App">
                {isUserSignedIn() ? (
                    <>
                        <button className="button" onClick={this.props.handleSignOut}>
                            <strong>Sign Out</strong>
                        </button>
                        <button className="button" onClick={this.handleGoToProfile}>
                            <strong>Profile</strong>
                        </button>
                    </>
                ) : (
                        <button className="button" onClick={this.props.handleSignIn}>
                            <strong>Sign In</strong>
                        </button>
                    )}
                {/* <Loading /> */}
            </div>
        );
    }
}

export default App;

// import React from 'react';
// import { withStyles } from '@material-ui/styles';
// import PropTypes from 'prop-types';
// import exact from 'prop-types-exact';
// import { connect } from 'react-redux';
// import { showNotification } from '../../redux/rootActions';

// // const isServer = typeof window === 'undefined';

// @connect(null, { showNotification })
// class App extends React.Component {
//     static propTypes = exact({
//         classes: PropTypes.object,
//         showNotification: PropTypes.func,
//     });

//     constructor(props) {
//         super(props);
//         this.state = {

//         };
//         this.classes = props.classes;
//     }

//     handleShowNotification = () => {
//         this.props.showNotification({ visible: true, type: 'success', message: 'Redux Working!' });
//     }

//     render() {
//         return (
//             <>
//                 <div className={this.classes.container} onClick={this.handleShowNotification}>
//                     holaaa
//                 </div>
//             </>
//         );
//     }
// }

// const styles = () => ({
//     container: {
//         display: 'flex',
//         textAlign: 'center',
//         alignItems: 'center',
//         width: '100vw',
//         height: '100vh',
//     },
// });

// export default withStyles(styles)(App);
