# Sound Files Directory

This directory contains ambient sound files for the focus mode feature.

## Expected Files:
- rain.mp3 - Gentle rain sounds
- forest.mp3 - Peaceful forest ambience
- ocean.mp3 - Calming ocean waves
- white-noise.mp3 - Steady white noise
- birds.mp3 - Morning birdsong
- stream.mp3 - Flowing water

## Audio File Requirements:
- Format: MP3
- Sample Rate: 44.1kHz
- Bit Rate: 128-192kbps
- Duration: 1-2 minutes (will be looped)
- Should loop seamlessly without noticeable breaks

## Adding Custom Sounds:
1. Add your MP3 file to this directory
2. Update the AMBIENT_SOUNDS array in `src/utils/audio.ts`
3. Follow the same naming convention: lowercase with hyphens
4. Keep file sizes reasonable (under 2MB) for quick loading
