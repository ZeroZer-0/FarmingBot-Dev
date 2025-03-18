import { getCheckFailed, getCurrentArea, getMinPestCount, getPestCount, setPestCount } from "../core/globalVaribles";
import { logWarn } from "../core/logger";
import { playAlarm } from "./alarm";

let timeout = false;

/**
 * Checkes the current pest count and plays an alarm if it is above the minimum threshold.
 * @param {number} min The minimum pest count.
 */
export function pestChecker() {
    if (getCurrentArea() !== "Garden" || getCheckFailed()) return;
    updatePestCount();
    if (parseInt(getPestCount()) >= getMinPestCount()) {
        if (!timeout) {
            logWarn(`Pest count is ${getPestCount()}. Playing alarm.`);
            playAlarm("softAlert.ogg");
            timeout = true;
            setTimeout(() => {
                timeout = false;
            }, 30000);
        }
    }
}

function updatePestCount() {
    let pestCountLine = TabList.getNames().find((line) => ChatLib.removeFormatting(line).startsWith(' Alive:'));
    if (pestCountLine !== undefined) {
        setPestCount(ChatLib.removeFormatting(pestCountLine).substring(7));
    }
}

/**
 * Resets the pest count, minimum pest count, and pest delay.
 */
export function resetPestChecker() {
    pestDelay = 0;
}
