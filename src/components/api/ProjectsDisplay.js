import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, CardContent, Typography, CircularProgress, Chip, Grid, CardMedia } from '@mui/material';
import "./ProjectsDisplay.css";

const ProjectsDisplay = () => {
    const [projects, setProjects] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const apiUrl = process.env.REACT_APP_API_URL;

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const response = await axios.get(`${apiUrl}/base/projects/`);
                setProjects(response.data);
            } catch (error) {
                setError(error.message);
            } finally {
                setIsLoading(false);
            }
        };

        fetchProjects();
    }, [apiUrl]);

    if (isLoading) return <CircularProgress />;
    if (error) return <Typography color="error">{`Error: ${error}`}</Typography>;

    return (
        <Grid container spacing={2} borderRadius={2} margin={0} maxWidth={"90%"} padding={"20px"} className="projects-display">
            <Typography variant="h4" color={'black'} component="h2" style={{ width: '100%', textAlign: 'center', marginBottom: '20px' }}>
                My Projects
            </Typography>
            {projects.map((project) => (
                <Grid item xs={12} md={6} key={project.id} className="project-card">
                    <Card raised className="project-card-container">
                        <CardMedia
                            component="img"
                            sx={{
                                display: 'block',
                                width: 1, // This means 100% width
                                // maxHeight: { xs: 233, md: 167 }, // Optional, only if you need to constrain the height
                                aspectRatio: 3 / 2,
                            }}
                            image={project.cover[0].image}
                            alt={project.cover[0].caption}
                        />
                        <CardContent className="project-details">
                            <Typography variant="h5" component="div" className="project-title">
                                {project.title}
                            </Typography>
                            <div className="project-description">
                                <Typography variant="body2">{project.short_description}</Typography>
                            </div>
                            {project.skills.map((skill) => (
                                <Chip label={`#${skill.name}`} key={skill.id} variant="outlined" className="project-skill-chip" />
                            ))}
                        </CardContent>
                    </Card>
                </Grid>
            ))}
        </Grid>
    );
};

export default ProjectsDisplay;
