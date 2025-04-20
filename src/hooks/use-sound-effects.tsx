"use client";

import useSound from "use-sound";

export type SoundEvent =
  | "click"
  | "continue"
  | "skip"
  | "correct"
  | "incorrect"
  | "start-lesson"
  | "toggle-on"
  | "toggle-off"
  | "drag-released"
  | "drag-started"
  | "end-state"
  | "hint"
  | "lightweight-choice";

export function useSoundEffects() {
  const [playClick] = useSound("/sounds/click.wav");
  const [playContinue] = useSound("/sounds/continue.mp3");
  const [playSkip] = useSound("/sounds/skip.mp3");
  const [playCorrect] = useSound("/sounds/correct.mp3");
  const [playIncorrect] = useSound("/sounds/incorrect.mp3");
  const [playHint] = useSound("/sounds/hint.mp3");
  const [playStartLesson] = useSound("/sounds/start-lesson.mp3");
  const [playToggleOn] = useSound("/sounds/toggle-on.mp3");
  const [playToggleOff] = useSound("/sounds/toggle-off.mp3");
  const [playDragReleased] = useSound("/sounds/drag-released.mp3");
  const [playDragStarted] = useSound("/sounds/drag-started.mp3");
  const [playEndState] = useSound("/sounds/endstate.mp3");
  const [playLightweightChoice] = useSound("/sounds/lightweight-choice.mp3");

  const playSound = (event: SoundEvent) => {
    switch (event) {
      case "click":
        playClick();
        break;
      case "continue":
        playContinue();
        break;
      case "skip":
        playSkip();
        break;
      case "correct":
        playCorrect();
        break;
      case "incorrect":
        playIncorrect();
        break;
      case "hint":
        playHint();
        break;
      case "start-lesson":
        playStartLesson();
        break;
      case "toggle-on":
        playToggleOn();
        break;
      case "toggle-off":
        playToggleOff();
        break;
      case "drag-released":
        playDragReleased();
        break;
      case "drag-started":
        playDragStarted();
        break;
      case "end-state":
        playEndState();
        break;
      case "lightweight-choice":
        playLightweightChoice();
        break;
      default:
        console.warn("Unknown sound event:", event);
    }
  };

  return { playSound };
}

/**
 *
 * import {useSoundEffects} from "@hooks/use-sound-effects"
 *
 * const {playSound} = useSoundEffects()
 *
 * <button onClick={() => playSound("start-lesson")}>
 *   Start a lesson
 * </button>
 *
 *
 */
