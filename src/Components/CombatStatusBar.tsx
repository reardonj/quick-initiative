import React, { useState, useEffect } from "react";
import * as InitModel from "../Model/InitModel";
import { CombatState, NotStarted, CurrentCombatState } from "../Model/CombatState";
import { Button, withStyles, Typography, IconButton } from "@material-ui/core";
import { PlayArrowOutlined } from "@material-ui/icons";

const styles = (theme: any) => ({
    label: {
      margin: theme.spacing.unit,
    }
  });

function CombatStatusBar(props: any) {
    const [combatState, setCombatState] = useState(NotStarted);
    const { classes } = props;

    useEffect(() => {
        InitModel.subscribeToCombatState(setCombatState);
        // Specify how to clean up after this effect:
        return function cleanup() {
            InitModel.unsubscribeToCombatState(setCombatState);
        };
    });

    if (combatState instanceof CurrentCombatState) {
        return (
            <>
                <Typography variant="body2" color="inherit" noWrap className={classes.label}>
                Round {combatState.round}
                </Typography>
                <IconButton 
                    color="inherit"
                    onClick={event => InitModel.nextInit()}
                >
                    <PlayArrowOutlined />
                </IconButton>
            </>
        );
    } else {
        return (
            <Button 
                onClick={event => InitModel.startCombat()}
                color="inherit"
            >Start</Button>
        );
    }

}

export default withStyles(styles)(CombatStatusBar);