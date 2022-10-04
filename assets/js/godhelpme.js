$('#facts').on('click',function(event){
  if($(event.target).attr("class")== "fold"){
      if($(event.target).next('div').css("display")  == "block"){
          $(event.target).next('div').css("display","none");
      }else{
          $(event.target).next('div').css("display","block");
      }
  }
});




// function boxToggle(id) {
//     var x = document.getElementById(id);
//     var y = x.getAttribute("target");
//     if (x.style.display === "none") {
//       x.style.display = "block";
//     } else {
//       x.style.display = "none";
//     }
//   }

//   function boxToggle2() {
//     var x = document.getElementById("toggle2");
//     if (x.style.display === "none") {
//       x.style.display = "block";
//     } else {
//       x.style.display = "none";
//     }
//   }

//   function boxToggle3() {
//     var x = document.getElementById("toggle3");
//     if (x.style.display === "none") {
//       x.style.display = "block";
//     } else {
//       x.style.display = "none";
//     }
//   }

//   function boxToggle4() {
//     var x = document.getElementById("toggle4");
//     if (x.style.display === "none") {
//       x.style.display = "block";
//     } else {
//       x.style.display = "none";
//     }
//   }

//   function boxToggle5() {
//     var x = document.getElementById("toggle5");
//     if (x.style.display === "none") {
//       x.style.display = "block";
//     } else {
//       x.style.display = "none";
//     }
//   }

//   function boxToggle6() {
//     var x = document.getElementById("toggle6");
//     if (x.style.display === "none") {
//       x.style.display = "block";
//     } else {
//       x.style.display = "none";
//     }
//   }

//   function boxToggle7() {
//     var x = document.getElementById("toggle7");
//     if (x.style.display === "none") {
//       x.style.display = "block";
//     } else {
//       x.style.display = "none";
//     }
//   }

//   function boxToggle8() {
//     var x = document.getElementById("toggle8");
//     if (x.style.display === "none") {
//       x.style.display = "block";
//     } else {
//       x.style.display = "none";
//     }
//   }

//   function boxToggle9() {
//     var x = document.getElementById("toggle9");
//     if (x.style.display === "none") {
//       x.style.display = "block";
//     } else {
//       x.style.display = "none";
//     }
//   }