// stateManager.js - Manages bot states like start, stop, pause, and resume

import { logInfo, logWarn } from "../core/logger";
import { stopPathFollowing, stopMovement } from "../path/pathManager";
import { setCurrentPathType, getBotState, setBotState, getPreviousBotState, setGuiVisible, setReapplyPestRepellent, getCurrentArea } from "../core/globalVaribles";

/**
 * Starts the bot, initializing path-following and setting the state to "running".
 * @returns {boolean} - True if the bot was started, false otherwise.
 */
export function startBot(pathType) {
    if (getBotState() === "Running") {
        logWarn("Bot is already running.");
        return false;
    }
    if (getCurrentArea() !== "Garden") {
        logWarn("Cannot start bot outside of the Garden area.");
        return false;
    }
    setCurrentPathType(pathType);
    setBotState("Running");
    logInfo(`Bot state changed from ${getPreviousBotState()} to running.`);
    return true;
}

/**
 * Pauses the bot, halting its actions temporarily.
 * @returns {boolean} - True if the bot was paused, false otherwise.
 */
export function pauseBot() {
    if (getBotState() !== "Running") {
        logWarn("Bot is not running and cannot be paused.");
        return false;
    }
    setBotState("Paused");
    stopMovement();
    logInfo(`Bot state changed from ${getPreviousBotState()} to paused.`);
    return true;
}

/**
 * Resumes the bot from a paused state.
 * @returns {boolean} - True if the bot was resumed, false otherwise.
 */
export function resumeBot() {
    if (getBotState() !== "Paused") {
        logWarn("Bot is not paused and cannot be resumed.");
        return false;
    }
    setBotState("Running");
    logInfo(`Bot state changed from ${getPreviousBotState()} to running.`);
    return true;
}

export function toggleBot() {
    if (getBotState() === "Running") {
        pauseBot();
    } else {
        resumeBot();
    }
}

/**
 * Stops the bot completely, resetting states and halting all actions.
 * @returns {boolean} - True if the bot was stopped, false otherwise.
 */
export function stopBot() {
    if (getBotState() === "Stopped") {
        logWarn("Bot is already stopped.");
        return false;
    }
    setReapplyPestRepellent(false);
    setBotState("Stopped");
    logInfo(`Bot state changed from ${getPreviousBotState()} to stopped.`);
    stopPathFollowing();
    setGuiVisible(false);
    return true;
}


