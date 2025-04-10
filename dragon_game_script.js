document.addEventListener('DOMContentLoaded', () => {
    // Khởi tạo các biến cho game
    const gameBoard = document.getElementById('game-board');
    const scoreElement = document.getElementById('score');
    const startButton = document.getElementById('start-button');
    const resetButton = document.getElementById('reset-button');
    
    const GRID_SIZE = 20;
    let dragon = [];
    let direction = { x: 0, y: 0 };
    let lastDirection = { x: 0, y: 0 };
    let egg = { x: 10, y: 10 };
    let gameSpeed = 150; // milliseconds
    let gameInterval;
    let score = 0;
    let gameActive = false;
    
    // Khởi tạo game
    function initGame() {
        // Xóa game board
        gameBoard.innerHTML = '';
        
        // Khởi tạo con rồng với 3 phần thân
        dragon = [
            { x: 10, y: 5 }, // Đầu
            { x: 10, y: 6 },
            { x: 10, y: 7 }
        ];
        
        // Reset các giá trị khác
        direction = { x: 0, y: -1 };
        lastDirection = { x: 0, y: -1 };
        score = 0;
        scoreElement.textContent = score;
        
        // Vẽ lại game
        drawGame();
        
        // Tạo trứng rồng đầu tiên
        createEgg();
    }
    
    // Vẽ game
    function drawGame() {
        gameBoard.innerHTML = '';
        
        // Vẽ con rồng
        dragon.forEach((segment, index) => {
            const dragonElement = document.createElement('div');
            
            if (index === 0) {
                dragonElement.classList.add('dragon-head');
            } else {
                dragonElement.classList.add('dragon-body');
            }
            
            dragonElement.style.gridRowStart = segment.y;
            dragonElement.style.gridColumnStart = segment.x;
            gameBoard.appendChild(dragonElement);
        });
        
        // Vẽ trứng rồng
        const eggElement = document.createElement('div');
        eggElement.classList.add('dragon-egg');
        eggElement.style.gridRowStart = egg.y;
        eggElement.style.gridColumnStart = egg.x;
        gameBoard.appendChild(eggElement);
    }
    
    // Cập nhật trạng thái game
    function updateGame() {
        // Lưu vị trí cuối cùng của rồng
        const dragonCopy = [...dragon];
        
        // Cập nhật hướng đi
        lastDirection = { x: direction.x, y: direction.y };
        
        // Di chuyển đầu rồng
        const newHead = {
            x: dragon[0].x + direction.x,
            y: dragon[0].y + direction.y
        };
        
        // Kiểm tra va chạm với tường
        if (
            newHead.x < 1 || newHead.x > GRID_SIZE ||
            newHead.y < 1 || newHead.y > GRID_SIZE
        ) {
            gameOver();
            return;
        }
        
        // Kiểm tra va chạm với thân rồng
        for (let i = 0; i < dragon.length; i++) {
            if (dragon[i].x === newHead.x && dragon[i].y === newHead.y) {
                gameOver();
                return;
            }
        }
        
        // Thêm đầu mới
        dragon.unshift(newHead);
        
        // Kiểm tra ăn trứng
        if (newHead.x === egg.x && newHead.y === egg.y) {
            // Tăng điểm
            score += 10;
            scoreElement.textContent = score;
            
            // Tăng tốc độ game sau mỗi 50 điểm
            if (score % 50 === 0) {
                gameSpeed = Math.max(50, gameSpeed - 10);
                clearInterval(gameInterval);
                if (gameActive) {
                    gameInterval = setInterval(updateGame, gameSpeed);
                }
            }
            
            // Tạo trứng mới
            createEgg();
        } else {
            // Nếu không ăn trứng, bỏ phần đuôi
            dragon.pop();
        }
        
        // Vẽ lại game
        drawGame();
    }
    
    // Tạo trứng rồng mới
    function createEgg() {
        let newEgg;
        let onDragon;
        
        do {
            onDragon = false;
            newEgg = {
                x: Math.floor(Math.random() * GRID_SIZE) + 1,
                y: Math.floor(Math.random() * GRID_SIZE) + 1
            };
            
            // Kiểm tra trứng không nằm trên thân rồng
            for (let segment of dragon) {
                if (segment.x === newEgg.x && segment.y === newEgg.y) {
                    onDragon = true;
                    break;
                }
            }
        } while (onDragon);
        
        egg = newEgg;
    }
    
    // Xử lý game over
    function gameOver() {
        clearInterval(gameInterval);
        gameActive = false;
        
        // Hiển thị thông báo game over
        const gameOverElement = document.createElement('div');
        gameOverElement.classList.add('game-over');
        gameOverElement.innerHTML = `
            <h2>Game Over!</h2>
            <p>Điểm số: ${score}</p>
        `;
        gameBoard.appendChild(gameOverElement);
    }
    
    // Xử lý phím bấm
    function handleKeydown(e) {
        // Chỉ xử lý khi game đã bắt đầu
        if (!gameActive) return;
        
        switch (e.key) {
            case 'ArrowUp':
                if (lastDirection.y !== 1) { // Không cho phép quay đầu 180 độ
                    direction = { x: 0, y: -1 };
                }
                break;
            case 'ArrowDown':
                if (lastDirection.y !== -1) {
                    direction = { x: 0, y: 1 };
                }
                break;
            case 'ArrowLeft':
                if (lastDirection.x !== 1) {
                    direction = { x: -1, y: 0 };
                }
                break;
            case 'ArrowRight':
                if (lastDirection.x !== -1) {
                    direction = { x: 1, y: 0 };
                }
                break;
        }
    }
    
    // Bắt đầu game
    function startGame() {
        if (gameActive) return;
        
        initGame();
        gameActive = true;
        direction = { x: 0, y: -1 }; // Di chuyển lên trên ban đầu
        gameInterval = setInterval(updateGame, gameSpeed);
    }
    
    // Thiết lập event listeners
    startButton.addEventListener('click', startGame);
    resetButton.addEventListener('click', startGame); // Reset cũng bắt đầu game mới
    document.addEventListener('keydown', handleKeydown);
    
    // Hiển thị game board ban đầu
    initGame();
});
