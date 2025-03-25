// logger.js - Centralized logging utility

import { addLogMessage, getCurrentLogLevel, getLogMessages, setLogLevel, shiftLogMessages } from "./globalVaribles";

const LOG_LEVELS = {
    CHAT: 0,
    ERROR: 1,
    WARN: 2,
    INFO: 3,
    DEBUG: 4,
};

setLogLevel("WARN"); // Set the default log level
const logFileLocation = "./config/FarmBot/bot.log"; // Location of the log file
FileLib.write(logFileLocation, ""); // Create the log file if it doesn't exist

/**
 * Logs a message if the specified level is >= currentLogLevel.
 * @param {number} level - The log level (0: ERROR, 1: WARN, 2: INFO, 3: DEBUG).
 * @param {string} message - The message to log.
 */
function log(level, message) {
    if (level == LOG_LEVELS.DEBUG && LOG_LEVELS[getCurrentLogLevel()] != LOG_LEVELS.DEBUG) return; // Don't log debug messages if not in debug mode
    const prefix = Object.keys(LOG_LEVELS).find((key) => LOG_LEVELS[key] === level);
    const logEntry = `${getFormattedTimestamp()} [${prefix}] ${message}`;
    FileLib.append(logFileLocation, logEntry + "\n");
    if (level <= LOG_LEVELS[getCurrentLogLevel()]) {
        addLogMessage(logEntry);
        if (getLogMessages().length > 100) {
            shiftLogMessages();
        }
    }
}

/**
 * Logs an error message.
 * @param {string} message - The error message to log.
 */
export function logError(message) {
    log(LOG_LEVELS.ERROR, message);
}

/**
 * Logs a warning message.
 * @param {string} message - The warning message to log.
 */
export function logWarn(message) {
    log(LOG_LEVELS.WARN, message);
}

/**
 * Logs an informational message.
 * @param {string} message - The informational message to log.
 */
export function logInfo(message) {
    log(LOG_LEVELS.INFO, message);
}

/**
 * Logs a debug message.
 * @param {string} message - The debug message to log.
 */
export function logDebug(message) {
    log(LOG_LEVELS.DEBUG, message);
}

/**
 * Logs a chat message.
 * @param {string} message - The chat message to log.
 */
export function logChat(message) {
    log(LOG_LEVELS.CHAT, message);
}

export function getFormattedTimestamp() {
    const now = new Date();

    const day = String(now.getDate()).padStart(2, '0'); // Day with leading zero
    const month = String(now.getMonth() + 1).padStart(2, '0'); // Month (0-based, so +1) with leading zero
    const year = now.getFullYear(); // Full year (e.g., 2023)

    const hours = String(now.getHours()).padStart(2, '0'); // Hours in 24-hour format
    const minutes = String(now.getMinutes()).padStart(2, '0'); // Minutes with leading zero
    const seconds = String(now.getSeconds()).padStart(2, '0'); // Seconds with leading zero

    return `[${day}/${month}/${year} - ${hours}:${minutes}:${seconds}]`;
}

