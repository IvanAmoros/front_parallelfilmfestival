import React, { useState, useEffect } from 'react';
import axios from 'axios';


const SkillManagement = () => {
    const [categories, setCategories] = useState([]);
    const [editCategoryId, setEditCategoryId] = useState(null);
    const [newName, setNewName] = useState("");


    useEffect(() => {
        const fetchCategories = async () => {
            const apiUrl = process.env.REACT_APP_API_URL + '/base/skills/';
            try {
                const response = await axios.get(apiUrl);
                setCategories(response.data);
            } catch (error) {
                console.error('There was an error fetching the categories: ', error);
            }
        };

        fetchCategories();
    }, []);

    const handleEditClick = (categoryId, currentName) => {
        setEditCategoryId(categoryId);
        setNewName(currentName);
    };

    const handleNameChange = (event) => {
        setNewName(event.target.value);
    };

    const handleSaveClick = async (categoryId) => {
      const apiUrl = `${process.env.REACT_APP_API_URL}/base/categories/${categoryId}/`;
      const token = localStorage.getItem('accessToken');
  
      try {
          await axios.patch(apiUrl, { name: newName }, {
              headers: {
                  'Authorization': `Bearer ${token}`
              }
          });
          setCategories(categories.map(category => {
              if (category.id === categoryId) {
                  return { ...category, name: newName };
              }
              return category;
          }));
          setEditCategoryId(null); // Exit edit mode
      } catch (error) {
          console.error('There was an error updating the category name: ', error);
      }
  };
  

    return (
        <div>
            {categories.map(category => (
                <div key={category.id}>
                    {editCategoryId === category.id ? (
                        <>
                            <input type="text" value={newName} onChange={handleNameChange} />
                            <button onClick={() => handleSaveClick(category.id)}>Save</button>
                        </>
                    ) : (
                        <>
                            <h4>{category.name}</h4>
                            <button onClick={() => handleEditClick(category.id, category.name)}>Edit</button>
                        </>
                    )}
                </div>
            ))}
        </div>
    );
};

export default SkillManagement;
