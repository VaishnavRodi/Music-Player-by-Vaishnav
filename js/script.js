const container = document.querySelector(".container"),
musicImg = container.querySelector(".img-area img"),
musicName = container.querySelector(".song-details .name"),
musicArtist = container.querySelector(".song-details .artist"),
mainAudio = container.querySelector(".main-audio"),
playPauseBtn = container.querySelector(".play-pause")
nextBtn = container.querySelector("#next"),
prevBtn = container.querySelector("#prev"),
progressBar = container.querySelector(".progress-bar"),
progressArea = container.querySelector(".progress-area")
musicList = container.querySelector(".music-list"),
moreMusicBtn = container.querySelector("#more-music"),
closeMoreMusic = container.querySelector("#close");


let musicIndex = Math.floor((Math.random() * allMusic.length) + 1);

window.addEventListener("load", () => {
    loadMusic(musicIndex);
    playingSong();
})

//loadMusic function
function loadMusic(indexNumb){
    musicName.innerText = allMusic[indexNumb - 1].name;
    musicArtist.innerText = allMusic[indexNumb - 1].artist;
    musicImg.src = `/images/${allMusic[indexNumb - 1].img}.jpg`;
    mainAudio.src = `/songs/${allMusic[indexNumb - 1].src}.mp3`;
}

window.addEventListener("load", () => {
    loadMusic(musicIndex);
})

//playMusic function()
function playMusic(){
    container.classList.add("paused");
    playPauseBtn.querySelector("i").innerText= "pause";
    mainAudio.play();
}

//pauseMusic function()
function pauseMusic(){
    container.classList.remove("paused");
    playPauseBtn.querySelector("i").innerText= "play_arrow";
    mainAudio.pause();
}

// play and pause button events
playPauseBtn.addEventListener("click", () => {
    const isMusicPaused = container.classList.contains("paused");
    isMusicPaused ? pauseMusic() : playMusic();
})

//nextMusic function()
function nextMusic(){
    musicIndex++;
    musicIndex > allMusic.length ? musicIndex = 1 : musicIndex; 
    loadMusic(musicIndex);
    playMusic();
}

nextBtn.addEventListener("click", () => {
    nextMusic();
})

//prevMusic function()
function prevMusic(){
    musicIndex--;
    musicIndex < 1 ? musicIndex = allMusic.length : musicIndex; 
    loadMusic(musicIndex);
    playMusic();
}

prevBtn.addEventListener("click", () => {
    prevMusic();
})

// Updating the song elapsed time and total duration...

mainAudio.addEventListener("timeupdate", (e) => {
    const currentTime = e.target.currentTime;
    const duration = e.target.duration;
    let progressWidth = (currentTime / duration) * 100;
    progressBar.style.width = `${progressWidth}%`;

    let musicCurrentTime = container.querySelector(".current-time"),
    musicDuration = container.querySelector(".max-duration");

    // update total time duration of song

    mainAudio.addEventListener("loadeddata", () => {
        let mainAdDuration = mainAudio.duration;
        let totalMin = Math.floor(mainAdDuration / 60 );
        let totalSec = Math.floor(mainAdDuration % 60 );

        if(totalSec < 10){
            totalSec = `0${totalSec}`;
        }
        musicDuration.innerText = `${totalMin} : ${totalSec}`;

    })

    // update current time of song

        let currentMin = Math.floor(currentTime / 60 );
        let currentSec = Math.floor(currentTime % 60 );

        if(currentSec < 10){
            currentSec = `0${currentSec}`;
        }
        musicCurrentTime.innerText = `${currentMin} : ${currentSec}`;

});

// update current song progress width according to progress area width

progressArea.addEventListener("click", (e) => {
    let progressWidth = progressArea.clientWidth;      // width of progressBar
    let clickedOffsetX = e.offsetX;                    // getting offsetX value
    let songDuration = mainAudio.duration;             // getting song duration

    mainAudio.currentTime = (clickedOffsetX / progressWidth ) * songDuration;
    playMusic();
})

// change loop, shuffle, repeat icons on click

