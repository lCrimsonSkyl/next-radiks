/* eslint-disable jsx-a11y/label-has-associated-control */
import React from 'react';
import PropTypes from 'prop-types';
import './card.css';
import ContactsIcon from '../../static/icons/contacts';
import ContractsIcon from '../../static/icons/contracts';

function Card({ avatar, name, userName, description, contactsCount, contractsCount }) {
    return (
        <>
            <div className="card" style={{ margin: 20 }}>
                <div className="front">
                    <div
                        className="top-pic"
                        style={{
                            backgroundImage: 'url(/static/images/network.jpg)',
                        }}
                    />
                    <div
                        className="avatar"
                        style={{
                            backgroundImage: avatar,
                        }}
                    />
                    <div className="info-box">
                        <div className="info">
                            <h3 style={{ margin: '5px auto 0px auto' }}>{name}</h3>
                            <h4 style={{ margin: '0px auto 5px auto', fontWeight: 300 }}>{userName}</h4>

                            <div id="description" style={{ textAlign: 'center', fontSize: '13px', width: '90%', margin: '0 auto' }}>
                                {description}
                            </div>

                            <div style={{ width: '90%', height: 1, backgroundColor: '#7F7F7F', margin: '8px auto' }} />

                            <div style={{ display: 'flex', justifyContent: 'space-evenly', alignItems: 'center', height: '55px' }}>
                                <div style={{ display: 'flex', flexDirection: 'column', width: 40 }}>
                                    <ContactsIcon color="#2196F3" height="40px" />
                                    <b style={{ margin: '0 auto' }}>{contactsCount}</b>
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', width: 40 }}>
                                    <ContractsIcon color="#2196F3" height="35px" style={{ margin: '2px 0px' }} />
                                    <b style={{ margin: '0 auto' }}>{contractsCount}</b>
                                </div>
                            </div>

                            <div style={{ width: 0, height: 1, margin: '8px' }} />

                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

Card.propTypes = {
    avatar: PropTypes.string,
    name: PropTypes.string,
    userName: PropTypes.string,
    description: PropTypes.string,
    contactsCount: PropTypes.number,
    contractsCount: PropTypes.number,
};

export default Card;
