import {Link} from "react-router-dom";
import {useCookies} from "react-cookie";
import {useNavigate} from "react-router-dom";
import React from 'react';
import {useTranslation} from 'react-i18next';

export const Navbar = () => {
    const [cookies, setCookies] = useCookies(["access_token"]);
    const navigate = useNavigate();
    const {i18n} = useTranslation();
    const {t} = useTranslation();

    const logout = () => {
        setCookies("access_token", "");
        window.localStorage.removeItem("userID");
        navigate("/authorization");
    }

    const changeLanguage = (lng) => {
        i18n.changeLanguage(lng);
    };

    return (
        <div className="navbar">
            <button onClick={() => changeLanguage('en')}>English</button>
            <button onClick={() => changeLanguage('cs')}>Čeština</button>
            <Link to="/"> {t('Home')} </Link>
            <Link to="/create-list"> {t('Create List')} </Link>
            {!cookies.access_token ? (
                <Link to="/authorization"> {t('Authorization')} </Link>
            ) : (
                <>
                <Link to="/lists"> {t('Archive')} </Link>
                <button onClick={logout}> {t('Logout')} </button>
                </>
            )}            
        </div>
    );
};