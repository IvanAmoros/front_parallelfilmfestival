import React, { useState, useEffect } from "react";
import axios from "axios";
import "./SkillsDisplay.css";
import { useAuth } from '../../AuthContext';
import { Link } from 'react-router-dom';

const SkillsDisplay = () => {
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showJSON, setShowJSON] = useState(false);
  const { user } = useAuth();

  const apiUrl = process.env.REACT_APP_API_URL + '/base/skills/';

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const response = await axios.get(`${apiUrl}`);
        setCategories(response.data);
      } catch (error) {
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSkills();
  }, [apiUrl]);

  const toggleView = () => setShowJSON(!showJSON);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  if (showJSON) {
    return (
      <div className="skills-display">
        <h2>My Skills</h2>
        <button onClick={toggleView}>Show Styled View</button>
        <h3>GET {apiUrl}</h3>
        <pre className="json-display">{JSON.stringify(categories, null, 2)}</pre>
      </div>
    );
  }

  return (
    <div className="skills-display">
      <h2>My Skills {user?.is_superuser && <Link to="/edit-skills">Edit</Link>}</h2>
      <button onClick={toggleView}>Show Backend response</button>
      {categories.map((category) => (
        <div key={category.id} className="category-item">
          <h3>{category.name}</h3>
          <ul className="skills-list">
            {category.skills.map((skill) => (
              <div key={skill.id} className="skill-item">
                <div className="skill-content">
                  <span className="skill-name">{skill.name}</span>
                  <div className="skill-progress-container">
                    <div className="skill-progress" style={{
                      '--progress-width': `${(skill.rating / 5) * 100}%`,
                      animation: 'fillBar 2s ease-out forwards'
                    }}></div>
                  </div>
                </div>
              </div>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default SkillsDisplay;
