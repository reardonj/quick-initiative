import React from "react";
import * as InitModel from "../Model/InitModel";
import { CurrentCombatState } from "../Model/CombatState";
import { withStyles, Typography } from "@material-ui/core";

const styles = (theme: any) => ({
    label: {
      margin: theme.spacing(1),
    }
  });

function CombatStatusBar(props: any) {
    const { classes } = props;

    const combatState = InitModel.useCombatStateEvents(() => {});

    if (combatState instanceof CurrentCombatState) {
        return (
            <Typography variant="body2" color="inherit" noWrap className={classes.label}>
            Round {combatState.round}
            </Typography>
        );
    } 
    
    return <></>;

}

export default withStyles(styles)(CombatStatusBar);