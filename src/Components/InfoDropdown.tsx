import React from "react";
import { withStyles } from "@material-ui/core";
import { SpeedDial, SpeedDialIcon, SpeedDialAction } from "@material-ui/lab";
import { Home, InfoOutlined, Code } from "@material-ui/icons";

const styles = (theme: any) => ({
    speedDial: {
        position: 'absolute' as 'absolute',
        top: theme.spacing(0.5),
        right: theme.spacing(0.5),
      }
});

const actions = [
    { icon: <Home />, 
      name: 'To www.jmreardon.com', 
      url: "https://www.jmreardon.com/projects/quick_initiative/"
    },
    { icon: <Code />, 
      name: 'Get the Code', 
      url: "https://github.com/reardonj/quick-initiative"
    }
  ];

function InfoDropdown(props: any) {
    const { classes } = props;
    const [open, setOpen] = React.useState(false);

    const handleClick = () => setOpen(prevOpen => !prevOpen);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    return (
        <div className={classes.root}>
        <SpeedDial
            ariaLabel="SpeedDial openIcon example"
            className={classes.speedDial}
            icon={<SpeedDialIcon icon={<InfoOutlined />} openIcon={<InfoOutlined />} />}
            onBlur={handleClose}
            onClick={handleClick}
            onClose={handleClose}
            onFocus={handleOpen}
            onMouseEnter={handleOpen}
            onMouseLeave={handleClose}
            open={open}
            direction='down'
        >
            {actions.map(action => (
            <SpeedDialAction
                key={action.name}
                icon={action.icon}
                tooltipTitle={action.name}
                onClick={() => {
                    handleClick();
                    window.open(action.url, '_blank');
                }}
            />
            ))}
        </SpeedDial>
        </div>
    );
}

export default withStyles(styles)(InfoDropdown);