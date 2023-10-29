import {useEffect, useState} from "react";
import axios from "axios";
import {useGetUserID} from "../hooks/useGetUserID.js";

export const SavedLists = () => {

    const [savedLists, setSavedLists] = useState([]);

    const userID = useGetUserID();

    useEffect(() => {

        const fetchSavedLists = async () => {
            try {
                const response = await axios.get(`http://localhost:3001/lists/savedLists/${userID}`);
                setSavedLists(response.data.savedLists); 
            } catch (err) {
                console.error(err);
            }
        };

        fetchSavedLists();

    }, []);

    return (
        <div>
          <h1>Archive</h1>
          <ul>
            {savedLists.map((list) => (
              <li key={list._id}>
                <div>
                  <h2>{list.name}</h2>
                  <div className="items">
                    {list.items.map((item, index) => (
                      <p key={index}>{item}</p>
                    ))}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      );
};