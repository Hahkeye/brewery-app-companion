
/* 
let cardbody = document.getElementsByClassName("card-body")[0];
cardbody.addEventListener("click", function(e) {
    cardbody.classList.toggle("scene");
    console.log("card")
}
);
*/

$(document).ready(function() {  

    $('.cardflip').click(function() {
        $(this).toggleClass('hover');
    });
  
  });



