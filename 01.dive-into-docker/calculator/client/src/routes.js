import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import { OtherPage } from './OtherPage';
import { Fib } from './Fib';

export const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Switch>
        <Route exact path='/' component={Fib} />
        <Route path='/otherpage' component={OtherPage} />
      </Switch>
    </BrowserRouter>
  );
};
