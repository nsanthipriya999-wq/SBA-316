//----------DOM elements----------------------------
const board=document.getElementById("memoryBoard");
const attemptsText=document.getElementById("attempts");
const cluesText=document.getElementById("clues");
const message=document.getElementById("message");
const code=document.getElementById("secretCode");
//--------------Variables-----------
let firstCard=null;
let secondCard=null;
let lock=false;
let attemptsDone=0;
let cluesFound=0;

//--------------secret code---------------
const secretCode="98435267"


        //clue list
         const cluesList=[ 
                  "Digit 1=9",
                  "Digit 2=8",
                  "Digit 3=4",
                  "Digit 4=3",
                  "Digit 5=5",
                  "Digit 6=2",
                  "Digit 7=6",
                  "Digit 8=7"
                ];          
                  







//---------4*4 grid =16 cards,8 pairs--------
let cards=[   "9","9",
              "8","8",
              "4","4",
              "3","3",
              "5","5",
              "2","2",
              "6","6",
              "7","7"];

//-----------------shuffle cards-----
cards.sort(()=>Math.random()-0.5);
console.log(cards);

//-------------------memory board--------
function createBoard()
{
    const fragment=document.createDocumentFragment();
    cards.forEach(value=>
    {
       const card=document.createElement("div");
       card.classList.add("card");
       card.textContent="?";
       card.dataset.value= value;
       card.addEventListener("click",flipCard);
       fragment.appendChild(card);
});
  board.appendChild(fragment);
}

//-------Flip Card--------------
function flipCard()
{
  if(lock||this.classList.contains("matched")) return;
  this.classList.add("flipped");
  this.textContent=this.dataset.value;
  if(!firstCard)
  {
    firstCard=this;
    return;

  }
 secondCard=this;
 attemptsDone++;
 attemptsText.textContent="Attempts:"+attemptsDone;
 checkMatch();
 
}

//----------------Check Match-------------
function checkMatch()
{

    if(firstCard.dataset.value===secondCard.dataset.value){
        firstCard.classList.add("matched");
        secondCard.classList.add("matched")

        cluesFound++;
        cluesText.textContent="Clues Found:" + cluesFound;

        firstCard.removeEventListener("click",flipCard);
        secondCard.removeEventListener("click",flipCard);
        
        revealClue();
        checkWin();
        resetTurn();
   }
   else 
   {
    lock=true;
    setTimeout(()=>{
    firstCard.textContent="?";
    secondCard.textContent="?";

    firstCard.classList.remove("flipped");
    secondCard.classList.remove("flipped");

    resetTurn();

   

   },800);
}

}
//-----------Clues-----------------
function revealClue()
{
 
  
  
  
    if(cluesFound<=cluesList.length)
   {
    message.textContent=cluesList[cluesFound-1];



   }




}

//------------Reset Turn------------------

function resetTurn()
{
  firstCard=null;
  secondCard=null;
  lock=false;

}

//------------------check win----------

function checkWin()
{
  const matched=document.querySelectorAll(".matched");

  if(matched.length==16){
    setTimeout(()=>{
       message.textContent="Congratulations🎉🎉!! All Clues Found! Now crack the secret code!";

    },300);

  }

}

//------------code breaker validation--
document.getElementById("submit").addEventListener("click",()=>{
    const guess=code.value;

    //pattern matching
    if(!/^\d{8}$/.test(guess)){
       alert("Enter a valid 8 digit Code!");
       return;

    }
    
    if(guess===secretCode){
        alert("ACCESS GRANTED 🔓");
        localStorage.setItem("BestAttempts",attemptsDone);
    }
    else{
        alert("Wrong code! Please Try Again!")
    }
    

});

//-----Restart Game------------------
document.getElementById("restart").addEventListener("click",()=>{
    if(confirm("Restart Brain Blitz?")){
        //reset variables
        attemptsDone=0;
        cluesFound=0;
        //reset ux
        attemptsText.textContent="Attempts:0";
        cluesText.textContent="Clues Found: 0";

        //clear board
        board.innerHTML="";
        cards.sort(()=>Math.random()-0.5);
        //restart game
        createBoard();

    }
});

//-------------Start Game---------------------
createBoard();




