import React, { lazy, Suspense } from 'react';
import { useSelector } from 'react-redux';
import { Route, Redirect } from 'react-router-dom';

import Main from 'layouts/main';
import { Loader } from 'components';

function Private(props) {
  const { component, layout, ...rest } = props;
  const auth = useSelector(state => state.auth);

  if (!auth.isAuthenticated) {
    return (
      <Route
        {...rest}
        render={props => (
          <Redirect
            to={{
              pathname: '/sign-in',
              state: { from: props.location },
            }}
          />
        )}
      />
    );
  }

  const Layout = layout ? lazy(() => import(`../layouts/${layout}`)) : Main;
  const Component = lazy(() => import(`../${component}`));
  const renderLoader = Loader;

  return (
    <Route
      {...rest}
      render={props => (
        <Suspense fallback={renderLoader()}>
          <Layout>
            <Component {...props} />
          </Layout>
        </Suspense>
      )}
    />
  );
}

export default Private;
