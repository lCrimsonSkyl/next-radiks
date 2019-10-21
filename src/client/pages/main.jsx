import React, { Component } from 'react';
import {
    Person,
} from 'blockstack';
import { withStyles } from '@material-ui/styles';
import PropTypes from 'prop-types';
import Card from '../components/Card';
import CreatePost from '../components/CreatePost';
import EnsureLogin from '../middleware/EnsureLogin';

class Profile extends Component {
    static propTypes = {
        loadUserData: PropTypes.func,
        classes: PropTypes.object,
    };

    constructor(props) {
        super(props);

        this.state = {
            person: {
                name() {
                    return 'Anonymous';
                },
                avatarUrl() {
                    return '/static/images/placeholder.svg';
                },
                description() {
                    return '';
                },
                userName: '',
            },
        };
    }

    static getDerivedStateFromProps(props) {
        const { loadUserData } = props;
        const userData = loadUserData();
        const person = new Person(userData.profile);
        person.userName = userData.username;

        return { person };
    }

    render() {
        // Card data
        const { person } = this.state;
        const name = person.name() || 'Nameless Person';
        const { userName } = person;
        const avatarUrl = person.avatarUrl();
        const avatar = avatarUrl ? `url(${avatarUrl})` : 'url(/static/images/placeholder.svg)';
        const description = person.description() || '';
        const contactsCount = 20;
        const contractsCount = 10;

        // styles 
        const { classes } = this.props;

        return (
            <div className={classes.container} style={{ flexDirection: 'row' }}>
                {/* Left */}
                <section>
                    <Card
                        name={name}
                        userName={userName}
                        avatar={avatar}
                        description={description}
                        contactsCount={contactsCount}
                        contractsCount={contractsCount}
                    />
                </section>
                {/* Middle */}
                <section>
                    <CreatePost />
                    {/* <div>whiut</div> */}
                </section>
                {/* Right */}
                <section>
                    {/* <div>holaa</div> */}
                </section>
            </div>
        );
    }
}

const styles = () => ({
    container: {
        display: 'flex',
        flexDirection: 'row',
        height: '100vh',
        width: '100vw',
        // select left and right section tags
        '& section:nth-child(1)': {
            display: 'flex',
            flexDirection: 'column',
            // justifyContent: 'flex-end',
            alignItems: 'flex-end',
            width: '25%',
            height: '100vh',
        },
        // select middle section tag
        '& section:nth-child(2)': {
            display: 'flex',
            flexDirection: 'column',
            // justifyContent: 'flex-start',
            outline: '1px dashed black',
            alignItems: 'center',
            width: '50%',
            height: '100vh',
            padding: '20px 20px 0px 20px',
        },
        '& section:nth-child(3)': {
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            width: '25%',
            height: '100vh',

        },
    },
});

export default withStyles(styles)(EnsureLogin(Profile));