const repeatBtn = container.querySelector("#repeat-plist");
repeatBtn.addEventListener("click", () => {
    let getText = repeatBtn.innerText;
    switch(getText){
        case "repeat" :
            repeatBtn.innerText = "repeat_one";
            repeatBtn.setAttribute("title", "song looped");
            break;
            
        case "repeat_one" :
            repeatBtn.innerText = "shuffle";
            repeatBtn.setAttribute("title", "playback shuffled");
            break;

        case "shuffle" :
            repeatBtn.innerText = "repeat";
            repeatBtn.setAttribute("title", "playback looped");
            break;
    }
})

// now let's add functionality to repeat shuffles

mainAudio.addEventListener("ended", () => {
    let getText = repeatBtn.innerText;
    switch(getText){
        case "repeat" :
            nextMusic();
            break;
            
        case "repeat_one" :
            mainAudio.currentTime = 0;
            loadMusic(musicIndex);
            playMusic();
            break;

        case "shuffle" :
            let randIndex = Math.floor((Math.random() * allMusic.length) + 1);
            do{
                randIndex = Math.floor((Math.random() * allMusic.length) + 1);
            } while(musicIndex == randIndex);
            musicIndex = randIndex;
            loadMusic(musicIndex);
            playMusic();
            break;
    }
})

// Show list of music when playlist button (more music) is clicked

moreMusicBtn.addEventListener("click", () =>{
    musicList.classList.toggle("show");
})

closeMoreMusic.addEventListener("click", ()=> {
    moreMusicBtn.click();
})

// creating li tag according to the music-list.js

const ulTag = container.querySelector("ul");

// let create li tags according to array lenght for list

for (let i = 0; i < allMusic.length; i++) {
    let liTag = `<li li-index="${i + 1}">
    <div class="row">
      <span>${allMusic[i].name}</span>
      <p>${allMusic[i].artist}</p>
    </div>
    <audio class="${allMusic[i].src} " src="songs/${allMusic[i].src}.mp3"></audio>
    <span id="${allMusic[i].src}" class="audio-duration">1:45</span>
  </li>`;
  ulTag.insertAdjacentHTML("beforeend", liTag);

  let liAudioDurationTag = ulTag.querySelector(`#${allMusic[i].src}`);
  let liAudioTag = ulTag.querySelector(`.${allMusic[i].src}`);

  liAudioTag.addEventListener("loadeddata", () => {
    let duration = liAudioTag.duration;
    let totalMin = Math.floor(duration / 60);
    let totalSec = Math.floor(duration % 60);
    if (totalSec < 10) { //if sec is less than 10 then add 0 before it
        totalSec = `0${totalSec}`;
    }

    liAudioDurationTag.innerText = `${totalMin}:${totalSec}`;
    // adding t-duration attribute with total duration value
    liAudioDurationTag.setAttribute("t-duration", `${totalMin}:${totalSec}`);
  });

}


const allLiTags = ulTag.querySelectorAll("li");

function playingSong() {
    for (let j = 0; j < allLiTags.length; j++) {
   let audioTag = allLiTags[j].querySelector(".audio-duration");
        // let remove playing class from all other li expect the last one which is clicked
        if(allLiTags[j].classList.contains("playing")){
            allLiTags[j].classList.remove("playing");
        //  let's get that audio duration value and pass to .audio-duration innertext
        let adDuration = audioTag.getAttribute("t-duration");
        audioTag.innerText = adDuration;
        }
    
        // if there is an li tag which li index is equal to musicIndex
        // then this music is playing now and we'll style it
    
        if(allLiTags[j].getAttribute("li-index") == musicIndex){
            allLiTags[j].classList.add("playing");
            audioTag.innerText = "Playing";
        }
    
        // adding on click attribute in all li tags
        allLiTags[j].setAttribute("onclick", "clicked(this)");
    }
}

// lets play song on click li 
function clicked(element){

    // getting li index of particular clicked li tag
    let getLiIndex = element.getAttribute("li-index");
    musicIndex =  getLiIndex; //passing that liindex to musicIndex
    loadMusic(musicIndex);
    playMusic(); 
    playingSong();
   
}

// random music player themes on reload


$( document ).ready(function() {
    var colors = [
      "a",
      "b",
      "c",
      "d",
      "e",
      "f",
      "g",
      "h",
      "i",
      "j",
      "k",
    ];
    var randomIndex = Math.floor(Math.random() * colors.length);
    $(".container").addClass(colors[randomIndex]);
    $("body").addClass(colors[randomIndex]);
});