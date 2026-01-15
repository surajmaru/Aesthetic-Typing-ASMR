import { useEffect, useState, useRef } from 'react'
import './App.css'

function App() {
  const [text, setText] = useState([]);
  const [fade, setFade] = useState(false);


//
const typeSound = new Audio("/mixkit-single-key-type-2533.wav");
const typeSound2 = new Audio("/mixkit-hard-single-key-press-in-a-laptop-2542.wav");
typeSound.volume = 0.35;
typeSound.preload = "auto";
typeSound2.volume = 0.15;
typeSound2.preload = "auto";

function playTypeSound() {
  typeSound.currentTime = 0.08;
  typeSound.play();
}
function playTypeSound2() {
  typeSound2.currentTime = 0.1;
  typeSound2.play();
}

//BG Audio change.
const rainSound = useRef(null);
const [mute, setmute] = useState(false);
const [rainStarted, setRainStarted] = useState(false);
const [bgAudio, setBgAudio] = useState("/bg-rain.mp3");

  useEffect(() => {
  if (!bgAudio) return;

  // stop old audio
  if (rainSound.current) {
    rainSound.current.pause();
  }

  const audio = new Audio(bgAudio);
  audio.loop = true;
  audio.volume = 0.3;

  rainSound.current = audio;
  audio.play();
  // if (!mute && !rainStarted) {
  //   audio.play().catch(() => {});
  // }

  return () => {
    audio.pause();
  };
}, [bgAudio]);

// mute/unmute logic
function handleMute(){
  setmute(prev => {
    const newMute = !prev;
    if (newMute) {
      rainSound.current.play();
    } else {
      rainSound.current.pause();
    }
    return newMute;
  });
}

//

// function handleMute() {
//   setmute(prev => {
//     const next = !prev;

//     if (rainSound.current) {
//       next ? rainSound.current.pause() : rainSound.current.play();
//     }

//     return next;
//   });
// }

//

useEffect(() => {
function handleKey(e) {
  
  // if (!rainStarted) {
  //   setmute(true);
  //   rainSound.current.play().catch(() => {
  //     console.log("Rain sound blocked, will play on next interaction");
  //   });
  //   setRainStarted(true);
  // }
  if (!rainStarted) {
      setRainStarted(true);
      setmute(true);

      if (!mute && rainSound.current) {
        rainSound.current.play().catch(() => {});
      }
    }

  if (e.key === "Backspace") {
    playTypeSound2();
    setText(prev => prev.slice(0, -1));
    return;
  }

  if (e.key === "Enter") {
    e.preventDefault();
    setText(prev => [...prev, "\n"]);
    playTypeSound2();
    return;
  }
  if (e.key === " ") {
    playTypeSound2();
    e.preventDefault();
    setText(prev => [...prev, " "]);
    return;
  }
  if(e.key === "Escape"){
    setFade(true);
    setTimeout(() => {
      setText([]);
      setFade(false);
    }, 300);
    return;
  }

  if (e.key.length > 1) return;

  playTypeSound();
  setText(prev => [...prev, e.key]);
  
}
  window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
}, [rainStarted,mute]);


//BG theme change.
const [videoVisible, setVideoVisible] = useState(false);
const [theme, setTheme] = useState("/bg.mp4")

function handleTheme(video,audio){
  setTheme(video);
  setBgAudio(audio);
}


return (
  <>
  <div className='top-div'>
    <a href='https://suraj-dev.vercel.app/' target='_blank'><img className='self-img' src='/self.png' /></a>
  
  <button className='btn-mute' onClick={handleMute}> <img
    src={mute ? "/unmute.png" : "/sound-off.png"}
    alt="mute toggle"
    className="w-5 h-5"
  /> </button>

  <div className='top-div-inner'>
    <button className='btn-mute b1' onClick={() => handleTheme("/bg.mp4", "/bg-rain.mp3")}>Theme 1</button>
    <button className='btn-mute b2' onClick={() => handleTheme("/bg2.mp4", "/bg-rain2.mp3")}>Theme 2</button>
    <button className='btn-mute b3' onClick={() => handleTheme("/bg3.mp4", "/bg-rain3.mp3")}>Theme 3</button>
  </div>
  </div>
  <div className="h-screen w-screen relative overflow-hidden text-6xl">

    {/* VIDEO BACKGROUND */}
    <video
      key={theme}
      autoPlay
      loop
      muted
      playsInline
      onLoadedData={() => setVideoVisible(true)}
      className={`fixed top-0 left-0 w-full h-full object-cover -z-10 
         transition-all duration-1000 ease-out
        ${videoVisible
        ? "opacity-40 scale-100"
        : "opacity-0 scale-105"} blur-[2px]`}
      >
      <source src={theme} type="video/mp4" />
      </video>

    {/* TYPING AREA */}
    <div
      className={`absolute inset-0 flex justify-center items-center p-10 text-white font-mono whitespace-pre-wrap transition-opacity duration-300 ${fade ? "opacity-0" : "opacity-100"}`}
    >
      <div>
        {text.length === 0 && "START TYPING..."}
        {text.map((char, i) =>
          char === "\n" ? (
            <br key={i} />
          ) : (
            <span
              key={i}
              className="inline-block animate-[pop_0.3s_ease-out] drop-shadow-[0_0_10px_white]"
            >
              {char}
            </span>
          )
        )}
        {text.length > 0 && (
          <span className="inline-block animate-pulse mb-3">|</span>
        )}
      </div>
    </div>

  </div>
  </>
)
}

export default App
