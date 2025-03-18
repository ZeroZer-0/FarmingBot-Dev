// inventoryManager.js - Manages inventory-related actions and checks

import { tapKey } from "../core/keyManager";
import { switchHotbarSlot } from "./interactionManger";
import { logDebug, logInfo, logWarn } from "../core/logger";

/**
 * Finds an item in the player's inventory by name.
 * @param {string} itemName - The name of the item to find.
 * @returns {Object|null} - The item if found, or null if not.
 */
function findItemInInventory(itemName) {
    const inventory = Player.getInventory().getItems();
    return inventory.find((item) => item && item.getName().includes(itemName));
}

/**
 * Checks if the player is holding a specific item.
 * @param {string} itemName - The name of the item to check.
 * @returns {boolean} - True if the item is in hand, false otherwise.
 */
export function isHoldingItem(itemName) {
    const heldItem = Player.getHeldItem();
    if (!heldItem) return false;
    return heldItem.getName().includes(itemName);
}

/**
 * Switches to the first slot containing a specific item.
 * @param {string} itemName - The name of the item to switch to.
 * @returns {boolean} - True if the item was found and switched to, false otherwise.
 */
export function switchToItem(itemName) {
    const inventory = Player.getInventory().getItems();
    for (let i = 0; i <= 9; i++) {
        let item = inventory[i];
        if (item) logDebug(ChatLib.removeFormatting(item.getName()));
        if (item && ChatLib.removeFormatting(item.getName()).includes(itemName)) {
            const slot = i + 1; // Slots are 1-based for hotbar keys
            if (slot <= 9) { // Ensure the slot is within the hotbar range
                switchHotbarSlot(slot);
                logInfo(`Switched to item: ${itemName} in slot ${slot}.`);
                return true;
            }
        }
    }
    logWarn(`Item not found: ${itemName}`);
    return false;
}

/**
 * Checks if the hotbar contains a specific item.
 * @param {string} itemName - The name of the item to check.
 * @returns {boolean} - True if the item is in the hotbar, false otherwise.
 */
export function hasItemInHotbar(itemName) {
    const inventory = Player.getInventory().getItems();
    for (let i = 0; i <= 9; i++) {
        let item = inventory[i];
        if (item && ChatLib.removeFormatting(item.getName()).includes(itemName)) {
            return true;
        }
    }
    return false;
}

/**
 * Checks if the inventory contains a specific item.
 * @param {string} itemName - The name of the item to check.
 * @returns {boolean} - True if the item is in the inventory, false otherwise.
 */
export function hasItemInInventory(itemName) {
    return !!findItemInInventory(itemName);
}

/**
 * Drops all items of a specific type from the inventory.
 * @param {string} itemName - The name of the item to drop.
 */
export function dropAllItems(itemName) {
    const inventory = Player.getInventory().getItems();
    inventory.forEach((item, index) => {
        if (item && item.getName().includes(itemName)) {
            const slot = index + 1; // Slots are 1-based
            if (slot <= 9) {
                tapKey(`key.hotbar.${slot}`); // Switch to the hotbar slot
                logInfo(`Dropping item: ${item.getName()} from hotbar slot ${slot}`);
                tapKey("key.drop");
            } else {
                logWarn(`Item ${item.getName()} in inventory slot ${index + 1} cannot be dropped directly.`);
            }
        }
    });
}
