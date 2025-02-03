// Hotspots functionality
document.querySelectorAll('.hotspot').forEach(hotspot => {
    hotspot.addEventListener('click', function() {
        const info = this.getAttribute('data-info');
        alert(info);
    });
});

// Image map functionality
document.querySelectorAll('area').forEach(area => {
    area.addEventListener('click', function(e) {
        e.preventDefault();
        const info = this.getAttribute('data-info');
        alert(info);
    });
});

// Smooth scrolling for navigation
document.querySelectorAll('nav a').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const section = document.querySelector(this.getAttribute('href'));
        section.scrollIntoView({ behavior: 'smooth' });
    });
});

// Parallax Effects Manager
class ParallaxManager {
    constructor() {
        this.container = document.querySelector('.parallax-container');
        this.layers = document.querySelectorAll('.parallax-layer');
        this.isMobile = 'DeviceOrientationEvent' in window && 'ontouchstart' in window;
        
        this.setupEventListeners();
    }

    setupEventListeners() {
        if (this.isMobile) {
            // Device orientation for mobile
            window.addEventListener('deviceorientation', (e) => this.handleTilt(e));
        } else {
            // Mouse movement for desktop
            this.container.addEventListener('mousemove', (e) => this.handleHover(e));
        }
    }

    handleHover(e) {
        const { clientX, clientY } = e;
        const xMiddle = window.innerWidth / 2;
        const yMiddle = window.innerHeight / 2;
        
        const xPos = (clientX - xMiddle) / xMiddle;
        const yPos = (clientY - yMiddle) / yMiddle;
        
        this.layers.forEach((layer, index) => {
            let movement;
            if (layer.classList.contains('rocks')) {
                movement = (this.layers.length - index) * 6;
            } else if (layer.classList.contains('cactus')) {
                movement = (this.layers.length - index) * 8;
            } else if (layer.classList.contains('car-container') || layer.classList.contains('ground')) {
                movement = (this.layers.length - index) * 3;  // Ground moves with car
            } else {
                movement = (this.layers.length - index) * 5;
            }
            
            const xMove = xPos * movement;
            const yMove = yPos * movement;
            layer.style.transform = `translate(calc(-50% + ${xMove}px), calc(-50% + ${yMove}px))`;
        });
    }

    handleTilt(e) {
        const tiltX = e.beta || 0;  // -90 to 90
        const tiltY = e.gamma || 0; // -90 to 90
        
        this.layers.forEach((layer, index) => {
            const movement = (this.layers.length - index) * 0.5;
            const xMove = (tiltY / 90) * movement * 10;
            const yMove = (tiltX / 90) * movement * 10;
            layer.style.transform = `translate(calc(-50% + ${xMove}px), calc(-50% + ${yMove}px))`;
        });
    }

    resetLayers() {
        this.layers.forEach(layer => {
            layer.style.transform = 'translate(-50%, -50%)';
            layer.style.animation = 'none';
        });
        
        if (this.container.dataset.currentEffect === 'auto') {
            this.layers.forEach((layer, index) => {
                layer.style.animation = `float ${30 + index * 5}s infinite ease-in-out`;
            });
        }
    }

    addAnimatedElements() {
        // Add tumbleweeds
        setInterval(() => {
            const tumbleweed = document.createElement('div');
            tumbleweed.className = 'tumbleweed';
            tumbleweed.style.left = '-50px';
            tumbleweed.style.bottom = '50px';
            this.container.appendChild(tumbleweed);

            setTimeout(() => {
                tumbleweed.remove();
            }, 8000);
        }, 10000);
    }
}

// Initialize parallax effects
document.addEventListener('DOMContentLoaded', () => {
    new ParallaxManager();
});

// Add this to your JavaScript
class FrameAnimator {
    constructor(element) {
        this.element = element;
        this.currentFrame = 0;
        this.isAnimating = false;
        this.frames = [
            'frame1.png',
            'frame2.png',
            'frame3.png',
            // ... add all your frames
        ];
        this.setupEventListeners();
    }

    setupEventListeners() {
        this.element.addEventListener('click', () => this.playAnimation());
    }

    playAnimation() {
        if (this.isAnimating) return;
        
        this.isAnimating = true;
        this.currentFrame = 0;
        this.animateNextFrame();
    }

    animateNextFrame() {
        if (this.currentFrame >= this.frames.length) {
            this.isAnimating = false;
            return;
        }

        this.element.style.backgroundImage = `url('../images/animation/${this.frames[this.currentFrame]}')`;
        this.currentFrame++;

        setTimeout(() => this.animateNextFrame(), 83); // ~12 frames per second
    }
}

