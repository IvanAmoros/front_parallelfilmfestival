import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { format, parse, intervalToDuration, isValid } from 'date-fns';
import './WorksDisplay.css';

const WorksDisplay = () => {
  const [works, setWorks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showJSON, setShowJSON] = useState(false);

  const apiUrl = process.env.REACT_APP_API_URL + '/base/works/';

  useEffect(() => {
    const fetchWorks = async () => {
      try {
        const response = await axios.get(`${apiUrl}`);
        setWorks(response.data);
      } catch (error) {
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchWorks();
  }, [apiUrl]);

  const parseDate = (dateString) => {
    return parse(dateString, "dd/MM/yyyy", new Date());
  };

  const formatDate = (date) => {
    if (!date) return ''; // Return an empty string or any default value for invalid/empty dates
    const parsedDate = parseDate(date);
    return isValid(parsedDate) ? format(parsedDate, 'MMM yyyy') : 'Invalid date';
  };

  const formatDuration = (fromDate, toDate) => {
    if (!fromDate) return '';
    const start = parseDate(fromDate);
    const end = toDate ? parseDate(toDate) : new Date(); // Use current date if 'toDate' is null or invalid
    if (!isValid(start) || (toDate && !isValid(end))) {
      return 'Invalid duration'; // Handle invalid dates
    }
    const { years, months } = intervalToDuration({ start, end });
    let formattedDuration = '';
    if (years) formattedDuration += `${years} yrs `;
    if (months) formattedDuration += `${months} mos`;
    return formattedDuration.trim();
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  const toggleView = () => setShowJSON(!showJSON);

  if (showJSON) {
    return (
      <div className="skills-display">
        <h2>Work Experience</h2>
        <button onClick={toggleView}>Show Styled View</button>
        <h3>GET {apiUrl}</h3>
        <pre className="json-display">{JSON.stringify(works, null, 2)}</pre>
      </div>
    );
  }

  return (
    <div className="works-display">
      <h2>Work Experience</h2>
      <button onClick={toggleView}>Show Backend response</button>
      {works.map((work) => (
        <div key={work.id} className="work-item">
          <h3>{work.company}</h3>
          <p>{work.position}</p>
          <p className="dates">
            {formatDate(work.from_date)} - {work.current_work ? 'Present' : formatDate(work.to_date)}
            {` · ${formatDuration(work.from_date, work.current_work ? null : work.to_date)}`}
          </p>
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
