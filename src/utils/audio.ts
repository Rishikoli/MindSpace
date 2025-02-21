interface Sound {
  name: string;
  icon: string;
  file: string;
  description: string;
}

export const AMBIENT_SOUNDS: Sound[] = [
  {
    name: 'Rain',
    icon: '🌧️',
    file: '/sounds/rain.mp3',
    description: 'Gentle rain sounds'
  },
  {
    name: 'Forest',
    icon: '🌲',
    file: '/sounds/forest.mp3',
    description: 'Peaceful forest ambience'
  },
  {
    name: 'Ocean',
    icon: '🌊',
    file: '/sounds/ocean.mp3',
    description: 'Calming ocean waves'
  },
  {
    name: 'White Noise',
    icon: '🌫️',
    file: '/sounds/white-noise.mp3',
    description: 'Steady white noise'
  },
  {
    name: 'Birds',
    icon: '🐦',
    file: '/sounds/birds.mp3',
    description: 'Morning birdsong'
  },
  {
    name: 'Stream',
    icon: '💧',
    file: '/sounds/stream.mp3',
    description: 'Flowing water'
  }
];

class AudioManager {
  private static instance: AudioManager;
  private currentAudio: HTMLAudioElement | null = null;
  private volume: number = 0.5;
  private isClient: boolean;
  private currentSound: Sound | null = null;
  private fadeInterval: NodeJS.Timeout | null = null;

  private constructor() {
    this.isClient = typeof window !== 'undefined';
  }

  static getInstance(): AudioManager {
    if (!AudioManager.instance) {
      AudioManager.instance = new AudioManager();
    }
    return AudioManager.instance;
  }

  private async loadAudio(sound: Sound): Promise<HTMLAudioElement> {
    return new Promise((resolve, reject) => {
      const audio = new Audio(sound.file);
      audio.loop = true;
      audio.volume = 0;  // Start at 0 for fade in
      
      audio.onerror = () => {
        reject(new Error(`Failed to load audio: ${sound.file}`));
      };
      
      audio.oncanplaythrough = () => {
        resolve(audio);
      };
      
      // Set source and begin loading
      audio.src = sound.file;
      audio.load();
    });
  }

  private fadeIn(audio: HTMLAudioElement, duration: number = 1000): Promise<void> {
    return new Promise((resolve) => {
      const steps = 20;
      const increment = this.volume / steps;
      let current = 0;
      
      if (this.fadeInterval) {
        clearInterval(this.fadeInterval);
      }
      
      this.fadeInterval = setInterval(() => {
        current += increment;
        if (current >= this.volume) {
          audio.volume = this.volume;
          if (this.fadeInterval) clearInterval(this.fadeInterval);
          resolve();
        } else {
          audio.volume = current;
        }
      }, duration / steps);
    });
  }

  private fadeOut(audio: HTMLAudioElement, duration: number = 1000): Promise<void> {
    return new Promise((resolve) => {
      const startVolume = audio.volume;
      const steps = 20;
      const decrement = startVolume / steps;
      let current = startVolume;
      
      if (this.fadeInterval) {
        clearInterval(this.fadeInterval);
      }
      
      this.fadeInterval = setInterval(() => {
        current -= decrement;
        if (current <= 0) {
          audio.volume = 0;
          if (this.fadeInterval) clearInterval(this.fadeInterval);
          resolve();
        } else {
          audio.volume = current;
        }
      }, duration / steps);
    });
  }

  async play(sound: Sound): Promise<void> {
    if (!this.isClient) return;

    try {
      // If the same sound is already playing, do nothing
      if (this.currentSound?.name === sound.name && this.currentAudio?.paused === false) {
        return;
      }

      // Stop current audio if playing
      if (this.currentAudio) {
        await this.fadeOut(this.currentAudio);
        this.currentAudio.pause();
        this.currentAudio = null;
      }

      // Load and play new audio
      const audio = await this.loadAudio(sound);
      this.currentAudio = audio;
      this.currentSound = sound;
      
      await audio.play();
      await this.fadeIn(audio);
    } catch (error) {
      console.error('Error playing audio:', error);
      this.currentAudio = null;
      this.currentSound = null;
    }
  }

  async stop(): Promise<void> {
    if (!this.isClient || !this.currentAudio) return;

    try {
      await this.fadeOut(this.currentAudio);
      this.currentAudio.pause();
      this.currentAudio = null;
      this.currentSound = null;
    } catch (error) {
      console.error('Error stopping audio:', error);
    }
  }

  async setVolume(volume: number): Promise<void> {
    if (!this.isClient) return;

    this.volume = Math.max(0, Math.min(1, volume));
    if (this.currentAudio) {
      await this.fadeOut(this.currentAudio, 500);
      this.currentAudio.volume = this.volume;
      await this.fadeIn(this.currentAudio, 500);
    }
  }

  isPlaying(): boolean {
    if (!this.isClient) return false;
    return this.currentAudio !== null && !this.currentAudio.paused;
  }

  getCurrentSound(): Sound | null {
    return this.currentSound;
  }
}

export const audioManager = AudioManager.getInstance();
