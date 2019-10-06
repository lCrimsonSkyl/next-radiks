import React, { Component } from 'react';
import {
    Person,
} from 'blockstack';
import PropTypes from 'prop-types';

const avatarFallbackImage = 'https://s3.amazonaws.com/onename/avatar-placeholder.png';

export default class Profile extends Component {
    static propTypes = {
        loadUserData: PropTypes.func,
    };

    constructor(props) {
        super(props);

        this.state = {
            person: {
                name() {
                    return 'Anonymous';
                },
                avatarUrl() {
                    return avatarFallbackImage;
                },
            },
        };
    }

    static getDerivedStateFromProps(props) {
        const { loadUserData } = props;

        return { person: new Person(loadUserData().profile) };
    }

    render() {
        const { person } = this.state;
        return (
            <div className="panel-welcome" id="section-2">
                <div className="avatar-section">
                    <img src={person.avatarUrl() ? person.avatarUrl() : avatarFallbackImage} className="img-rounded avatar" id="avatar-image" alt="" />
                </div>
                <h1>Hello, <span id="heading-name">{person.name() ? person.name() : 'Nameless Person'}</span>!</h1>
            </div>
        );
    }
}
