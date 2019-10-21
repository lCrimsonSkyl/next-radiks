
import React, { Component } from 'react';
import { Person } from 'blockstack';
import { User, UserGroup, GroupInvitation } from 'radiks';

import Router from 'next/router';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/styles';

import Button from '../components/Button';
import TextField from '../components/TextField';

import EnsureLogin from '../middleware/EnsureLogin';

class MainPage extends Component {
    static propTypes = {
        classes: PropTypes.object,
        handleSignOut: PropTypes.func,
        isUserSignedIn: PropTypes.func,
        loadUserData: PropTypes.func,
    };

    constructor(props) {
        super(props);
        this.classes = props.classes;
        this.state = {
            myUserGroups: [],
        };
    }

    // createdUserGroup = '';
    // userToInvite = '';
    // userGroupName = '';
    // userGroupInvitationID = '';

    componentDidMount = async () => {
        const { loadUserData } = this.props;

        const person = new Person(loadUserData().profile);

        await User.createWithCurrentUser();

        const myUserGroups = await this.requestUserGroups();

        this.setState({ myUserGroups, person });
    };

    createUserGroup = async () => {

        const name = this.userGroupName.trim();

        if (name.length == 0) {
            return;
        }
        const group = new UserGroup({ name });
        await group.create();

        this.createdUserGroup = group;
    }

    requestUserGroups = () => {
        return UserGroup.myGroups().then((response) => {
            return response;
        });
    }

    getUserGroups = async () => {
        const myUserGroups = await this.requestUserGroups();
        console.log(myUserGroups);
    }

    inviteUserGroup = async () => {
        const invitation = await this.createdUserGroup.makeGroupMembership(this.userToInvite);
        console.log(invitation); // the ID used to later activate an invitation
    }

    acceptUserGroup = async () => {
        // console.log(this.userGroupInvitationID);
        const invitation = await GroupInvitation.findById(this.userGroupInvitationID);
        console.log(invitation);
        const isOK = await invitation.activate();
        console.log(isOK);
    }


    render() {

        return (
            <div className={this.classes.container}>
                <div>
                    <h3>Create User Group</h3>
                    <TextField onBlur={({ target }) => { this.userGroupName = target.value; }} style={{ width: 400, marginTop: 10 }} label="Insert a name" />
                    {/* <p /> */}
                    <div style={{ display: 'flex' }}>
                        <Button label="Create userGroup" onClick={this.createUserGroup} style={{ margin: '10px 5px' }} />
                        <Button label="Get userGroup" onClick={this.getUserGroups} style={{ margin: '10px 5px' }} />
                    </div>
                </div>
                <div>
                    <h3>Invite to User Group</h3>
                    <TextField onBlur={({ target }) => { this.userToInvite = target.value; }} style={{ width: 400, marginTop: 10 }} label="Insert a user name" />
                    {/* <p /> */}
                    <div style={{ display: 'flex' }}>
                        <Button label="Invite" onClick={this.inviteUserGroup} style={{ margin: '10px 5px' }} />
                    </div>
                </div>
                <div>
                    <h3>Accept User Group</h3>
                    <TextField onBlur={({ target }) => { this.userGroupInvitationID = target.value; }} style={{ width: 400, marginTop: 10 }} label="Insert an invitation ID" />
                    {/* <p /> */}
                    <div style={{ display: 'flex' }}>
                        <Button label="Accept userGroup" onClick={this.acceptUserGroup} style={{ margin: '10px 5px' }} />
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