// Initialize sprite animation
document.addEventListener('DOMContentLoaded', () => {
    const animatedElements = document.querySelectorAll('.animated-element');
    animatedElements.forEach(element => new FrameAnimator(element));
});

class DoorAnimator {
    constructor(element) {
        this.element = element;
        this.currentFrame = 1;
        this.isAnimating = false;
        this.totalFrames = 6;  // Number of frames in your animation
        this.setupEventListeners();
    }

    setupEventListeners() {
        this.element.addEventListener('click', () => this.playAnimation());
    }

    playAnimation() {
        if (this.isAnimating) return;
        
        this.isAnimating = true;
        this.currentFrame = 1;
        this.animateNextFrame();
    }

    animateNextFrame() {
        if (this.currentFrame > this.totalFrames) {
            // Play animation backwards
            this.playReverse();
            return;
        }

        this.element.style.backgroundImage = `url('../images/animation/door-${this.currentFrame}.png')`;
        this.currentFrame++;

        setTimeout(() => this.animateNextFrame(), 100); // Adjust timing as needed
    }

    playReverse() {
        const reverseAnimation = setInterval(() => {
            this.currentFrame--;
            
            if (this.currentFrame < 1) {
                clearInterval(reverseAnimation);
                this.isAnimating = false;
                return;
            }

            this.element.style.backgroundImage = `url('../images/animation/door-${this.currentFrame}.png')`;
        }, 100); // Adjust timing as needed
    }
}

// Initialize door animation
document.addEventListener('DOMContentLoaded', () => {
    const door = document.querySelector('.animated-door');
    if (door) new DoorAnimator(door);
});

class ShopAnimator {
    constructor(element) {
        this.element = element;
        this.currentFrame = 1;
        this.isAnimating = false;
        this.totalFrames = 6;
        this.insideView = document.querySelector('.inside-view');
        
        // Make sure the element is clickable
        this.element.style.pointerEvents = 'all';
        this.setupEventListeners();
    }

    setupEventListeners() {
        // Add click event listener to the shop
        this.element.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            console.log('Shop clicked'); // Debug log
            this.playAnimation();
            
            // Wait for animation to complete before showing inside
            setTimeout(() => {
                this.showInside();
            }, this.totalFrames * 100 + 200);
        });
    }

    showInside() {
        console.log('Showing inside view'); // Debug log
        this.insideView.classList.add('visible');
    }

    playAnimation() {
        if (this.isAnimating) return;
        console.log('Playing animation'); // Debug log
        
        this.isAnimating = true;
        this.currentFrame = 1;
        this.animateNextFrame();
    }

    animateNextFrame() {
        if (this.currentFrame > this.totalFrames) {
            this.resetAnimation();
            return;
        }

        console.log(`Animating frame ${this.currentFrame}`); // Debug log
        this.element.style.backgroundImage = `url('images/animation/shop-${this.currentFrame}.png')`;
        this.currentFrame++;
        setTimeout(() => this.animateNextFrame(), 100);
    }

    resetAnimation() {
        this.currentFrame = 1;
        this.element.style.backgroundImage = `url('images/animation/shop-1.png')`;
        this.isAnimating = false;
    }
}

// Initialize shop animation
document.addEventListener('DOMContentLoaded', () => {
    const shop = document.querySelector('.animated-shop');
    if (shop) {
        console.log('Shop element found, initializing animator'); // Debug log
        new ShopAnimator(shop);
    } else {
        console.log('Shop element not found'); // Debug log
    }
});

