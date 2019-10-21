import React from 'react';
import Router from 'next/router';

export default function ensureLogin(WrappedComponent) {
    return function HOC(props) {
        if (!props.isUserSignedIn) {
            console.log('a tu casa');
            Router.push('/');
            return <></>;
        }
        return <WrappedComponent {...props} />;
    };
}