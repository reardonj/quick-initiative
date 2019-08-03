import React from 'react';
import CssBaseline from '@material-ui/core/CssBaseline';
import Drawer from '@material-ui/core/Drawer';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';

import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import FilteringItem from './FilteringItem';
import CombatStatusBar from './CombatStatusBar';
import InitList from './InitList';
import NextInitButton from './NextInitButton';

const drawerWidth = 300;

const styles = (theme: any) => ({
  root: {
    display: 'flex',
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    width: drawerWidth,
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
    marginLeft: drawerWidth
  },
  input: {
    margin: theme.spacing(1),
  },
  toolbar: theme.mixins.toolbar,
  grow: {
    flexGrow: 1,
  },
});

function MainView(props: any) {
  const { classes } = props;

  return (
    <div className="App">
      <CssBaseline />
      <AppBar position="fixed" className={classes.appBar}>
        <Toolbar>
          <Typography variant="h6" color="inherit" noWrap>
            Quick Initiative
          </Typography>
          <CombatStatusBar />
          <div className={classes.grow} />
        </Toolbar>
      </AppBar>
      <Drawer
        className={classes.drawer}
        variant="permanent"
        classes={{
          paper: classes.drawerPaper,
        }}
        anchor="left"
      >
        <div className={classes.toolbar} />
        <FilteringItem />
      </Drawer>
      <main className={classes.content}>
        <div className={classes.toolbar} />
        <InitList />
      </main>
      <NextInitButton />
    </div>
  );
}

export default withStyles(styles)(MainView);