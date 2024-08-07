import { useContext, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import NavContext from "../contexts/NavContext";

import { logo, deckIcon, bracketIcon } from "../images/";
import BracketIcon from "../images/BracketIcon";
import DeckIcon from "../images/DeckIcon";
import AboutIcon from "../images/AboutIcon";
import TopdeckIcon from "../images/TopdeckIcon";
import ThemeSwitcher from "./ThemeSwitcher/ThemeSwitcher";

export default function Nav() {
  const {open, toggle, setOpen} = useContext(NavContext)
  const navRef = useRef(null)

  useEffect(() => {
    const handleClick = (e) => {
      // console.log(navRef.current, "click")
      if(navRef.current && !navRef.current.contains(e.target))
        setOpen(false)
    }

    window.addEventListener('mousedown', handleClick);
  
    return () => {
      window.removeEventListener('mousedown', handleClick);
    }
  }, [])



  return (
    <div className={`fixed ${open ? "w-[200px] " : 'w-0 md:w-[200px]'} md:static flex flex-col items-center justify-start min-h-screen md:w-1/8 overflow-hidden bg-white dark:bg-nav drop-shadow-nav z-[100] transition-all duration-200`} ref={navRef}>
      <div className={`${open ? "block opacity-1" : "opacity-0 md:opacity-100"} mt-6`}>
        <ThemeSwitcher />
      </div>
      <div className="flex flex-col md:items-start mt-12 space-y-16 text-voilet dark:text-white [&>*>*>img]:w-8">
        <span className="flex flex-col gap-4">
          <Link to="/" className="flex flex-row items-center gap-2 [&_path]:fill-voilet [&_path]:dark:fill-white">
            <DeckIcon />
            <span className={`md:block ${!open && "hidden"}`}>Decks</span>
          </Link>
        </span>
        <span>
          <Link to="/tournaments" className="flex flex-row items-center gap-2 [&_path]:fill-voilet [&_path]:dark:fill-white">
            <BracketIcon  />
            <span className={`md:block ${!open && "hidden"}`}>Tournaments</span>
          </Link>
        </span>
        <span>
          <Link to="/about" className="flex flex-row items-center gap-2 [&_path]:fill-voilet [&_path]:dark:fill-white">
            <AboutIcon  />
            <span className={`md:block ${!open && "hidden"}`}>About</span>
          </Link>
        </span>
        <span>
          <a href="https://topdeck.gg/" target="_blank" className="flex flex-row items-center gap-2 [&_path]:fill-voilet [&_path]:dark:fill-white">
            <TopdeckIcon  />
            <span className={`md:block ${!open && "hidden"}`}>TopDeck.gg</span>
          </a>
        </span>
      </div>
    </div>
  );
}
