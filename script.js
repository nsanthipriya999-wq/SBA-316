//----------DOM elements----------------------------
const board=document.getElementById("memoryBoard");
const attemptsText=document.getElementById("attempts");
const cluesText=document.getElementById("clues");
const message=document.getElementById("message");
const codeInput=document.getElementById("secretCode");
const timerText=document.getElementById("timer");
const bestTimeText=document.getElementById("bestTime");
//const  clueListElement=document.getElementById("clueList");
//--------------Variables-----------
let firstCard=null;
let secondCard=null;
let lock=false;
let attemptsDone=0;
let cluesFound=0;
let time=0;
let timerInterval=null;
//--------------secret code---------------
const secretCode="98435267"


        //clue list
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

//-----------------shuffle cards-----
//cards.sort(()=>Math.random()-0.5);
//console.log(cards);
function shuffleCards()
{
  for(let i=cards.length-1;i>0;i--)
  {
    const j=Math.floor(Math.random()*(i+1));
    [cards[i],cards[j]]=[cards[j],cards[i]];

  }

}

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

//------Start Timer-------------
function startTimer()
{
  timerInterval=setInterval(()=>{
   time++;
   timerText.textContent="Time:"+time+"s";

  },1000);

}
//-------Flip Card--------------
function flipCard()
{

  if(lock)return;
  if(this.classList.contains("matched")) return;
  if(this.classList.contains("flipped"))return;
  if(this===firstCard)return;
  this.classList.add("flipped");
  this.textContent=this.dataset.value;
  if(!firstCard)
  {
    firstCard=this;
    return;

  }
 secondCard=this;
 attemptsDone++;
 attemptsText.textContent="Moves:"+attemptsDone;
 checkMatch();
 
}

//----------------Check Match-------------
function checkMatch()
{

    if(firstCard.dataset.value===secondCard.dataset.value){
        firstCard.classList.add("matched");
        secondCard.classList.add("matched");

        firstCard.removeEventListener("click",flipCard);
        secondCard.removeEventListener("click",flipCard);
        
        cluesFound++;
        cluesText.textContent="Clues Found:" + cluesFound;
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
    if(cluesFound <= cluesList.length)
    {
        const li = document.createElement("li");
        li.textContent = cluesList[cluesFound - 1];

        
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

  if(matched.length===cards.length){
    clearInterval(timerInterval);
    setTimeout(()=>{
       message.textContent="Congratulations🎉🎉!! All Clues Found! Now crack the secret code!";
      // alert("You completed the Brain Blitz:Mind Vault game!!")

    },300);

  }

}
//-----Update Best Time Function-------
function updateBestTime(){
    let bestTime=localStorage.getItem("BestTime");
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
    if(!/^\d{8}$/.test(guess)){
       alert("Enter a valid 8 digit Code, accepts only  numbers!");
       return;

    }
    
    if(guess===secretCode){
        alert("ACCESS GRANTED 🔓Congratulations 🎉🎉🎉🎉🎉🎉You completed the Brain Blitz:Mind Game");
       
       confetti({
        particleCount:2000,
        spread:200,
        origin: { y: 0.6 }
    });


    
       
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
        
        //Saving best time in local storage
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

//-----Restart Game------------------
document.getElementById("restart").addEventListener("click",()=>{
    if(confirm("Restart Brain Blitz?")){
        //reset variables
        attemptsDone=0;
        cluesFound=0;
        firstCard=null;
        secondCard=null;
        lock=false;

        //reset timer

        clearInterval(timerInterval);
        time=0;
        timerText.textContent="Time:0s";
       

        //reset ux
        attemptsText.textContent="Moves:0";
        cluesText.textContent="Clues Found: 0";
        message.textContent="Find Matches to reveal the code!"
       //reset code
       codeInput.value="";
       document.getElementById("clueList").innerHTML = "";
       document.getElementById("submit").disabled=false;
        //clear board
        board.innerHTML="";
        shuffleCards();
        //restart game
        createBoard();
        startTimer();
        updateBestTime();

    }
});




//-------------Start Game---------------------
shuffleCards();
//console.log(board.childNodes);
createBoard();
startTimer();
updateBestTime();


