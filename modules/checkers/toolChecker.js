import { getHeldItemName } from "../player/playerManager";
import { getCheckFailed, getCurrentArea, getRunEvacuationPath, setCheckFailed } from "../core/globalVaribles";
import { logDebug, logError } from "../core/logger";
import { stopBot } from "../core/stateManager";
import { playAlarm } from "../checkers/alarm";
import { stopPathFollowing } from "../path/pathManager";

let initialTool = null;

/**
 * Checks if the player's held tool has changed.
 */
export function toolChecker() {
    if (getCurrentArea() !== "Garden" || getCheckFailed()) return;
    const currentTool = ChatLib.removeFormatting(getHeldItemName());

    if (!initialTool) {
        initialTool = currentTool;
        return;
    }

    if (currentTool !== initialTool) {
        logError(`Tool mismatch detected. Started with: ${initialTool}, now holding: ${currentTool}`);
        setCheckFailed(true);
        if (getRunEvacuationPath()) {
            stopPathFollowing();            
        } else {
            setTimeout( () => { stopBot(); }, Math.random() * 1500 + 500);
        }
        playAlarm();
    }
}

/**
 * Resets the initial tool state.
 */
export function resetToolChecker() {
    initialTool = ChatLib.removeFormatting(getHeldItemName());
}
