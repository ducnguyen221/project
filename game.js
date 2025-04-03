document.addEventListener('DOMContentLoaded', () => {
    const gameContainer = document.querySelector('.game-container');
    const dragon = document.querySelector('.dragon');
    const ground = document.querySelector('.ground');
    const scoreDisplay = document.querySelector('.score');
    const startScreen = document.querySelector('.start-screen');
    const gameOverScreen = document.querySelector('.game-over');
    const startButton = document.getElementById('start-button');
    const restartButton = document.getElementById('restart-button');
    const finalScore = document.getElementById('final-score');
    
    let dragonPos = 300;
    let gravity = 0.5;
    let velocity = 0;
    let isJumping = false;
    let isGameOver = false;
    let score = 0;
    let gameTimerId;
    let pipeGenerationTimerId;
    
    // Set initial dragon position
    dragon.style.top = dragonPos + 'px';
    
    // Start game when button clicked
    startButton.addEventListener('click', startGame);
    
    // Restart game when restart button clicked
    restartButton.addEventListener('click', () => {
        location.reload(); // Simple reload to restart
    });
    
    // Handle key press
    document.addEventListener('keydown', (e) => {
        if (e.code === 'Space') {
            if (!isGameOver && startScreen.style.display === 'none') {
                jump();
            } else if (startScreen.style.display !== 'none') {
                startGame();
            }
        }
    });
    
    // Handle mouse click for jump
    gameContainer.addEventListener('click', () => {
        if (!isGameOver && startScreen.style.display === 'none') {
            jump();
        }
    });
    
    function startGame() {
        startScreen.style.display = 'none';
        isGameOver = false;
        score = 0;
        scoreDisplay.textContent = score;
        dragonPos = 300;
        velocity = 0;
        dragon.style.top = dragonPos + 'px';
        
        // Add flying animation to dragon
        dragon.classList.add('flying');
        
        // Start game loop
        gameTimerId = setInterval(updateGame, 20);
        
        // Start pipe generation
        pipeGenerationTimerId = setInterval(generatePipes, 1800);
    }
    
    function updateGame() {
        // Apply gravity to dragon
        velocity += gravity;
        dragonPos += velocity;
        
        // Update dragon position
        dragon.style.top = dragonPos + 'px';
        
        // Angle dragon based on velocity
        let angle = Math.min(Math.max(velocity * 3, -30), 60);
        dragon.style.transform = `rotate(${angle}deg)`;
        
        // Check for collisions
        checkCollision();
    }
    
    function jump() {
        velocity = -9;
        isJumping = true;
        
        // Reset jumping state after a short delay
        setTimeout(() => {
            isJumping = false;
        }, 100);
    }
    
    function generatePipes() {
        if (isGameOver) return;
        
        // Gap between pipes
        const gap = 170;
        
        // Random position for the gap
        const pipePos = Math.floor(Math.random() * 250) + 100;
        
        // Create top pipe
        const topPipe = document.createElement('div');
        topPipe.classList.add('pipe', 'pipe-top');
        topPipe.style.height = pipePos + 'px';
        topPipe.style.left = '400px';
        topPipe.style.top = '0';
        gameContainer.appendChild(topPipe);
        
        // Create bottom pipe
        const bottomPipe = document.createElement('div');
        bottomPipe.classList.add('pipe', 'pipe-bottom');
        bottomPipe.style.height = (600 - pipePos - gap - 100) + 'px'; // Subtract ground height
        bottomPipe.style.left = '400px';
        bottomPipe.style.bottom = '100px'; // Ground height
        gameContainer.appendChild(bottomPipe);
        
        // Move pipes
        const movePipes = setInterval(() => {
            if (isGameOver) {
                clearInterval(movePipes);
                return;
            }
            
            // Get current position
            let pipeLeft = parseInt(topPipe.style.left);
            
            // Move pipes
            pipeLeft -= 2;
            topPipe.style.left = pipeLeft + 'px';
            bottomPipe.style.left = pipeLeft + 'px';
            
            // Remove pipes when they go off screen
            if (pipeLeft < -80) {
                clearInterval(movePipes);
                gameContainer.removeChild(topPipe);
                gameContainer.removeChild(bottomPipe);
            }
            
            // Increment score when dragon passes pipe
            if (pipeLeft === 0) {
                score++;
                scoreDisplay.textContent = score;
                
                // Play coin sound effect (if we add sound later)
                // playCoinSound();
            }
        }, 20);
    }
    
    function checkCollision() {
        // Get dragon boundaries
        const dragonRect = dragon.getBoundingClientRect();
        const groundRect = ground.getBoundingClientRect();
        
        // Check for ground collision
        if (dragonRect.bottom >= groundRect.top || dragonRect.top <= 0) {
            gameOver();
            return;
        }
        
        // Check for pipe collisions
        const pipes = document.querySelectorAll('.pipe');
        pipes.forEach(pipe => {
            const pipeRect = pipe.getBoundingClientRect();
            
            if (
                dragonRect.right - 10 >= pipeRect.left &&
                dragonRect.left + 10 <= pipeRect.right &&
                dragonRect.bottom - 5 >= pipeRect.top &&
                dragonRect.top + 5 <= pipeRect.bottom
            ) {
                gameOver();
                return;
            }
        });
    }
    
    function gameOver() {
        clearInterval(gameTimerId);
        clearInterval(pipeGenerationTimerId);
        isGameOver = true;
        
        // Stop dragon flying animation
        dragon.classList.remove('flying');
        
        // Update score and show game over screen
        finalScore.textContent = score;
        gameOverScreen.style.display = 'flex';
    }
    
    // Function to add some extra Mario clouds (optional)
    function addClouds() {
        const cloudsContainer = document.querySelector('.clouds');
        
        for (let i = 0; i < 3; i++) {
            const cloud = document.createElement('div');
            cloud.className = 'cloud';
            cloud.style.top = `${Math.random() * 200 + 50}px`;
            cloud.style.left = `${Math.random() * 300}px`;
            cloud.style.animationDuration = `${Math.random() * 10 + 20}s`;
            cloudsContainer.appendChild(cloud);
        }
    }
    
    // Add some extra clouds
    addClouds();
});