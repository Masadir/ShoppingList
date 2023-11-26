import React, {useEffect, useState} from "react";
import axios from "axios";
import {useGetUserID} from "../hooks/useGetUserID.js";
import {useCookies} from "react-cookie";
import {useNavigate} from "react-router-dom";

export const Home = () => {
    const [lists, setLists] = useState([]);
    const [savedLists, setSavedLists] = useState([]);
    const [selectedList, setSelectedList] = useState(null);
    const [editingListId, setEditingListId] = useState(null);
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

    const handleEditClick = (listId) => {
        setEditingListId(listId);
    };

    const handleCancelEdit = () => {
        setEditingListId(null);
    };

    const handleSaveEdit = async (listId, updatedItems) => {
        try {
            await axios.put(`http://localhost:3001/lists/${listId}`, { items: updatedItems }, {
                headers: { authorization: cookies.access_token },
            });
            navigate("/lists");
            setEditingListId(null);
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
                    <li>
                        <div>
                            <h2 key={list._id} onClick={() => handleListClick(list._id)} style={{ cursor: "pointer" }}>{list.name}</h2>
                            <h4>{list.userOwner}</h4>
                            {editingListId === list._id ? (
                                <EditListForm
                                    items={list.items}
                                    onCancel={handleCancelEdit}
                                    onSave={(updatedItems) => handleSaveEdit(list._id, updatedItems)}
                                />
                            ) : (
                                <div className="items">
                                    {list.items.map((item, index) => (
                                        <p key={index}>{item}</p>
                                    ))}
                                </div>
                            )}
                            <button onClick={() => saveList(list._id)} disabled={isListSaved(list._id)}>
                                {isListSaved(list._id) ? "Saved" : "Save"}
                            </button>
                            <button onClick={() => deleteList(list._id)}>Delete</button>
                            <button onClick={() => handleEditClick(list._id)}>Edit</button>
                        </div>
                    </li>
                ))}
            </ul>
                </div>
            )}
        </div>
    );
};

const EditListForm = ({ items, onCancel, onSave }) => {
    const [editedItems, setEditedItems] = useState([...items]);

    const handleItemChange = (index, newValue) => {
        const newItems = [...editedItems];
        newItems[index] = newValue;
        setEditedItems(newItems);
    };

    return (
        <div>
            <h3>Edit List</h3>
            {editedItems.map((item, index) => (
                <input
                    key={index}
                    type="text"
                    value={item}
                    onChange={(e) => handleItemChange(index, e.target.value)}
                />
            ))}
            <button onClick={onCancel}>Cancel</button>
            <button onClick={() => onSave(editedItems)}>Save</button>
        </div>
    );
};
