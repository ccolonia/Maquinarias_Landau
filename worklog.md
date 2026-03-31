# Maquinarias Landau - Worklog

---
Task ID: 1
Agent: Main
Task: Fix TTS audio not working and add stop button

Work Log:
- Investigated TTS API issue - discovered SDK returns Response object with PCM audio
- PCM format not directly playable in browsers - needed conversion to WAV
- Created pcmToWav function to convert raw PCM to WAV format
- Updated /api/agent/tts/route.ts to properly convert audio
- Added stop audio button (Square icon) in chat header that appears when speaking
- Implemented fallback to Web Speech API for male Argentine voice
- Added toggle between server TTS and browser TTS modes
- Fixed audio cleanup - stops when user speaks or sends message
- Removed test files before push

Stage Summary:
- TTS now works correctly with WAV format
- Stop button added for audio control
- Browser TTS fallback provides male voice option
- Build successful, deployed to Vercel
