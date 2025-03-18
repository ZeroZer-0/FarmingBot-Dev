// interactionManager.js - Handles player interactions like block breaking and item usage

import { pressKey, releaseKey, tapKey } from "../core/keyManager";
import { logInfo, logWarn, logDebug } from "../core/logger";

/**
 * Simulates breaking a block by holding the attack key.
 * @param {number} duration - The duration to hold the attack key in milliseconds (default: 500ms).
 */
export function breakBlock(duration = 500) {
    logInfo("Breaking block...");
    tapKey("key.attack", duration);
    setTimeout(() => {
        logDebug("Released attack key after breaking block.");
    }, duration);
}

/**
 * Simulates using an item by holding the use key.
 * @param {number} duration - The duration to hold the use key in milliseconds (default: 500ms).
 */
export function useItem(duration = 500) {
    logInfo("Using item...");
    tapKey("key.use", duration);
    setTimeout(() => {
        logDebug("Released use key after using item.");
    } , duration);
}

/**
 * Switches to a specific hotbar slot.
 * @param {number} slot - The hotbar slot to switch to (1-9).
 */
export function switchHotbarSlot(slot) {
    slot = Math.floor(slot);
    if (slot < 1 || slot > 9) {
        logWarn("Invalid hotbar slot. Must be between 1 and 9.");
        return;
    }

    logInfo(`Switching to hotbar slot ${slot}...`);
    Player.setHeldItemIndex(slot - 1);
    logDebug(`Tapped key for hotbar slot ${slot}.`);
}

/**
 * Drops an item by tapping the drop key.
 */
export function dropItem() {
    const heldItem = Player.getHeldItem();
    if (!heldItem) {
        logWarn("No item in hand to drop.");
        return;
    }
    logInfo(`Dropping item: ${heldItem.getName()}...`);
    tapKey("key.drop");
    logDebug("Tapped drop key.");
}
