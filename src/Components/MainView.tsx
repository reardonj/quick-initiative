import React from 'react';
import CssBaseline from '@material-ui/core/CssBaseline';
import Drawer from '@material-ui/core/Drawer';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import { IconButton, Hidden, Divider } from '@material-ui/core';
import { Menu } from '@material-ui/icons';

import FilteringPanel from './FilteringPanel';
import CombatStatusBar from './CombatStatusBar';
import InitList from './InitList';
import NextInitButton from './NextInitButton';
import InfoDropdown from './InfoDropdown';

const drawerWidth = 300;

const styles = (theme: any) => ({
  root: {
    display: 'flex',
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
  },
  drawer: {
    [theme.breakpoints.up('md')]: {
      width: drawerWidth,
      flexShrink: 0,
    },
  },
  drawerPaper: {
    width: drawerWidth,
  },
  menuButton: {
    marginRight: theme.spacing(2),
    [theme.breakpoints.up('md')]: {
      display: 'none',
    },
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(2),
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
  const [mobileOpen, setMobileOpen] = React.useState(false);
  
  function handleDrawerToggle() {
    setMobileOpen(!mobileOpen);
  }

  const drawer = <>
      <div className={classes.toolbar} />
      <Divider />
      <FilteringPanel /> 
    </>

  return (
    <div className={classes.root}>
      <CssBaseline />
      <AppBar position="fixed" className={classes.appBar}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            className={classes.menuButton}
          >
            <Menu />
          </IconButton>
          <Typography variant="h6" color="inherit" noWrap>
            Quick Initiative
          </Typography>
          <CombatStatusBar />
          <div className={classes.grow} />
          <InfoDropdown />
        </Toolbar>
      </AppBar>
      <nav className={classes.drawer} aria-label="initiative entry history">
        <Hidden mdUp implementation="css">
          <Drawer
            variant="temporary"
            open={mobileOpen}
            onClose={handleDrawerToggle}
            classes={{
              paper: classes.drawerPaper,
            }}
            ModalProps={{
              keepMounted: true, // Better open performance on mobile.
            }}
          >
            {drawer}
          </Drawer>
        </Hidden>
        <Hidden smDown implementation="css">
          <Drawer
            classes={{
              paper: classes.drawerPaper,
            }}
            variant="permanent"
            open
          >
            {drawer}
          </Drawer>
        </Hidden>
      </nav>
      <main className={classes.content}>
        <div className={classes.toolbar} />
        <InitList />
      </main>
      <NextInitButton />
    </div>
  );
}

export default withStyles(styles)(MainView);