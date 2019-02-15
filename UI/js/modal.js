const modal = document.getElementById("simpleModal");
const closeBtn = document.getElementsByClassName("closeBtn")[0];
const createMealBtn = document.getElementById("createMealBtn");
const setMenubtn = document.getElementById("setMenubtn");

createMealBtn.addEventListener('click', openModal);
setMenubtn.addEventListener('click', openModal);
closeBtn.addEventListener('click', closeModal);
window.addEventListener('click', outsideClick);

function openModal() {
    modal.style.display = "block";
}

for (let i = 0; i < addToCarBbtn.length; i++) {
	let toCartBtn = addToCarBbtn[i];
		toCartBtn.addEventListener("click", openModal);
}


function closeModal() {
    modal.style.display = "none";
}

function outsideClick(e) {
    if (e.target == modal) {
        modal.style.display = "none";
    }
}