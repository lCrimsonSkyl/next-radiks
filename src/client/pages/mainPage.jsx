
import React, { Component } from 'react';
import { User, getConfig } from 'radiks';

import Router from 'next/router';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/styles';
import Button from '../components/Button';
import Todo from '../radiks/models/todos';
import Loading from '../components/Loading';


class MainPage extends Component {
    static propTypes = {
        classes: PropTypes.object,
        isUserSignedIn: PropTypes.func,
        isSignInPending: PropTypes.func,
        handlePendingSignIn: PropTypes.func,
        handleSignOut: PropTypes.func,
    };

    constructor(props) {
        super(props);
        this.classes = props.classes;
        this.state = {
            loading: true,
        };
    }

    componentDidMount = async () => {
        const { userSession } = getConfig();

        if (!userSession.isUserSignedIn()) {
            Router.push('/');
            return;
        }

        await User.createWithCurrentUser();

        this.setState({ loading: false });
    };

    handleGoToProfile = () => {
        Router.push('/profile');
    }

    handleCreateTodos = async () => {
        const todo = new Todo({ title: 'Use Radiks in an app' });
        await todo.save();
    }

    render() {
        const { handleSignOut } = this.props;
        const { loading } = this.state;

        if (loading) {
            return (
                <div style={{ height: '100vh' }}>
                    <table style={{
                        height: '100%',
                        width: '100%',
                        textAlign: 'center',
                        verticalAlign: 'middle',
                    }}>
                        <tbody>
                            <tr>
                                <td>
                                    <Loading />
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            );
        }

        return (
            <div className={this.classes.container}>
                <Button text="Sign Out" onClick={handleSignOut} style={{ margin: 5 }} />
                <Button text="Profile" onClick={this.handleGoToProfile} style={{ margin: 5 }} />
                <div>
                    <Button text="handleCreateTodos" onClick={this.handleCreateTodos} style={{ margin: 5 }} />
                </div>
            </div>
        );
    }
}

const styles = () => ({
    container: {
        display: 'flex',
        height: '100vh',
        width: '100vw',
    },
});

export default withStyles(styles)(MainPage);