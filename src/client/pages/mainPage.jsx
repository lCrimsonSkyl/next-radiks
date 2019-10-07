
import React, { Component } from 'react';
import { User } from 'radiks';

import Router from 'next/router';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/styles';
import Button from '../components/Button';
import Todo from '../radiks/models/todos';
import LoadingAnimation from '../components/Loading';

class MainPage extends Component {
    static propTypes = {
        classes: PropTypes.object,
        handleSignOut: PropTypes.func,
        isUserSignedIn: PropTypes.func,
    };

    constructor(props) {
        super(props);
        this.classes = props.classes;
        this.state = {
            loading: true,
            todos: [],
        };
    }

    componentDidMount = async () => {
        const { isUserSignedIn } = this.props;

        if (!isUserSignedIn()) {
            Router.push('/');
            return;
        }

        await User.createWithCurrentUser();

        // const incompleteTodos = await Todo.fetchOwnList({ // fetch todos that this user created
        //     completed: false
        // });

        const allTodos = await Todo.fetchOwnList();

        this.setState({ loading: false, todos: allTodos });
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
                    }}
                    >
                        <tbody>
                            <tr>
                                <td>
                                    <LoadingAnimation />
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            );
        }

        console.log(this.state.todos);

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