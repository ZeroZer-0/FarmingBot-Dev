import { logDebug, logError } from "../core/logger";
import { getCheckFailed, getCurrentArea, setCheckFailed } from "../core/globalVaribles";
import { stopBot } from "../core/stateManager";
import { playAlarm } from "./alarm";

let lastInventoryState = [];
let lastChangeTime = Date.now();

/**
 * Checks if the player's inventory has changed unexpectedly.
 */
export function inventoryChecker() {
    if (getCurrentArea() !== "Garden" || getCheckFailed()) return;

    const currentInventory = Player.getInventory().getItems();
    let inventoryUnchanged = true;

    for (let i = 0; i < currentInventory.length; i++) {
        let prevItem =  lastInventoryState[i];
        let currItem = currentInventory[i];

        // Check for null and non-null mismatches
        if ((prevItem === null && currItem !== null) || (prevItem !== null && currItem === null)) {
            inventoryUnchanged = false;
            break;
        }

        // Check item properties if both are non-null
        if (prevItem !== null && currItem !== null) {
            if (prevItem.getID() !== currItem.getID() || prevItem.getStackSize() !== currItem.getStackSize()) {
                inventoryUnchanged = false;
                break;
            }
        }
    }

    if (!inventoryUnchanged) {
        lastInventoryState = currentInventory; // Update the last known state
        lastChangeTime = Date.now(); // Reset the change timer
    } else if (Date.now() - lastChangeTime > 3000) {
        logError("Inventory has not changed in 3 seconds. Triggering bot stop.");
        setCheckFailed(true);
        setTimeout( () => { stopBot(); }, Math.random() * 1500 + 500);
        playAlarm();
    }
}

/**
 * Resets the inventory checker to the current inventory state.
 */
export function resetInventoryChecker() {
    lastInventoryState = Player.getInventory().getItems()
    lastChangeTime = Date.now();
}
