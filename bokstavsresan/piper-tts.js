/**
 * Piper TTS Integration for Bokstavsresan PWA
 * Provides text-to-speech using Piper/sherpa-onnx WebAssembly with Web Speech API fallback
 */

class PiperTTS {
  constructor() {
    this.isInitialized = false;
    this.isLoading = false;
    this.sherpaModule = null;
    this.ttsInstance = null;
    this.audioContext = null;
    this.loadProgress = 0;
    this.cache = null;
    this.cacheName = 'piper-audio-cache-v1';
    
    // Configuration
    this.config = {
      model: {
        onnx: './tts-assets/vits-piper-sv_SE-nst-medium/sv_SE-nst-medium.onnx',
        tokens: './tts-assets/vits-piper-sv_SE-nst-medium/tokens.txt',
        dataDir: './tts-assets/vits-piper-sv_SE-nst-medium/espeak-ng-data',
        json: './tts-assets/vits-piper-sv_SE-nst-medium/sv_SE-nst-medium.onnx.json'
      },
      wasm: {
        js: './tts-assets/sherpa-onnx-wasm-main-tts.js',
        binary: './tts-assets/sherpa-onnx-wasm-main-tts.wasm'
      },
      voice: {
        speakerId: 0,
        speed: 1.0,
        sampleRate: 22050
      }
    };
    
    this.initCache();
  }
  
  async initCache() {
    try {
      this.cache = await caches.open(this.cacheName);
    } catch (error) {
      console.warn('Cache not available:', error);
    }
  }
  
  /**
   * Initialize Piper TTS - loads model and WASM files
   * @param {Function} onProgress - Progress callback (progress: 0-100)
   * @returns {Promise<boolean>} Success status
   */
  async initialize(onProgress = null) {
    if (this.isInitialized) return true;
    if (this.isLoading) {
      // Wait for current loading to complete
      while (this.isLoading) {
        await new Promise(resolve => setTimeout(resolve, 100));
      }
      return this.isInitialized;
    }
    
    this.isLoading = true;
    this.loadProgress = 0;
    
    try {
      // Check if we can use WebAssembly
      if (typeof WebAssembly === 'undefined') {
        console.warn('WebAssembly not supported, falling back to Web Speech API');
        this.isLoading = false;
        return false;
      }
      
      // Initialize audio context first
      onProgress && onProgress(5, 'Initializing audio context...');
      this.audioContext = new (window.AudioContext || window.webkitAudioContext)({
        sampleRate: this.config.voice.sampleRate
      });
      
      // Load sherpa-onnx main module
      onProgress && onProgress(10, 'Loading WebAssembly module...');
      
      // Configure Module for Emscripten
      const moduleConfig = {
        locateFile: (path) => {
          if (path.endsWith('.wasm')) {
            return this.config.wasm.binary;
          }
          return this.config.wasm.js.replace('.js', '') + '/' + path;
        },
        setStatus: (status) => {
          console.log('Module status:', status);
          if (status === 'Running...') {
            this.loadProgress = 80;
            onProgress && onProgress(80, 'Module ready...');
          }
        },
        onRuntimeInitialized: () => {
          console.log('WASM Runtime initialized');
          this.loadProgress = 90;
          onProgress && onProgress(90, 'Runtime ready...');
        }
      };
      
      // Load the module
      this.sherpaModule = await this.loadWasmModule(moduleConfig);
      
      // Create TTS configuration
      onProgress && onProgress(95, 'Creating TTS instance...');
      
      const config = {
        vits: {
          model: this.config.model.onnx,
          tokens: this.config.model.tokens,
          dataDir: this.config.model.dataDir
        },
        numThreads: 1
      };
      
      // Create TTS instance using the loaded module
      if (this.sherpaModule.createOfflineTts) {
        this.ttsInstance = this.sherpaModule.createOfflineTts(config);
        
        if (this.ttsInstance) {
          this.loadProgress = 100;
          onProgress && onProgress(100, 'TTS ready!');
          this.isInitialized = true;
          this.isLoading = false;
          return true;
        } else {
          throw new Error('Failed to create TTS instance');
        }
      } else {
        throw new Error('createOfflineTts function not available');
      }
      
    } catch (error) {
      console.error('Failed to initialize Piper TTS:', error);
      this.isLoading = false;
      this.isInitialized = false;
      return false;
    }
  }
  
