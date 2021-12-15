window.addEventListener('load', init);

// Global Variables
let slides = document.querySelectorAll('.slide');
let btns = document.querySelectorAll('.btn');
let currentSlide;
let expandImg;
let imgText;
let imgSelect;
let imagesContainer;


/**
 * Initialize after the DOM is ready
 */
function init () {
    currentSlide = 1;

    imgSelect = document.getElementsByClassName("column");
    expandImg = document.getElementById("expandedImg");
    imgText = document.getElementById("imgText");

    imagesContainer = document.getElementById('images-container');
    imagesContainer.addEventListener("click", galleryTab);

}

//Gallery
function galleryTab(e) {

    let currentTarget = e.target;

    //Return when no image is clicked
    if (currentTarget.nodeName !== "IMG") {
        return;
    }

    // Use the same src in the expanded image as the image being clicked on from the grid
    expandImg.src = currentTarget.src;

    // Use the value of the alt attribute of the clickable image as text inside the expanded image
    imgText.innerHTML = currentTarget.alt;

    // Show the container element (hidden with CSS)
    expandImg.parentElement.style.display = "block";
}


// Image slider manual navigation
let manualNav = function (manual) {
    slides.forEach((slide) => {
        slide.classList.remove('active');

        btns.forEach((btn) => {
            btn.classList.remove('active');
        });
    });

    slides[manual].classList.add('active');
    btns[manual].classList.add('active');
}

btns.forEach((btn, i) => {
    btn.addEventListener("click", () => { manualNav(i);
        currentSlide = i;
    });
});

// Javascript for image slider autoplay navigation
let repeat = function (activeClass) {
    let active = document.getElementsByClassName('active');
    let i = 1;
    let repeater = () => {
        setTimeout(function () {
            [...active].forEach((activeSlide) => {
                activeSlide.classList.remove('active');
            });

            slides[i].classList.add("active");
            btns[i].classList.add('active');
            i++;

            if (slides.length === i) {
                i = 0;
            }
            if (i >= slides.length) {
                return;
            }
            repeater();
        }, 5000);
    }
    repeater();
}
repeat();