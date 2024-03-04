import React, { useState, useEffect } from "react";
import axios from "axios";
import "./SkillsDisplay.css";
import { useAuth } from '../../AuthContext';
import { Link } from 'react-router-dom';

const SkillsDisplay = () => {
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth(); // Use useAuth to access the current user state

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
  }, [apiUrl]);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="skills-display">
      <h2>My Skills {user?.is_superuser && <Link to="/edit-skills">Edit</Link>}</h2>
      {categories.map((category) => (
        <div key={category.id} className="category-item">
          <h3>{category.name}</h3>
          <ul className="skills-list">
            {category.skills.map((skill) => (
              <li key={skill.id} className="skill-item">
                <div className="skill-content">
                  <span className="skill-name">{skill.name}</span>
                  <span className="skill-rating">{skill.rating}</span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default SkillsDisplay;
