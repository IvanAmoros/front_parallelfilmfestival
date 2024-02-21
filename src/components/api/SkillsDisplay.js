// SkillsDisplay.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './SkillsDisplay.css'; 

const SkillsDisplay = () => {
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const apiUrl = process.env.REACT_APP_API_URL;

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const response = await axios.get(`${apiUrl}/base/skills/`);
        setCategories(response.data);
      } catch (error) {
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSkills();
  }, [apiUrl]); // This effect doesn't depend on dynamic values

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h2>Skills</h2>
      {categories.map((category) => (
        <div key={category.id}>
          <h3>{category.name}</h3>
          <ul>
            {category.skills.map((skill) => (
              <li key={skill.id}>
                <h5>{skill.name}</h5>
                <h5>{skill.rating}</h5>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default SkillsDisplay;