  /**
   * Load WASM module dynamically
   */
  async loadWasmModule(config) {
    return new Promise((resolve, reject) => {
      // Set up global Module for Emscripten
      window.Module = config;
      
      const script = document.createElement('script');
      script.src = this.config.wasm.js;
      
      script.onload = () => {
        // Wait for module to be ready
        const checkReady = () => {
          if (window.Module && window.Module.createOfflineTts) {
            resolve(window.Module);
          } else {
            setTimeout(checkReady, 100);
          }
        };
        
        setTimeout(checkReady, 100);
        
        // Timeout after 30 seconds
        setTimeout(() => {
          reject(new Error('Module load timeout'));
        }, 30000);
      };
      
      script.onerror = () => {
        reject(new Error('Failed to load WASM module'));
      };
      
      document.head.appendChild(script);
    });
  }
  
  /**
   * Generate speech from text
   * @param {string} text - Text to speak
   * @param {Object} options - Voice options
   * @returns {Promise<AudioBuffer|null>} Generated audio buffer
   */
  async generateSpeech(text, options = {}) {
    if (!this.isInitialized || !this.ttsInstance) {
      console.warn('Piper TTS not initialized');
      return null;
    }
    
    try {
      const speakerId = options.speakerId || this.config.voice.speakerId;
      const speed = options.speed || this.config.voice.speed;
      
      // Generate audio using the TTS instance
      const result = this.ttsInstance.generate(text, speakerId, speed);
      
      if (!result || !result.samples) {
        throw new Error('No audio generated');
      }
      
      // Convert to AudioBuffer
      const audioBuffer = this.audioContext.createBuffer(
        1, // mono
        result.samples.length,
        result.sampleRate || this.config.voice.sampleRate
      );
      
      const channelData = audioBuffer.getChannelData(0);
      for (let i = 0; i < result.samples.length; i++) {
        channelData[i] = result.samples[i];
      }
      
      return audioBuffer;
      
    } catch (error) {
      console.error('Speech generation failed:', error);
      return null;
    }
  }
  
  /**
   * Play audio buffer
   */
  async playAudioBuffer(audioBuffer) {
    return new Promise((resolve, reject) => {
      try {
        if (this.audioContext.state === 'suspended') {
          this.audioContext.resume();
        }
        
        const source = this.audioContext.createBufferSource();
        source.buffer = audioBuffer;
        source.connect(this.audioContext.destination);
        
        source.onended = resolve;
        source.onerror = reject;
        
        source.start(0);
        
      } catch (error) {
        reject(error);
      }
    });
  }
  
  /**
   * Convert AudioBuffer to WAV blob for caching
   */
  audioBufferToWav(buffer) {
    const length = buffer.length;
    const sampleRate = buffer.sampleRate;
    const arrayBuffer = new ArrayBuffer(44 + length * 2);
    const view = new DataView(arrayBuffer);
    
    // WAV header
    const writeString = (offset, string) => {
      for (let i = 0; i < string.length; i++) {
        view.setUint8(offset + i, string.charCodeAt(i));
      }
    };
    
    writeString(0, 'RIFF');
    view.setUint32(4, 36 + length * 2, true);
    writeString(8, 'WAVE');
    writeString(12, 'fmt ');
    view.setUint32(16, 16, true);
    view.setUint16(20, 1, true);
    view.setUint16(22, 1, true);
    view.setUint32(24, sampleRate, true);
    view.setUint32(28, sampleRate * 2, true);
    view.setUint16(32, 2, true);
    view.setUint16(34, 16, true);
    writeString(36, 'data');
    view.setUint32(40, length * 2, true);
    
    const samples = buffer.getChannelData(0);
    let offset = 44;
    for (let i = 0; i < length; i++) {
      const sample = Math.max(-1, Math.min(1, samples[i]));
      view.setInt16(offset, sample * 0x7FFF, true);
      offset += 2;
    }
    
    return new Blob([arrayBuffer], { type: 'audio/wav' });
  }
  
