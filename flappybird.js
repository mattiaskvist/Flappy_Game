const board_border = 'black';
const board_background = 'lightblue';
const bird_col = 'yellow';
const bird_border = 'lightorange';
const pipe_col = 'green';
const pipe_border = 'black';

const canvas = document.getElementById("flappyboard");
const board_ctx = canvas.getContext("2d");

const pipe_gap = 150;

const bird = { x: 150, y: 150, width: 25, height: 25 };
const pipes = [];

let dy = 0;
const dx = 4;

let score = 0;
let high_score = localStorage.getItem("flappy_high_score") || 0;
let score_timeout = 0;


main();

function main() {
    if (has_game_ended()) {
        board_ctx.font = "16px Arial";
        board_ctx.fillStyle = "black";
        board_ctx.fillText("Game Over", canvas.width / 2 - 30, canvas.height / 4);
        if (score > high_score) {
            high_score = score;
            localStorage.setItem("flappy_high_score", high_score);
            draw_score();
            draw_high_score();
        }
        return;
    }
    clearCanvas();
    move_pipes();
    move_bird();
    draw_bird();
    draw_pipes();
    draw_score();
    draw_high_score();
    requestAnimationFrame(main);
}

function draw_bird() {
    board_ctx.fillStyle = bird_col;
    board_ctx.strokeStyle = bird_border;
    board_ctx.fillRect(bird.x, bird.y, bird.width, bird.height);
    board_ctx.strokeRect(bird.x, bird.y, bird.width, bird.height);
}

function clearCanvas() {
    board_ctx.fillStyle = board_background;
    board_ctx.strokeStyle = board_border;
    board_ctx.fillRect(0, 0, canvas.width, canvas.height);
    board_ctx.strokeRect(0, 0, canvas.width, canvas.height);
}

function move_bird() {
    dy += 0.6;
    bird.y += dy;
    if (bird.y + bird.height > canvas.height || bird.y < 0) {
        dy = 0;
        bird.y = canvas.height - bird.height;
    }
    // check if bird has passed pipe
    if (pipes[0].x + pipes[0].width / 2 < bird.x && score_timeout == 0) {
        score++;
        score_timeout = 1;
        generate_pipe_pair();
    } else if (pipes[0].x + pipes[0].width / 2 > bird.x) {
        score_timeout = 0;
    }
}

function draw_pipes() {
    board_ctx.fillStyle = pipe_col;
    board_ctx.strokeStyle = pipe_border;
    board_ctx.lineWidth = 2;

    for (const pipe of pipes) {
        board_ctx.fillRect(pipe.x, pipe.y, pipe.width, pipe.height);
        board_ctx.strokeRect(pipe.x, pipe.y, pipe.width, pipe.height);
    }
}

function move_pipes() {
    for (const pipe of pipes) {
        pipe.x -= dx;
    }
    if (pipes.length == 0) {
        generate_pipe_pair();
    }
    // remove pipes that have gone off screen
    if (pipes[0].x + pipes[0].width < 0 && pipes[1].x + pipes[1].width < 0) {
        pipes.splice(0, 2);
    }
}

function generate_pipe_pair() {
    const lower_pipe_height = Math.floor(Math.random() * (canvas.height - pipe_gap));
    const upper_pipe_height = canvas.height - lower_pipe_height - pipe_gap;

    const lower_pipe = { x: canvas.width, y: canvas.height - lower_pipe_height, width: 25, height: lower_pipe_height };
    const upper_pipe = { x: canvas.width, y: 0, width: 25, height: upper_pipe_height };

    pipes.push(lower_pipe, upper_pipe);
}

function has_game_ended() {
    // check if bird has hit pipe
    for (const pipe of pipes) {
        if ((pipe.x <= bird.x && bird.x <= pipe.x + pipe.width) // bird is between pipe.x and pipe.x + pipe.width
            || (pipe.x <= bird.x + bird.width && bird.x + bird.width <= pipe.x + pipe.width) // bird is between pipe.x and pipe.x + pipe.width
        ) {
            if (bird.y <= pipe.y + pipe.height && bird.y + bird.height >= pipe.y) {
                return true;
            }
        }
    }
    return bird.y + bird.height >= canvas.height;
}

function draw_score() {
    board_ctx.font = "16px Arial";
    board_ctx.fillStyle = "black";
    board_ctx.fillText("Score: " + score, 8, 20);
}

function draw_high_score() {
    board_ctx.font = "16px Arial";
    board_ctx.fillStyle = "black";
    board_ctx.fillText("High Score: " + high_score, 8, 40);
}


// Listen to keyboard events to move the bird
document.addEventListener("keydown", change_direction);

function change_direction(event) {
    switch (event.key) {
        case "ArrowUp":
        case "w":
        case " ":  
            event.preventDefault(); // Prevent default space behavior (e.g., scrolling)
            if (has_game_ended()) {
                location.reload();
            }
            dy = -10;
            break;
    }
}

// Listen to mouse events to move the bird
document.addEventListener("mousedown", change_direction_mouse);

function change_direction_mouse(event) {
    if (has_game_ended()) {
        location.reload();
    }
    dy = -10;
}

// Listen to touch events to move the bird
document.addEventListener("touchstart", change_direction_touch);

function change_direction_touch(event) {
    event.preventDefault(); // Prevent default touch behavior (e.g., scrolling)
    if (has_game_ended()) {
        location.reload();
    }
    dy = -10;
}


