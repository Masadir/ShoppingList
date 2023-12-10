import { useState } from "react";
import axios from "axios";
import { useGetUserID } from "../hooks/useGetUserID.js";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import {useTranslation} from 'react-i18next';

export const CreateList = () => {
  const userID = useGetUserID();
  const [cookies, _] = useCookies(["access_token"]);
  const {t} = useTranslation();

  const [list, setList] = useState({
    name: "",
    items: [],
    userOwner: userID,
  });

  const navigate = useNavigate();

  const handleChange = (event) => {
    const { name, value } = event.target;
    setList({ ...list, [name]: value });
  };

  const handleItemChange = (event, idx) => {
    const { value } = event.target;
    const items = list.items;
    items[idx] = value;
    setList({ ...list, items });
  };

  const addItem = () => {
    setList({ ...list, items: [...list.items, ""] });
  };

  const isValidList = () => {
    if (!list.name || list.name.length > 255) {
      alert("Invalid list name. Please provide a valid name.");
      return false;
    }

    for (const item of list.items) {
      if (!item || item.length > 255) {
        alert("Invalid item. Each item should have a valid name.");
        return false;
      }
    }

    return true;
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    if (!isValidList()) {
      return;
    }

    try {
      await axios.post("http://localhost:3001/lists", list, {
        headers: { authorization: cookies.access_token },
      });
      alert("List Created");
      navigate("/");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="create-list">
      <h2>{t('Create List')}</h2>
      <form onSubmit={onSubmit}>
        <label htmlFor="name">{t('Name')}</label>
        <input type="text" id="name" name="name" onChange={handleChange} />
        <label htmlFor="items">{t('Items')}</label>
        {list.items.map((item, idx) => (
          <input
            key={idx}
            type="text"
            name="items"
            value={item}
            onChange={(event) => handleItemChange(event, idx)}
          />
        ))}
        <button onClick={addItem} type="button">
          {t('Add Item')}
        </button>
        <button type="submit">{t('Finish List')}</button>
      </form>
    </div>
  );
};
