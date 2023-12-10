import './App.css';
import {BrowserRouter as Router, Routes, Route} from "react-router-dom";
import {Home} from "./pages/home.js";
import React, {useState} from 'react';
import {Authorization} from "./pages/authorization.js";
import {CreateList} from "./pages/create-list.js";
import {SavedLists} from "./pages/lists.js";
import {Navbar} from "./components/navbar.js";
import i18n from 'i18next';
import {initReactI18next} from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import translationEN from './locales/en/translation.json';
import translationCS from './locales/cs/translation.json';
import {useTranslation} from 'react-i18next';

i18n
  .use(initReactI18next)
  .use(LanguageDetector)
  .init({
    resources: {
      en: { translation: translationEN },
      cs: { translation: translationCS },
    },
    fallbackLng: 'en',
    debug: true,
    interpolation: {
      escapeValue: false,
    },
  });

function App() {

const [isDarkMode, setIsDarkMode] = useState(false);
const {t} = useTranslation();

const toggleDarkMode = () => {
    setIsDarkMode((prevMode) => !prevMode);
};

  return (
    <div className={isDarkMode ? 'dark-mode App' : 'light-mode App'}>
      <Router> 
        <Navbar toggleDarkMode={toggleDarkMode}/>
        <button onClick={toggleDarkMode}>{t('Dark Mode')}</button>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/authorization" element={<Authorization />} />
          <Route path="/create-list" element={<CreateList />} />
          <Route path="/lists" element={<SavedLists />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
