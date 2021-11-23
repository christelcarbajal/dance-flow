const likeButton = document.querySelector("#heart");
const emoji = document.querySelector("#emoji");
likeButton.addEventListener("click", () => lotsOfEmoji());
emojiArray = ["❤️‍🔥", "🌟", "💯", "💥", "👌"];

function lotsOfEmoji() {
    for (let i = 0; i < 20; i++) {
        createEmoji();
    }
}

function createEmoji() {
    const div = document.createElement("div");
    document.body.appendChild(div);
    div.innerHTML = emojiArray[Math.floor(Math.random() * 5)];
    div.style.width = Math.random() * 600 + "px";
    div.classList.add("emoji");
    div.style.animationDelay = `${Math.random()}s`;
    div.classList.add("moving");
    // remove the div at the end of the animation!
    div.addEventListener("animationend", (e) => e.target.remove());
}
