import { getPlayerFacing } from "../player/playerManager";
import { getCheckFailed, getCurrentArea, setCheckFailed } from "../core/globalVaribles";
import { stopBot } from "../core/stateManager";
import { logDebug, logError } from "../core/logger";
import { playAlarm } from "./alarm";

let lastYaw = 0;
let lastPitch = 0;

/**
 * Checks if the player's yaw or pitch has changed unexpectedly.
 */
export function yawPitchChecker() {
    if (getCurrentArea() !== "Garden" || getCheckFailed()) return;
    const { yaw, pitch } = getPlayerFacing();

    if (Math.abs(yaw - lastYaw) > 1 || Math.abs(pitch - lastPitch) > 1) {
        logError(`Yaw or Pitch changed unexpectedly. Yaw: ${yaw}, Pitch: ${pitch}`);
        setCheckFailed(true);
        setTimeout( () => { stopBot(); }, Math.random() * 1500 + 500);
        playAlarm();
    }

    lastYaw = yaw;
    lastPitch = pitch;
}

/**
 * Resets the yaw and pitch checker to the current facing direction.
 */
export function resetYawPitchChecker() {
    const { yaw, pitch } = getPlayerFacing();
    lastYaw = yaw;
    lastPitch = pitch;
}