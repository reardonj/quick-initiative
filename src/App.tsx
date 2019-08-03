import React, { Component } from 'react';
import './App.css';
import MainView from './Components/MainView';

const drawerWidth = 240;

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
  },
  input: {
    margin: theme.spacing(1),
  },
  toolbar: theme.mixins.toolbar,
});

function App(props: any) {
  const { classes } = props;

  return (
    <div className="App">
      <MainView></MainView>
    </div>
  );
}

export default App;
