const dino = document.getElementById("dino");
const cactus = document.getElementById("cactus");

document.addEventListener("keydown", function (event) {
  if (event.code === "Space") {
    jump();
  }
});

function jump() {
  if (!dino.classList.contains("jump")) {
    dino.classList.add("jump");

    setTimeout(() => {
      dino.classList.remove("jump");
    }, 500);
  }
}

// Colisión
let isAlive = setInterval(() => {
  let dinoBottom = parseInt(window.getComputedStyle(dino).getPropertyValue("bottom"));
  let cactusRight = parseInt(window.getComputedStyle(cactus).getPropertyValue("right"));

  // Colisión simple
  if (cactusRight > 450 && cactusRight < 510 && dinoBottom < 40) {
    alert("💀 Game Over!");
    location.reload();
  }
}, 10);
  