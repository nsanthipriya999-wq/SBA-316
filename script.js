//----------DOM elements----------------------------
const board=document.getElementById("memoryBoard");
const attemptsText=document.getElementById("attempts");
const cluesText=document.getElementById("clues");
const message=document.getElementById("message");
const codeInput=document.getElementById("secretCode");
const timerText=document.getElementById("timer");
const bestTimeText=document.getElementById("bestTime");

//--------------Variables-----------
let firstCard=null;
let secondCard=null;
let lock=false;
let attemptsDone=0;
let cluesFound=0;
let time=0;
let timerInterval=null;

//--------------secret code---------------------------------------
const secretCode="98435267"

//-----------------Sound plays at the completion of game-----------
const winSound=new Audio("winsound.mp3");
winSound.volume=0.3;

//--------------------clue list--Array--------------------------------------
         const cluesList=[ 
                "First Digit is 9",
                "Second Digit is 8",
                "Third Digit is 4",
                "Fourth Digit is 3",
                "Fifth Digit is 5",
                "Sixth Digit is 2",
                "Seventh Digit is 6",
                "Eight Digit is 7"
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

//-----------------shuffle cards-----------------------------
function shuffleCards()
{
  for(let i=cards.length-1;i>0;i--)                                   //loops from last one to first card
  {
    const j=Math.floor(Math.random()*(i+1));
    [cards[i],cards[j]]=[cards[j],cards[i]];                         // swap cards

  }

}

//-------------------memory board--and individual cards creation---------------------------------
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
  board.appendChild(fragment);                                         //add all cards to board at once
}

//-----------------------------------Start Timer------------------------------
function startTimer()
{
  timerInterval=setInterval(()=>{                                             //Starter Time
   time++;
   timerText.textContent="Time:"+time+"s";

  },1000);                                                                   //1000ms=1sec

}
//-----------------------------------------Flip Card-------------------------------------
function flipCard()
{
  if(lock)return;                                                      //ignore in case of two matched cards.
  if(this.classList.contains("matched")) return;
  if(this.classList.contains("flipped"))return;                        //If any card is already flipped
  if(this===firstCard)return;                                          //prevents double clicking the same card
  this.classList.add("flipped");
  this.textContent=this.dataset.value;                                 //shows the actual number/value
  if(!firstCard)                                                       //if no card selected
  { 
    firstCard=this;
    return;

  }
 secondCard=this;
 attemptsDone++;                                                      //Moves Counter
 attemptsText.textContent="Moves:"+attemptsDone;
 checkMatch();                                                        //Check for a matched pair.
 
}

//--------------------------------------Check Match-----------------------------------
function checkMatch()
{

    if(firstCard.dataset.value===secondCard.dataset.value){
        firstCard.classList.add("matched");                         //if first card value matches with second card
        secondCard.classList.add("matched");

        firstCard.removeEventListener("click",flipCard);           //inorder to avoid clicking them again
        secondCard.removeEventListener("click",flipCard);
        
        cluesFound++;
        cluesText.textContent="Clues Found:" + cluesFound;           //clues counter
        revealClue();                                            
        checkWin();
        resetTurn();
   }
   else 
   {
    lock=true;                                                         //prevents clicking
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
    if(cluesFound <= cluesList.length)
    {
        const li = document.createElement("li");                         //new list item
        li.textContent = cluesList[cluesFound - 1];                     //retrieves clue from array

        
        const clueContainer = board.nextElementSibling;
        const clueList=clueContainer.querySelector("#clueList");
        clueList.appendChild(li);

        clueContainer.style.border="2px solid gold";
        clueContainer.style.padding="15px";

        const latest=clueList.children[clueList.children.length-1];
        latest.style.color="white";
        latest.style.fontWeight="bold";


        message.textContent="🔓 New Clue Unlocked!"

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

  if(matched.length===cards.length){                                               //count matched cards
    clearInterval(timerInterval);                                                  //if all cards matched,stop the timer
    setTimeout(()=>{
       message.textContent="Congratulations🎉🎉!! All Clues Found! Now crack the secret code!";
    },300);

  }

}
//-----Update Best Time Function-------
function updateBestTime(){
    let bestTime=localStorage.getItem("BestTime");                    //saved time from LocalStorage
    if (bestTime===null)
    {
        bestTimeText.textContent="Best Time: --";

    }
    else
    {
        bestTimeText.textContent="Best Time: "+ bestTime +"s";
    }
}
//------------code breaker validation--
document.getElementById("submit").addEventListener("click",()=>{
    const guess=codeInput.value.trim();

    //pattern matching
    if(!/^\d{8}$/.test(guess)){                                                 //secret code validation for 8 numbers.
       alert("Enter a valid 8 digit Code, accepts only  numbers!");
       return;

    }
    
    if(guess===secretCode){
        alert("ACCESS GRANTED 🔓Congratulations 🎉🎉🎉🎉🎉🎉You completed the Brain Blitz:Mind Game");
        
   winSound.play();                                                //Game winning sound
       confetti({
        particleCount:2000,
        spread:200,
        origin: { y: 0.6 }
    });


    //-------------------------------Confetti--Celebration-----------------------------------------
       
        setTimeout(()=>{
        confetti({

            particleCount:1000,
            angle:63,
            spread:700

        });
    },300);

    setTimeout(()=>{
        confetti({

            particleCount:1000,
            angle:126,
            spread:700

        });
    },500);
    
    message.textContent="Congratulations 🎉🎉🎉🎉🎉🎉You completed the Brain Blitz:Mind Game";
        
//-------------------------Saving best time in local storage-------------------------------------------
       const bestTime=localStorage.getItem("BestTime");
       if(!bestTime||time<Number(bestTime)){
         localStorage.setItem("BestTime",time);
       }
     
        updateBestTime();
        document.getElementById("submit").disabled=true;
    }
    else{
        alert("Wrong code! Please Try Again!")
    }
    

});

//---------------------------------------Restart Game-------------------------------------------
document.getElementById("restart").addEventListener("click",()=>{
    if(confirm("Restart Brain Blitz?")){
//----------------------------------------Reset variables----------------------------------------
        attemptsDone=0;
        cluesFound=0;
        firstCard=null;
        secondCard=null;
        lock=false;

//------------------------------------------Reset timer------------------------------------------------------

        clearInterval(timerInterval);
        time=0;
        timerText.textContent="Time:0s";
       

    //---------------------------------------------reset user stats-----------------------------------------

        attemptsText.textContent="Moves:0";
        cluesText.textContent="Clues Found: 0";
        message.textContent="Find Matches to reveal the code!"

  //------------------------------------------reset code------------------------------------------------
       codeInput.value="";
       document.getElementById("clueList").innerHTML = "";
       document.getElementById("submit").disabled=false;               //to prevent clicking submit multiple times
//--------------------------------------clear board---------------------------------------------------------
        board.innerHTML="";
        shuffleCards();
//---------------------------------------restart game------------------------------------------------------------
        createBoard();
        startTimer();
        updateBestTime();

    }
});




//--------------------------------------------------Start Game---------------------
shuffleCards();
createBoard();
startTimer();
updateBestTime();


