import React from 'react';
import TopBarProgress from 'react-topbar-progress-indicator';

TopBarProgress.config({
  barColors: {
    '0': '#FF9800',
    '1.0': '#FF9800',
  },
  shadowBlur: 5,
});

function Loader() {
  return <TopBarProgress />;
}

export default Loader;
