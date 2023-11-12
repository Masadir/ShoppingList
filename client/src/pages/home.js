import React, {useEffect, useState} from "react";
import axios from "axios";
import {useGetUserID} from "../hooks/useGetUserID.js";
import {useCookies} from "react-cookie";
import {useNavigate} from "react-router-dom";

export const Home = () => {
    const [lists, setLists] = useState([]);
    const [savedLists, setSavedLists] = useState([]);
    const [selectedList, setSelectedList] = useState(null);
    const [cookies, _] = useCookies(["access_token"]);
    const userID = useGetUserID();
    const navigate = useNavigate();
    

    useEffect(() => {
        const fetchLists = async () => {
            try {
                const response = await axios.get("http://localhost:3001/lists");
                setLists(response.data);
            } catch (err) {
                console.error(err);
            }
        };

        const fetchSavedLists = async () => {
            try {
                const response = await axios.get(`http://localhost:3001/lists/savedLists/ids/${userID}`);
                setSavedLists(response.data.savedLists);
            } catch (err) {
                console.error(err);
            }
        };

        fetchLists();
        if (cookies.access_token) fetchSavedLists();
    }, [cookies.access_token, userID]);

    const saveList = async (listID) => {
        try {
            const response = await axios.put(
                "http://localhost:3001/lists",
                { listID, userID },
                { headers: { authorization: cookies.access_token } }
            );
            setSavedLists(response.data.savedLists);
            navigate("/lists");
        } catch (err) {
            console.error(err);
        }
    };

    const deleteList = async (listID) => {
        try {
            const confirmation = window.confirm("Are you sure you want to delete this list?");
            if (!confirmation) {
                return;
            }
            await axios.delete(`http://localhost:3001/lists/${listID}`, {
                headers: { authorization: cookies.access_token },
            });
            navigate("/lists");
        } catch (err) {
            console.error(err);
        }
    };

    const isListSaved = (id) => savedLists.includes(id);

    const handleListClick = async (listID) => {
        try {
            const response = await axios.get(`http://localhost:3001/lists/${listID}`);
            setSelectedList(response.data);
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div>
            {selectedList ? (
                <div>
                    <h2>{selectedList.name}</h2>
                    <ul>
                        {selectedList.items.map((item, index) => (
                            <li key={index}>
                                <div>
                                    <p>{item}</p>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            ) : (
                <div>
                    <h1>Lists</h1>
                    <ul>
                        {lists.map((list) => (
                            <li key={list._id} onClick={() => handleListClick(list._id)} style={{ cursor: "pointer" }}>
                                <div>
                                    <h2>{list.name}</h2>
                                    <div className="items">
                                        {list.items.map((item, index) => (
                                            <p key={index}>{item}</p>
                                        ))}
                                    </div>
                                    <button onClick={() => saveList(list._id)} disabled={isListSaved(list._id)}>
                                        {isListSaved(list._id) ? "Saved" : "Save"}
                                    </button>
                                    <button onClick={() => deleteList(list._id)}>Delete</button>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};
