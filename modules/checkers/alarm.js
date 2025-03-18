/**
 * Plays an alarm sound
 * @returns {void}
 */
export function playAlarm(source = "levelUp.ogg") {
    let playCount = 0;
    const maxPlays = 5;

    function playNext() {
        const alarmSound = new Sound({
            source: source, // Replace with your sound file path
            priority: true,
            loop: false,
            stream: false,
            volume: 1.0,
            pitch: 1.0,
            x: Player.getX(),
            y: Player.getY(),
            z: Player.getZ(),
            attenuation: 0,
            category: "master",
        });
        if (playCount >= maxPlays) {
            return;
        }

        // Update the sound's position to the player's current location
        alarmSound.setPosition(Player.getX(), Player.getY(), Player.getZ());
        alarmSound.play(); // Play the sound
        playCount++;
        setTimeout(playNext, 1000); // Wait 500ms before playing the next sound
    }

    playNext(); // Start the sequence
}