import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Grid, TextField, Typography } from '@mui/material';
import axios from 'axios';

const PitchForm = () => {
    const [pitchName, setPitchName] = useState('');
    const [error, setError] = useState('');
    const token = localStorage.getItem('token');
    const navigate = useNavigate();

    const handleChange = (event) => {
        setPitchName(event.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!pitchName.trim()) {
            setError('Pitch name is required.');
            return;
        }

        try {
            const response = await axios.post(
                'https://myallapps.tech:3024/api/admin/pitch/createPitch',
                { name: pitchName },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                }
            );
            console.log('Pitch created successfully:', response.data);
            navigate('/pitch/list'); // Navigate to a desired route
        } catch (error) {
            console.error('Error creating pitch:', error);
            setError('Error creating pitch. Please try again later.');
        }
    };

    const handleCancel = () => {
        setPitchName('');
        setError('');
    };

    return (
        <div className="container">
            <Button
                color="primary"
                variant="contained"
                sx={{ textTransform: 'capitalize', marginBottom: 2 }}
                onClick={() => navigate(-1)}
            >
                Go Back
            </Button>
            <Typography variant="h4" align="center" gutterBottom>
                Create Pitch
            </Typography>
            <form onSubmit={handleSubmit}>
                <Grid container spacing={3} justifyContent="center">
                    <Grid item xs={12} sm={6}>
                        <TextField
                            type="text"
                            name="name"
                            label="Pitch Name"
                            onChange={handleChange}
                            fullWidth
                            required
                            value={pitchName}
                            error={!!error}
                            helperText={error}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6} textAlign="center">
                        <Button
                            color="primary"
                            variant="contained"
                            type="submit"
                            sx={{ marginRight: 1 }}
                        >
                            Save
                        </Button>
                        <Button color="secondary" onClick={handleCancel}>
                            Cancel
                        </Button>
                    </Grid>
                </Grid>
            </form>
        </div>
    );
};

export default PitchForm;