// Update audio control functionality
document.addEventListener('DOMContentLoaded', () => {
    const audio = document.getElementById('narration');
    const music = document.getElementById('musicTrack');
    const playPauseBtn = document.getElementById('playPause');
    const musicPlayPauseBtn = document.getElementById('musicPlayPause');
    const container = document.querySelector('.parallax-container');
    const sky = document.querySelector('.sky');
    const mountains = document.querySelector('.mountains');
    let hasInteracted = false;

    // Add pre-interaction class to pause animations
    container.classList.add('pre-interaction');
    sky.classList.add('pre-interaction');
    mountains.classList.add('pre-interaction');

    // Setup audio controls
    const setupAudioButton = (audioElement, button) => {
        const playIcon = button.querySelector('.play-icon');
        const pauseIcon = button.querySelector('.pause-icon');
        const isNarration = audioElement.id === 'narration';
        const defaultVolume = isNarration ? 0.5 : 1.0;  // Set narration to half volume

        const updateButtonState = (isPlaying) => {
            playIcon.style.display = isPlaying ? 'none' : 'block';
            pauseIcon.style.display = isPlaying ? 'block' : 'none';
            button.classList.toggle('playing', isPlaying);
        };

        button.addEventListener('click', () => {
            if (audioElement.paused) {
                audioElement.volume = defaultVolume;  // Maintain volume setting
                audioElement.play();
                updateButtonState(true);
            } else {
                audioElement.pause();
                updateButtonState(false);
            }
        });

        return updateButtonState;
    };

    const updateVoiceState = setupAudioButton(audio, playPauseBtn);
    const updateMusicState = setupAudioButton(music, musicPlayPauseBtn);

    // Add welcome image prompt
    const prompt = document.createElement('div');
    prompt.className = 'click-prompt';
    const welcomeImg = document.createElement('img');
    welcomeImg.src = 'images/welcome.png';
    welcomeImg.alt = 'Click to begin';
    prompt.appendChild(welcomeImg);
    document.body.appendChild(prompt);

    // Add this after setting pre-interaction class
    const shopGlow = document.querySelector('.shop-glow');
    shopGlow.classList.add('pre-interaction');

    // Start everything after first interaction
    const startExperience = () => {
        if (!hasInteracted) {
            hasInteracted = true;
            
            // Start outside ambient sounds with smoother fade in
            const outsideSounds = document.getElementById('outsideSounds');
            if (outsideSounds) {
                outsideSounds.volume = 0;
                outsideSounds.play();
                let volume = 0;
                const fadeIn = setInterval(() => {
                    volume = Math.min(volume + 0.01, 0.08); // Smaller steps for smoother fade
                    outsideSounds.volume = volume;
                    if (volume >= 0.08) clearInterval(fadeIn);
                }, 100); // More frequent updates
            }

            // Add narration end listener with smoother transition
            if (audio && outsideSounds) {
                audio.addEventListener('ended', () => {
                    // Fade outside sounds up smoothly
                    let volume = outsideSounds.volume;
                    const fadeUp = setInterval(() => {
                        volume = Math.min(volume + 0.02, 0.4); // Smaller steps
                        outsideSounds.volume = volume;
                        if (volume >= 0.4) clearInterval(fadeUp);
                    }, 100);
                });
            }

            // Start background music
            if (music) {
                music.volume = 0;
                music.play();
                let musicVolume = 0;
                const fadeMusicIn = setInterval(() => {
                    musicVolume = Math.min(musicVolume + 0.05, 0.3);
                    music.volume = musicVolume;
                    if (musicVolume >= 0.3) {
                        clearInterval(fadeMusicIn);
                        updateMusicState(true);
                    }
                }, 200);
            }

            // Remove pre-interaction classes to start animations
            container.classList.remove('pre-interaction');
            sky.classList.remove('pre-interaction');
            mountains.classList.remove('pre-interaction');
            
            // Fade out shop glow
            shopGlow.style.transition = 'opacity 4s ease-out';
            shopGlow.style.opacity = '0';
            
            // Fade out and remove welcome image
            prompt.style.opacity = '0';
            setTimeout(() => {
                prompt.remove();
                // Make sure we find and activate the shop clickable area
                const shopClickable = document.querySelector('.shop-clickable');
                if (shopClickable) {
                    console.log('Activating shop clickable area');
                    shopClickable.classList.add('active');
                } else {
                    console.error('Shop clickable area not found');
                }
            }, 1000);
            
            // Start narration after a delay with lower volume
            setTimeout(() => {
                if (audio) {
                    audio.volume = 0.5;  // Set narration to half volume
                    audio.play()
                        .then(() => {
                            updateVoiceState(true);
                        })
                        .catch(e => {
                            console.log('Playback failed:', e);
                            updateVoiceState(false);
                        });
                }
            }, 2000);
        }
    };

    // Only need one event listener for the prompt
    prompt.addEventListener('click', startExperience);
});

