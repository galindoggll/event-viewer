import React from 'react';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import PropTypes from 'prop-types';

function Page({ title, children, ...rest }) {
  return (
    <div {...rest}>
      <HelmetProvider>
        <Helmet>
          <title>{title} - Laravel-React Base Template</title>
        </Helmet>
      </HelmetProvider>
      {children}
    </div>
  );
}

Page.propTypes = {
  title: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
};

export default Page;
