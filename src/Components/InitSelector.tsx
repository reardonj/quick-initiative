import React, { useState } from 'react';
import { PlaylistAdd } from '@material-ui/icons';
import { withStyles, IconButton, Popover, Button, GridList } from '@material-ui/core';
type MouseEvt = React.MouseEvent<HTMLElement, MouseEvent>;

const styles = (theme: any) => ({
  button: {
    margin: theme.spacing(1),
  },
  popupGrid: {
    width: 64 * 5
  },
});

const inits = Array.from({ length: 25 }, (_, i) => i - 1);

function InitSelector(props: { classes: any, disabled: boolean, onSelected: ((x: number) => void) }) {
  const { classes, disabled, onSelected } = props;

  const [anchor, setAnchor] = useState<HTMLElement | null>(null);

  const handleClickButton = (event: MouseEvt) => {
    setAnchor(event.currentTarget);
  };

  const handleMenuItemClick = (event: MouseEvt, index: number) => {
    setAnchor(null);
    onSelected(inits[index]);
  };

  const handleClose = () => {
    setAnchor(null);
  };

  return (
    <span>
      <IconButton
        onClick={handleClickButton}
        className={classes.button}
        disabled={disabled}
        aria-label="Add to Initiative"
      >
        <PlaylistAdd />
      </IconButton>
      <Popover
        id="lock-menu"
        anchorEl={anchor}
        open={Boolean(anchor)}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'center',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'center',
          horizontal: 'center',
        }}
      >
        <GridList cols={5} cellHeight={48} spacing={0} className={classes.popupGrid}>
          {inits.map((option, index) => (
            <Button size='small' onClick={event => handleMenuItemClick(event, index)}>
              {option}
            </Button>
          ))}
        </GridList>
      </Popover>
    </span>)
}

export default withStyles(styles)(InitSelector);