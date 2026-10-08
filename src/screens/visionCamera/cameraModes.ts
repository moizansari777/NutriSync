/**
 * The camera screen serves three jobs:
 *  - "scan":   the Live tab, a single shutter that runs the AI food detector;
 *  - "photo":  opened from the chat, takes or picks a picture to send;
 *  - "adjust": opened from a History entry, re-measures that portion.
 */
export type CameraMode = "scan" | "photo" | "adjust";

/** `from` route param the chat passes when it opens the camera. */
export const CAMERA_FROM_CHAT = "chat";
