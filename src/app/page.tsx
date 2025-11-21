"use client";

import { useState } from "react";
import Link from "next/link";
import { CoffeeMug, Ruler, Pencil1, Pencil2, Compass, Triangle } from "@/components/ui/Decorations";

export default function Home() {
  const [showSetup, setShowSetup] = useState(false);
  const [architectName, setArchitectName] = useState("");
  const [cityName, setCityName] = useState("");

  return (
    <div className="flex items-center justify-center relative min-h-screen max-h-screen overflow-hidden">
      <Ruler />
      <CoffeeMug />
      <Pencil1 />
      <Pencil2 />
      <Compass />
      <Triangle />

      <div className="zoom-container flex flex-row items-center gap-6 z-20 w-full h-full p-6 justify-center max-w-[1800px]">
        

        <div className="w-[400px] shrink-0 h-[600px] shadow-2xl relative transform -rotate-2 rounded-l-lg border-l-8 border-gray-300 flex flex-col notebook-closed">
          <div className="absolute -left-7 top-0 bottom-0 w-10 flex flex-col justify-evenly z-10">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="w-8 h-3 bg-gray-600 rounded-full mb-2 ml-2 ring-1 ring-black"></div>
            ))}
          </div>

          <div className="flex flex-col items-center h-full text-white opacity-80 pt-[180px]">
            <h2 className="text-5xl font-bold tracking-widest font-['Rock_Salt']">PLANY</h2>
            <p className="mt-2 text-2xl opacity-70 font-['Patrick_Hand']">Tajne projekty</p>
          </div>
        </div>

        <div className="relative">
          <div className="tape" style={{top: '-15px', left: '-30px', transform: 'rotate(-45deg)'}}></div>
          <div className="tape" style={{top: '-15px', right: '-30px', transform: 'rotate(45deg)'}}></div>
          <div className="tape" style={{bottom: '-15px', left: '-30px', transform: 'rotate(45deg)'}}></div>
          <div className="tape" style={{bottom: '-15px', right: '-30px', transform: 'rotate(-45deg)'}}></div>

          <div className="graph-paper p-16 w-[750px] h-[900px] relative flex flex-col items-center shadow-2xl">
            {!showSetup && (
              <div className="w-full h-full flex flex-col items-center justify-center transition-opacity duration-500">
                <div className="mb-12 text-center transform -rotate-2">
                  <h1 className="text-7xl font-bold game-logo mb-6">Rolling Village</h1>
                  <p className="text-3xl text-gray-500 font-['Patrick_Hand']">Zaplanuj przestrzeń swojego miasta</p>
                </div>

                <div className="flex flex-col items-center w-full max-w-md space-y-4">
                  <button 
                    onClick={() => setShowSetup(true)} 
                    className="menu-btn font-bold text-4xl py-4 px-8 border-4 hover:bg-yellow-50 shadow-md"
                  >
                    Zacznij grę!
                  </button>
                  <button className="menu-btn">Instrukcja</button>
                  <button className="menu-btn">O grze</button>
                  <button className="menu-btn">Ustawienia</button>
                </div>
                
                <div className="mt-auto text-gray-400 text-sm font-mono">v0.1.0 Prototyp</div>
              </div>
            )}

            {showSetup && (
              <div className="w-full h-full flex flex-col items-center justify-center fade-in">
                <div className="w-full max-w-md">
                  <h2 className="text-4xl font-['Rock_Salt'] text-center mb-12 text-gray-800">Wniosek o pozwolenie</h2>
                  
                  <div className="mb-8">
                    <label className="block text-gray-500 text-xl mb-2 font-['Patrick_Hand'] text-center">
                      Imię Głównego Architekta:
                    </label>
                    <input 
                      type="text" 
                      className="sketch-input" 
                      placeholder="np. Jan Kowalski" 
                      value={architectName}
                      onChange={(e) => setArchitectName(e.target.value)}
                    />
                  </div>

                  <div className="mb-12">
                    <label className="block text-gray-500 text-xl mb-2 font-['Patrick_Hand'] text-center">
                      Nazwa Projektowanego Miasta:
                    </label>
                    <input 
                      type="text" 
                      className="sketch-input" 
                      placeholder="np. Słoneczna Dolina" 
                      value={cityName}
                      onChange={(e) => setCityName(e.target.value)}
                    />
                  </div>

                  <Link 
                    href={{
                      pathname: "/play/single",
                      query: { architect: architectName, city: cityName }
                    }}
                  >
                    <button className="menu-btn font-bold text-3xl border-4 hover:bg-green-50 mx-auto block">
                      Zatwierdź
                    </button>
                  </Link>
                  <button 
                    onClick={() => setShowSetup(false)} 
                    className="block mx-auto mt-4 text-gray-400 underline hover:text-gray-600 font-['Patrick_Hand']"
                  >
                    Anuluj
                  </button>
                </div>
              </div>
            )}

          </div>
        </div>

        <div className="w-64"></div>

      </div>
    </div>
  );
}
