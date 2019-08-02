import React, {  } from "react";
import * as InitModel from "../Model/InitModel";
import { CurrentCombatState } from "../Model/CombatState";
import { Button, withStyles, Typography, IconButton } from "@material-ui/core";
import { PlayArrowOutlined } from "@material-ui/icons";

const styles = (theme: any) => ({
    label: {
      margin: theme.spacing.unit,
    }
  });

function CombatStatusBar(props: any) {
    const { classes } = props;

    const combatState = InitModel.useCombatStateEvents(() => {});

    if (combatState instanceof CurrentCombatState) {
        return (
            <>
                <Typography variant="body2" color="inherit" noWrap className={classes.label}>
                Round {combatState.round}
                </Typography>
                <IconButton 
                    color="inherit"
                    onClick={() => InitModel.nextInit()}
                >
                    <PlayArrowOutlined />
                </IconButton>
            </>
        );
    } else {
        return (
            <Button 
                onClick={() => InitModel.startCombat()}
                color="inherit"
            >Start</Button>
        );
    }

}

export default withStyles(styles)(CombatStatusBar);