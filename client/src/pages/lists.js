import {useEffect, useState} from "react";
import axios from "axios";
import {useGetUserID} from "../hooks/useGetUserID.js";
import {useTranslation} from 'react-i18next';

export const SavedLists = () => {

    const [savedLists, setSavedLists] = useState([]);
    const userID = useGetUserID();
    const {t} = useTranslation();

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
          <h1>{t('Archive')}</h1>
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