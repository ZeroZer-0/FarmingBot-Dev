import { switchHotbarSlot, useItem } from "../player/interactionManger";
import { switchToItem, hasItemInHotbar } from "../player/inventoryManager";
import { getBotState, getPestRepellentTimer, getReapplyPestRepellent, getTestingMode, setPestRepellentTimer, updatePestRepellent, getCurrentArea, setReapplyPestRepellent } from "./globalVaribles";
import { logDebug, logInfo } from "./logger";
import { pauseBot, resumeBot } from "./stateManager";

let lastReapplyTime = 0;

export function checkPestRepellent() {
    updatePestRepellent();
    if (!getReapplyPestRepellent()) {
        return;
    }
    if (getBotState() !== "Running") {
        logDebug("Bot is not running.");
        return;
    }
    if (getCurrentArea() !== "Garden") {
        logDebug("Not in the Garden.");
        return;
    }
    if (ChatLib.removeFormatting(getPestRepellentTimer()) !== "None") {
        return;
    }
    if (Date.now() - lastReapplyTime < 60000) {
        logDebug("Pest repellent was recently applied.");
        return;
    }
    logDebug("Attempting to reapply pest repellent...");
    const currentSlot = parseInt(Player.getHeldItemIndex()) + 1;
    logDebug(`Current slot: ${currentSlot}`);
    if (hasItemInHotbar("Pest Repellent")) {
        pauseBot();
        setTimeout(() => {
            switchToItem("Pest Repellent");
            if (getTestingMode()) setPestRepellentTimer("MAX (59m)");
            lastReapplyTime = Date.now();
            setTimeout(() => {
                useItem();
                setTimeout(() => {
                    switchHotbarSlot(currentSlot);
                    setTimeout(() => {
                        resumeBot();
                    }, 452 + Math.random() * 300);
                }, 552 + Math.random() * 300);
            }, 543 + Math.random() * 300);
            logInfo("Pest repellent reapplied.");
        }, 200 + Math.random() * 300);
    } else {
        logDebug("Pest repellent not found in inventory turning off reaply.");
        setReapplyPestRepellent(false);
    }
}