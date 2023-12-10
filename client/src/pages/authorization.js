import {useState} from "react";
import axios from "axios";
import {useCookies} from "react-cookie";
import {useNavigate} from "react-router-dom";
import {useTranslation} from 'react-i18next';

export const Authorization = () => {
    return (
        <div className="authorization"> 
            <Login />
            <Register />
        </div>
    );
};

const Login = () => {

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const [_, setCookies] = useCookies(["access_token"])

    const navigate = useNavigate();

    const {t} = useTranslation();

    const onSubmit = async (event) => {
        event.preventDefault();

        try {
            const response = await axios.post("http://localhost:3001/authorization/login", {
                username,
                password,
            });

            setCookies("access_token", response.data.token);
            window.localStorage.setItem("userID", response.data.userID);
            navigate("/");

        } catch (err) {
            console.error(err);
        }
    }

    return (
        <Form 
            username={username} 
            setUsername={setUsername} 
            password={password} 
            setPassword={setPassword}
            label={t('Login')}
            onSubmit={onSubmit}
        />
    );
};

const Register = () => {

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const {t} = useTranslation();

    const onSubmit = async (event) => {
        event.preventDefault();
        try {
            await axios.post("http://localhost:3001/authorization/register", {
                username,
                password,
            });
            alert("Registration Completed!");
        } catch (err) {
            console.error(err);
        }
    }

    return (
        <Form 
            username={username} 
            setUsername={setUsername} 
            password={password} 
            setPassword={setPassword}
            label={t('Register')}
            onSubmit={onSubmit}
        />
    );
};

const Form = ({username, setUsername, password, setPassword, label, onSubmit}) => {
    const {t} = useTranslation();
    return (
    <div className="authorization-container">
        <form onSubmit={onSubmit}>
            <h2> {label} </h2>
            <div className="form-group">
                <label htmlFor="username"> {t('Username')} </label>
                <input 
                    type="text" 
                    id="username" 
                    value={username}
                    onChange={(event) => setUsername(event.target.value)}/>
            </div>
            <div className="form-group">
                <label htmlFor="password"> {t('Password')} </label>
                <input 
                    type="password" 
                    id="password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}/>
            </div>

            <button type="submit"> {label} </button>
        </form>
    </div>
    );
};