import React from 'react';
import { Route, Redirect } from 'react-router-dom';

const ProtectedRoute = ({ component: Component, allowedRoles, ...rest }) => {
    const user = localStorage.getItem('user'); // or fetch from context/state

    return (
        <Route
            {...rest}
            render={(props) =>
                allowedRoles.includes(user.type) ? (
                    <Component {...props} />
                ) : (
                    <Redirect to="/not-authorized" />
                )
            }
        />
    );
};

export default ProtectedRoute;
