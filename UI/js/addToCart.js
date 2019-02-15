const modal = document.getElementById("simpleModal");
const closeBtn = document.getElementsByClassName("closeBtn")[0];
const addToCarBbtn = document.getElementsByClassName("add-to-cart-btn");

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