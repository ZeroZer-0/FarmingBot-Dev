// warningPopup.js - Handles showing a warning popup for missing keybinds
let warningGui;

// Function to initialize the warning GUI
export function createWarningGui(message) {
    warningGui = new Gui();

    warningGui.registerDraw(() => {
        const screenWidth = Renderer.screen.getWidth();
        const screenHeight = Renderer.screen.getHeight();

        // Semi-transparent background
        Renderer.drawRect(Renderer.color(0, 0, 0, 200), 0, 0, screenWidth, screenHeight);

        // Warning message box
        Renderer.drawRect(Renderer.color(255, 50, 50, 100), screenWidth / 4, screenHeight / 3, screenWidth / 2, screenHeight / 3);

        // Warning title
        Renderer.drawString("&cWarning: Missing Keybinds", screenWidth / 2 - 100, screenHeight / 3 + 20, true);

        // Warning message
        Renderer.drawString(message, screenWidth / 2 - 150, screenHeight / 3 + 60, true);

        // Instructions
        Renderer.drawString("&ePlease set the keybinds in the Minecraft controls settings.", screenWidth / 2 - 150, screenHeight / 3 + 100, true);

        // Close button
        Renderer.drawRect(Renderer.color(255, 50, 50, 255), screenWidth / 2 - 50, screenHeight / 3 + 150, 100, 30);
        Renderer.drawString("Close", screenWidth / 2 - 30, screenHeight / 3 + 160, true);
        warningGui.registerClicked((mouseX, mouseY, button) => {
            if (mouseX >= screenWidth / 2 - 50 && mouseX <= screenWidth / 2 + 50 && mouseY >= screenHeight / 3 + 150 && mouseY <= screenHeight / 3 + 180) {
                warningGui.close();
            }
        });
    });

    return warningGui;
}