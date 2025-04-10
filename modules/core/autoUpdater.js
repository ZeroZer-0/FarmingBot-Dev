import { logDebug, logError } from "./logger";

const URL = Java.type("java.net.URL");
const HttpURLConnection = Java.type("java.net.HttpURLConnection");
const BufferedReader = Java.type("java.io.BufferedReader");
const InputStreamReader = Java.type("java.io.InputStreamReader");
const BufferedInputStream = Java.type("java.io.BufferedInputStream");
const FileOutputStream = Java.type("java.io.FileOutputStream");
const ZipInputStream = Java.type("java.util.zip.ZipInputStream");
const File = Java.type("java.io.File");
const FileOutputStreamJava = Java.type("java.io.FileOutputStream");
const Thread = Java.type("java.lang.Thread");

const CURRENT_VERSION = "1.1.0";
const REPO = "ZeroZer-0/FarmingBot-Dev";
const DEST_FOLDER = `./config/ChatTriggers/Modules/`;
const TMP_ZIP_PATH = "./config/FarmBot/update.zip";

function doGetRequest(urlString) {
    try {
        let url = new URL(urlString);
        let connection = Java.cast(url.openConnection(), HttpURLConnection);
        connection.setRequestMethod("GET");
        connection.setRequestProperty("User-Agent", "FarmBot-Updater");
        connection.connect();

        let reader = new BufferedReader(new InputStreamReader(connection.getInputStream()));
        let response = "", line;
        while ((line = reader.readLine()) !== null) {
            response += line;
        }
        reader.close();
        connection.disconnect();
        return response;
    } catch (e) {
        logDebug("Error performing GET request: " + e);
        return "";
    }
}

function downloadZipFile(fileURL, outputPath) {
    try {
        let url = new URL(fileURL);
        let connection = Java.cast(url.openConnection(), HttpURLConnection);
        connection.setRequestMethod("GET");
        connection.setRequestProperty("User-Agent", "FarmBot-Updater");
        connection.connect();

        let input = new BufferedInputStream(connection.getInputStream());
        let output = new FileOutputStream(outputPath);

        let buffer = Java.array('byte', 1024);
        let bytesRead;

        while ((bytesRead = input.read(buffer, 0, 1024)) !== -1) {
            output.write(buffer, 0, bytesRead);
        }

        input.close();
        output.close();
        connection.disconnect();
        logDebug("Downloaded ZIP to: " + outputPath);
    } catch (e) {
        logDebug("Download ZIP error: " + e);
    }
}

function extractZip(zipPath, destFolder) {
    try {
        let zipFile = new File(zipPath);
        let input = new ZipInputStream(new BufferedInputStream(new java.io.FileInputStream(zipFile)));
        let entry;

        while ((entry = input.getNextEntry()) !== null) {
            let outPath = new File(destFolder, entry.getName());
            if (entry.isDirectory()) {
                outPath.mkdirs();
            } else {
                let parent = outPath.getParentFile();
                if (!parent.exists()) parent.mkdirs();

                let out = new FileOutputStreamJava(outPath);
                let buffer = Java.array('byte', 1024);
                let len;
                while ((len = input.read(buffer)) > 0) {
                    out.write(buffer, 0, len);
                }
                out.close();
            }
            input.closeEntry();
        }

        input.close();
        logDebug("Extraction complete.");
    } catch (e) {
        logDebug("Unzip error: " + e);
    }
}

function deleteCurrentModule() {
    let folder = new File(DEST_FOLDER + `FarmBot-Dev-${CURRENT_VERSION}/`);

    if (!folder.exists()) {
        logError("Folder does not exist: " + folder.getAbsolutePath());
        return;
    }

    if (folder.isDirectory()) {
        let files = folder.listFiles();
        if (files) {
            for (let i = 0; i < files.length; i++) {
                let file = files[i];
                if (file.isDirectory()) {
                    deleteCurrentModule(file.getAbsolutePath());
                } else {
                    file.delete();
                }
            }
        }
    }

    folder.delete();
    logDebug("Deleted current module: " + folder.getAbsolutePath());
}

export function checkForUpdate() {
    new Thread(function () {
        let releaseJson = doGetRequest("https://api.github.com/repos/" + REPO + "/releases/latest");
        if (!releaseJson) return;

        let release = JSON.parse(releaseJson);
        let latestVersion = release.tag_name;

        if (latestVersion !== CURRENT_VERSION) {
            logDebug("New version available: " + latestVersion);
            ChatLib.chat("&c[FarmBot] New version has been found and is being installed for you!");
            ChatLib.chat("&c[FarmBot] Please wait while until chat triggers is reloaded before using.");

            let assets = release.assets;
            for (let i = 0; i < assets.length; i++) {
                let asset = assets[i];
                if (asset.name.endsWith(".zip")) {
                    logDebug("Downloading: " + asset.name);
                    downloadZipFile(asset.browser_download_url, TMP_ZIP_PATH);
                    extractZip(TMP_ZIP_PATH, DEST_FOLDER);
                    deleteCurrentModule();
                    logDebug("Update applied.");
                    ChatLib.chat("&c[FarmBot] Update complete! Attempting to reload chat triggers now.");
                    ChatLib.command("ct load");
                    return;
                }
            }

            logDebug("No .zip asset found in the latest release.");
        } else {
            logDebug("You are running the latest version.");
        }
    }).start();
}