// Update dust particle functionality
const createDustParticles = () => {
    const container = document.querySelector('.dust-container');
    if (!container) return;

    const createParticle = () => {
        const particle = document.createElement('div');
        particle.className = 'dust-particle';
        
        // Size variation
        const size = Math.random() * 2 + 2;
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        
        // Position - favor edges over center
        let xPos;
        if (Math.random() > 0.5) {
            // Place on the sides
            xPos = Math.random() > 0.5 ? 
                Math.random() * 30 : // Left 30%
                70 + Math.random() * 30; // Right 30%
        } else {
            // Sometimes place in middle but less often
            xPos = 30 + Math.random() * 40;
        }
        
        particle.style.left = `${xPos}%`;
        particle.style.top = `${Math.random() * 100}%`;
        
        // Movement
        const duration = Math.random() * 15 + 15;
        const travelDistance = Math.random() * 200 + 100;
        const travelX = (Math.random() - 0.5) * travelDistance;
        const travelY = (Math.random() - 0.5) * travelDistance;
        const opacity = Math.random() * 0.4 + 0.2;

        particle.style.setProperty('--duration', `${duration}s`);
        particle.style.setProperty('--travel-y', `${travelY}px`);
        particle.style.setProperty('--travel-x', `${travelX}px`);
        particle.style.setProperty('--opacity', opacity);

        container.appendChild(particle);

        setTimeout(() => {
            particle.remove();
        }, duration * 1000);
    };

    // Create initial particles
    for (let i = 0; i < 150; i++) {
        createParticle();
    }

    // Keep creating particles
    setInterval(() => {
        if (container.children.length < 150) {
            createParticle();
        }
    }, 200);
};

// Update inside view interaction functionality
const setupInsideInteraction = () => {
    const insideView = document.querySelector('.inside-view');
    const mainImage = insideView.querySelector('.inside-main');
    let panX = 0;
    let scale = 1.1;
    let isAutoScrolling = false;

    const updateTransform = () => {
        const transform = `translateX(${panX}px) scale(${scale})`;
        mainImage.style.transform = transform;
    };

    // Add mouse wheel zoom
    insideView.addEventListener('wheel', (e) => {
        if (isAutoScrolling) return; // Prevent zoom during auto-scroll
        e.preventDefault();
        const delta = e.deltaY * -0.001;
        scale = Math.min(Math.max(1.1, scale + delta), 1.5);
        updateTransform();
    });

    // Add initial sweep animation
    const startSweepAnimation = () => {
        isAutoScrolling = true;
        const maxPan = -(mainImage.offsetWidth - insideView.offsetWidth);
        panX = maxPan; // Start from the left side
        updateTransform();
        
        // Wait a moment before starting the sweep
        setTimeout(() => {
            // Animate the sweep
            const sweepInterval = setInterval(() => {
                panX = Math.min(panX + 8, 0); // Move right (reduced speed)
                updateTransform();

                if (panX >= 0) {
                    clearInterval(sweepInterval);
                    setTimeout(() => {
                        isAutoScrolling = false; // Enable user interaction after a delay
                    }, 500); // Half second delay after sweep completes
                }
            }, 30);
        }, 1000); // One second delay before starting sweep
    };

    const onMouseMove = (e) => {
        if (isAutoScrolling) return; // Don't allow manual panning during auto-scroll

        const rect = insideView.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const width = rect.width;

        if (mouseX < width * 0.3) {
            // Move right
            panX = Math.min(panX + 15, 0);
        } else if (mouseX > width * 0.7) {
            // Move left
            const maxPan = -(mainImage.offsetWidth - width);
            panX = Math.max(panX - 15, maxPan);
        }

        updateTransform();
    };

    // Start sweep when the view becomes visible
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.target.classList.contains('visible')) {
                startSweepAnimation();
            }
        });
    });

    observer.observe(insideView, { attributes: true });
    insideView.addEventListener('mousemove', onMouseMove);
};

