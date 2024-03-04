import React, { useState, useEffect } from "react";
import axios from "axios";
import "./StudiesDisplay.css";

const StudiesDisplay = () => {
  const [studies, setStudies] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const apiUrl = process.env.REACT_APP_API_URL;

  useEffect(() => {
    const fetchStudies = async () => {
      try {
        const response = await axios.get(`${apiUrl}/base/studies/`);
        setStudies(response.data);
      } catch (error) {
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStudies();
  }, [apiUrl]);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="studies-display">
      <h2>My Studies</h2>
      {studies.map((study) => (
        <div key={study.id} className="study-item">
          <h3>{study.center}</h3>
          <div className="dates">
            {study.from_date} - {study.current ? "Present" : study.to_date}
          </div>
          <h4>{study.tittle}</h4>
          <p className="description">{study.description}</p>
          <h4>Skills:</h4>
          <div className="skills">
            {study.skills.map((skill) => (
              <span key={skill.id} className="skill-tag">
                #{skill.name}
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default StudiesDisplay;
