import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './WorksDisplay.css';

const WorksDisplay = () => {
  const [works, setWorks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const apiUrl = process.env.REACT_APP_API_URL;

  useEffect(() => {
	const fetchWorks = async () => {
	  try {
		const response = await axios.get(`${apiUrl}/base/works/`);
		setWorks(response.data);
	  } catch (error) {
		setError(error.message);
	  } finally {
		setIsLoading(false);
	  }
	};

	fetchWorks();
  }, [apiUrl]);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
	<div className="works-display">
	  <h2>Work Experience</h2>
	  {works.map((work) => (
		<div key={work.id} className="work-item">
		  <h3>{work.company}</h3>
		  <p>{work.position}</p>
		  <p className="dates">{work.from_date} - {work.current_work ? 'Present' : work.to_date}</p>
		  <h4>Job Tasks:</h4>
		  <ul>
			{work.job_tasks.map((task, index) => (
			  <li key={index}><span className="task-title">{task.title}:</span> {task.description}</li>
			))}
		  </ul>
		  <h4>Skills:</h4>
		  <div className="skills">
			{work.skills.map((skill) => (
			  <span key={skill.id} className="skill-tag">#{skill.name}</span>
			))}
		  </div>
		</div>
	  ))}
	</div>
  );
};

export default WorksDisplay;