// Update the shop click handler to initialize inside interaction
document.addEventListener('DOMContentLoaded', () => {
    const shopClickable = document.querySelector('.shop-clickable');
    const insideView = document.querySelector('.inside-view');
    const backButton = document.querySelector('.back-button');
    const insideSounds = document.getElementById('insideSounds');
    const outsideSounds = document.getElementById('outsideSounds');

    // Initialize inside view interaction
    setupInsideInteraction();

    // Set up sounds
    if (insideSounds) insideSounds.volume = 0;
    if (outsideSounds) outsideSounds.volume = 0;

    if (shopClickable && insideView && backButton) {
        shopClickable.addEventListener('click', () => {
            if (shopClickable.classList.contains('active')) {
                console.log('Shop clicked');
                insideView.classList.add('visible');
                backButton.classList.add('visible');
                startLightFlicker();
                createDustParticles();

                // Fade out outside sounds more smoothly
                if (outsideSounds && insideSounds) {
                    let outsideVolume = outsideSounds.volume;
                    const fadeOutOutside = setInterval(() => {
                        outsideVolume = Math.max(outsideVolume - 0.02, 0); // Smaller steps
                        outsideSounds.volume = outsideVolume;
                        if (outsideVolume <= 0) {
                            clearInterval(fadeOutOutside);
                            outsideSounds.pause();
                        }
                    }, 50); // More frequent updates

                    // Fade in inside
                    insideSounds.play();
                    let insideVolume = 0;
                    const fadeInInside = setInterval(() => {
                        insideVolume = Math.min(insideVolume + 0.1, 0.6);
                        insideSounds.volume = insideVolume;
                        if (insideVolume >= 0.6) clearInterval(fadeInInside);
                    }, 200);
                }
            }
        });

        backButton.addEventListener('click', () => {
            insideView.classList.remove('visible');
            backButton.classList.remove('visible');

            // Fade out inside sounds and fade in outside sounds more smoothly
            if (outsideSounds && insideSounds) {
                // Fade out inside
                let insideVolume = insideSounds.volume;
                const fadeOutInside = setInterval(() => {
                    insideVolume = Math.max(insideVolume - 0.1, 0);
                    insideSounds.volume = insideVolume;
                    if (insideVolume <= 0) {
                        clearInterval(fadeOutInside);
                        insideSounds.pause();
                    }
                }, 100);

                // Fade in outside
                outsideSounds.play();
                let outsideVolume = 0;
                const fadeInOutside = setInterval(() => {
                    outsideVolume = Math.min(outsideVolume + 0.02, 0.4); // Smaller steps
                    outsideSounds.volume = outsideVolume;
                    if (outsideVolume >= 0.4) clearInterval(fadeInOutside);
                }, 50); // More frequent updates
            }
        });
    }
});

// Update track list functionality with master volume control
const setupTrackList = () => {
    const trackListMenu = document.querySelector('.track-list-menu');
    const introTrack = document.getElementById('musicTrack');
    const themeTrack = document.getElementById('themeTrack');
    const masterVolume = document.getElementById('masterVolume');
    const volumeValue = document.querySelector('.volume-value');
    const tracks = {
        intro: introTrack,
        theme: themeTrack
    };
    let currentTrack = null;
    let baseVolumes = {
        narration: 0.5,
        music: 0.3,
        outside: 0.4,
        inside: 0.6
    };

    // Master volume control
    masterVolume.addEventListener('input', (e) => {
        const volume = e.target.value / 100;
        volumeValue.textContent = `${Math.round(volume * 100)}%`;

        // Update all audio elements
        document.querySelectorAll('audio').forEach(audio => {
            const type = audio.id.includes('narration') ? 'narration' :
                        audio.id.includes('music') || audio.id.includes('theme') ? 'music' :
                        audio.id.includes('inside') ? 'inside' : 'outside';
            
            if (!audio.paused) {
                audio.volume = baseVolumes[type] * volume;
            }
        });
    });

    // Show menu after narration ends
    const narration = document.getElementById('narration');
    narration.addEventListener('ended', () => {
        trackListMenu.classList.add('visible');
    });

    // Handle track switching
    const switchTrack = async (newTrack, button) => {
        if (currentTrack === newTrack) return;

        // Reset all buttons
        document.querySelectorAll('.track-btn').forEach(btn => {
            btn.classList.remove('playing');
        });

        // Fade out background music if it's playing
        const backgroundMusic = document.getElementById('musicTrack');
        if (backgroundMusic && !backgroundMusic.paused) {
            let volume = backgroundMusic.volume;
            const fadeOut = setInterval(() => {
                volume = Math.max(volume - 0.05, 0);
                backgroundMusic.volume = volume;
                if (volume <= 0) {
                    clearInterval(fadeOut);
                    backgroundMusic.pause();
                }
            }, 50);
            
            // Reset music play button
            const musicBtn = document.getElementById('musicPlayPause');
            musicBtn.classList.remove('playing');
            musicBtn.querySelector('.play-icon').style.display = 'block';
            musicBtn.querySelector('.pause-icon').style.display = 'none';
        }

        // Fade out current track if exists
        if (currentTrack && !currentTrack.paused) {
            let volume = currentTrack.volume;
            const fadeOut = setInterval(() => {
                volume = Math.max(volume - 0.05, 0);
                currentTrack.volume = volume;
                if (volume <= 0) {
                    clearInterval(fadeOut);
                    currentTrack.pause();
                }
            }, 50);
        }

        // Start new track
        if (newTrack) {
            const masterVol = masterVolume.value / 100;
            newTrack.volume = 0;
            await newTrack.play();
            button.classList.add('playing');

            // Fade in new track
            let volume = 0;
            const fadeIn = setInterval(() => {
                volume = Math.min(volume + 0.05, baseVolumes.music * masterVol);
                newTrack.volume = volume;
                if (volume >= baseVolumes.music * masterVol) clearInterval(fadeIn);
            }, 50);
        }

        currentTrack = newTrack;
    };

    // Setup track buttons
    document.querySelectorAll('.track-btn').forEach(button => {
        button.addEventListener('click', () => {
            const trackId = button.dataset.track;
            const track = tracks[trackId];

            if (button.classList.contains('playing')) {
                // Pause current track
                button.classList.remove('playing');
                switchTrack(null, null);
            } else {
                // Play new track
                switchTrack(track, button);
            }
        });
    });
};

