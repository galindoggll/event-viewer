import React from 'react';
import { ThemeProvider } from '@material-ui/styles';
import 'typeface-roboto';

import Router from './router/Router';
import theme from './theme';
import 'assets/scss/index.scss';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <Router />
    </ThemeProvider>
  );
}

export default App;
