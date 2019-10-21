
import React, { Component } from 'react';
import { Person } from 'blockstack';
import { User, UserGroup, GroupMembership } from 'radiks';

import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/styles';

import Button from '../components/Button';
import TextField from '../components/TextField';

import EnsureLogin from '../middleware/EnsureLogin';

class MainPage extends Component {
    static propTypes = {
        classes: PropTypes.object,
        loadUserData: PropTypes.func,
    };

    constructor(props) {
        super(props);
        this.classes = props.classes;
        this.state = {
            myUserGroups: [],
        };
    }


    componentDidMount = async () => {
        const { loadUserData } = this.props;

        const person = new Person(loadUserData().profile);

        await User.createWithCurrentUser();

        const myUserGroups = await this.requestUserGroups();

        this.setState({ myUserGroups, person });
    };

    requestUserGroups = () => {
        return UserGroup.myGroups().then((response) => {
            return response;
        });
    }

    getUserGroups = async () => {
        const myUserGroups = await this.requestUserGroups();
        console.log(myUserGroups);
    }

    userGroupToDecrypt = '';

    decrypyUserGroup = async () => {
        // console.log(this.userGroupToDecrypt);
        // const respuesta = await GroupMembership.cacheKeys(this.userGroupToDecrypt);
        // console.log(respuesta);
        const group = await UserGroup.find(this.userGroupToDecrypt);
        console.log(group);
    }


    render() {

        return (
            <div className={this.classes.container}>
                <Button label="Get userGroup" onClick={this.getUserGroups} style={{ margin: '10px 5px' }} />
                <div>
                    <h3>Decrypt User Group</h3>
                    <TextField onBlur={({ target }) => { this.userGroupToDecrypt = target.value; }} style={{ width: 400, marginTop: 10 }} label="Insert an invitation ID" />
                    <div style={{ display: 'flex' }}>
                        <Button label="Accept userGroup" onClick={this.decrypyUserGroup} style={{ margin: '10px 5px' }} />
                    </div>
                </div>
            </div>
        );
    }
}

const styles = () => ({
    container: {
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        width: '100vw',
    },
});

export default EnsureLogin(withStyles(styles)(MainPage));