// Initialize when DOM loads
document.addEventListener('DOMContentLoaded', () => {
    setupTrackList();
    setupSkipNarration();
    // ... rest of your existing code
});

// Add skip narration functionality
const createInsideNarrationButton = () => {
    const button = document.createElement('button');
    button.className = 'skip-narration';
    button.innerHTML = `
        <span class="skip-text">Play Narration</span>
        <span class="skip-icon">▶</span>
    `;
    document.body.appendChild(button);

    const insideNarration = document.getElementById('insideNarration');
    const insideSounds = document.getElementById('insideSounds');
    const insideView = document.querySelector('.inside-view');

    // Only show button when inside view is visible
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.target.classList.contains('visible')) {
                button.classList.add('visible');
                // Ensure inside sounds are playing
                if (insideSounds.paused) {
                    insideSounds.play();
                }
            } else {
                button.classList.remove('visible');
            }
        });
    });

    observer.observe(insideView, { attributes: true });

    // Handle button click
    button.addEventListener('click', () => {
        if (insideNarration.paused) {
            // Start narration
            insideNarration.play();
            button.innerHTML = `
                <span class="skip-text">Skip Narration</span>
                <span class="skip-icon">⏭</span>
            `;
        } else {
            // Skip narration but keep inside sounds playing
            insideNarration.pause();
            insideNarration.currentTime = 0;
            button.innerHTML = `
                <span class="skip-text">Play Narration</span>
                <span class="skip-icon">▶</span>
            `;
        }
    });

    // Reset button when narration ends but keep inside sounds playing
    insideNarration.addEventListener('ended', () => {
        button.innerHTML = `
            <span class="skip-text">Play Narration</span>
            <span class="skip-icon">▶</span>
        `;
    });
};

// Update the skip narration setup to create the inside button
const setupSkipNarration = () => {
    const skipButton = document.querySelector('.skip-narration');
    const narration = document.getElementById('narration');
    
    setTimeout(() => {
        skipButton.classList.add('visible');
    }, 2000);

    skipButton.addEventListener('click', () => {
        narration.pause();
        narration.currentTime = 0;
        
        const endEvent = new Event('ended');
        narration.dispatchEvent(endEvent);
        
        skipButton.classList.remove('visible');
        setTimeout(() => {
            skipButton.remove();
            createInsideNarrationButton(); // Create the inside narration button
        }, 300);
    });

    // Also create inside button when narration ends naturally
    narration.addEventListener('ended', () => {
        createInsideNarrationButton();
    });
};

const startLightFlicker = () => {
    const warmFilter = document.createElement('div');
    warmFilter.className = 'warm-filter';
    document.querySelector('.inside-container').appendChild(warmFilter);

    const flickerLight = () => {
        const randomDuration = Math.random() * 50 + 30; // Faster flicker (30-80ms)
        const shouldFlicker = Math.random() > 0.6; // 40% chance to flicker
        
        if (shouldFlicker) {
            warmFilter.style.opacity = '0.4'; // Brighter
            setTimeout(() => {
                const shouldStayOff = Math.random() > 0.7;
                if (shouldStayOff) {
                    warmFilter.style.opacity = '0';
                    setTimeout(() => {
                        warmFilter.style.opacity = '0.4';
                    }, Math.random() * 50 + 30);
                } else {
                    warmFilter.style.opacity = '0.2';
                }
            }, randomDuration);
        }
        
        const nextFlicker = Math.random() * 500 + 200; // More frequent (200-700ms)
        setTimeout(flickerLight, nextFlicker);
    };

    warmFilter.style.opacity = '0.4';
    flickerLight();
}; 
