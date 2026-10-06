console.log("BiteBox Javascript is working!");
let restaurantName = "BiteBox";
alert("welcome to " + restaurantName + "!");
let customerName = prompt("Welcome to " + restaurantName + "! \n\nWhat is your name?");
alert("Hello " + customerName + "! \n\nWelcome to BiteBox.");
let exploreMenu = confirm("Would you like to explore our menu?");

if (exploreMenu) {
    alert("Great choice, " + customerName + "! \n\nLet's explore the BiteBox menu.");
}
else {
    alert("No problem, " + customerName + "! \n\nYou can explore the menu anytime.");
}

let choice = prompt("Choose a BiteBox category:\n" +
    "1. Pizza\n" +
    "2. Burger\n" +
    "3. Pasta\n" +
    "4. Desserts\n"
);

switch(choice) {
    case "1" :
        alert("You selected Pizza!");
        break;

    case "2" :
        alert("You selected Burger!");
        break;

    case "3" :
        alert("You selected Pasta!");
        break;

    case "4" :
        alert("You selected Dsserts!");
        break;

    default :
        alert("Invalid category selection.");
};

for(let i=0; i<=3; i++) {
    let food = prompt("Enter Food Item " + i);
    let quantity = prompt("Enter quantity for " + food);
    console.log(food + " - Qantity: " + quantity);
};