  /**
   * Cache audio for a text
   */
  async cacheAudio(text, audioBuffer) {
    if (!this.cache) return;
    
    try {
      const wavBlob = this.audioBufferToWav(audioBuffer);
      const response = new Response(wavBlob);
      const cacheKey = `piper-audio-${btoa(text).replace(/[^a-zA-Z0-9]/g, '')}`;
      await this.cache.put(cacheKey, response);
    } catch (error) {
      console.warn('Failed to cache audio:', error);
    }
  }
  
  /**
   * Get cached audio for text
   */
  async getCachedAudio(text) {
    if (!this.cache) return null;
    
    try {
      const cacheKey = `piper-audio-${btoa(text).replace(/[^a-zA-Z0-9]/g, '')}`;
      const response = await this.cache.match(cacheKey);
      
      if (response) {
        const arrayBuffer = await response.arrayBuffer();
        return await this.audioContext.decodeAudioData(arrayBuffer);
      }
    } catch (error) {
      console.warn('Failed to get cached audio:', error);
    }
    
    return null;
  }
  
  /**
   * Main speak method with caching and fallback
   */
  async speak(text, options = {}) {
    try {
      // First try to get cached audio
      let audioBuffer = null;
      
      if (this.audioContext) {
        audioBuffer = await this.getCachedAudio(text);
      }
      
      if (!audioBuffer && this.isInitialized) {
        // Generate new audio with Piper
        audioBuffer = await this.generateSpeech(text, options);
        
        if (audioBuffer) {
          // Cache for next time
          this.cacheAudio(text, audioBuffer);
        }
      }
      
      if (audioBuffer) {
        // Play using Piper TTS
        console.log('Using Piper TTS');
        await this.playAudioBuffer(audioBuffer);
        return;
      }
    } catch (error) {
      console.warn('Piper TTS failed:', error);
    }
    
    // Fallback to Web Speech API
    console.log('Falling back to Web Speech API');
    return this.speakWithWebSpeechAPI(text, options);
  }
  
  /**
   * Fallback to Web Speech API
   */
  async speakWithWebSpeechAPI(text, options = {}) {
    return new Promise((resolve, reject) => {
      if (!('speechSynthesis' in window)) {
        reject(new Error('Speech synthesis not supported'));
        return;
      }
      
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'sv-SE';
      utterance.rate = options.speed || 0.8;
      utterance.pitch = 1.1;
      utterance.volume = 0.9;
      
      // Try to find a Swedish voice
      const voices = speechSynthesis.getVoices();
      const swedishVoice = voices.find(voice => voice.lang.startsWith('sv'));
      if (swedishVoice) {
        utterance.voice = swedishVoice;
      }
      
      utterance.onend = resolve;
      utterance.onerror = (error) => {
        console.warn('Web Speech API error:', error);
        resolve(); // Don't reject, just resolve to continue
      };
      
      speechSynthesis.speak(utterance);
    });
  }
  
  /**
   * Stop any current speech
   */
  stop() {
    // Stop Web Speech API if active
    if ('speechSynthesis' in window) {
      speechSynthesis.cancel();
    }
    
    // Stop Web Audio API if active
    if (this.audioContext && this.audioContext.state === 'running') {
      try {
        // We can't easily stop individual sources, but suspend/resume helps
        this.audioContext.suspend().then(() => {
          setTimeout(() => {
            if (this.audioContext.state === 'suspended') {
              this.audioContext.resume();
            }
          }, 100);
        });
      } catch (error) {
        console.warn('Error stopping audio:', error);
      }
    }
  }
  
  /**
   * Get initialization status
   */
  getStatus() {
    return {
      isInitialized: this.isInitialized,
      isLoading: this.isLoading,
      loadProgress: this.loadProgress,
      hasCache: !!this.cache,
      hasWebSpeech: 'speechSynthesis' in window,
      hasWebAssembly: typeof WebAssembly !== 'undefined'
    };
  }
}

// Create global instance
window.piperTTS = new PiperTTS();