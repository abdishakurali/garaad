declare module "use-sound" {
  type HookOptions = {
    volume?: number;
    playbackRate?: number;
    interrupt?: boolean;
    soundEnabled?: boolean;
    sprite?: Record<string, [number, number]>;
    onend?: () => void;
  };

  type PlayFunction = (
    options?: { id?: string } & Partial<HookOptions>
  ) => void;

  type ExposedData = {
    sound: {
      play: (id?: string) => void;
      stop: (id?: string) => void;
      pause: (id?: string) => void;
      duration: () => number;
    };
    stop: (id?: string) => void;
    pause: (id?: string) => void;
    duration: number | null;
  };

  export default function useSound(
    src: string,
    options?: HookOptions
  ): [PlayFunction, ExposedData];
}
