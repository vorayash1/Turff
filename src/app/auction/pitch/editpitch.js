import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button, Grid, TextField, Typography } from '@mui/material';
import axios from 'axios';

const EditPitchForm = () => {
    const [pitchName, setPitchName] = useState('');
    const [pitchId, setPitchId] = useState('');
    const [error, setError] = useState('');
    const token = localStorage.getItem('token');
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        // Extract the pitch_id and name from the passed state (if available)
        const { pitch_id, name } = location.state || {};
        if (pitch_id) setPitchId(pitch_id);
        if (name) setPitchName(name);
    }, [location.state]);

    const handleChange = (event) => {
        setPitchName(event.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!pitchId.trim() || !pitchName.trim()) {
            setError('Both Pitch ID and Pitch Name are required.');
            return;
        }

        try {
            const response = await axios.post(
                'https://myallapps.tech:3024/api/admin/pitch/updatepitch',
                { pitch_id: pitchId, name: pitchName },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                }
            );
            console.log('Pitch updated successfully:', response.data);
            navigate('/myturff'); // Navigate to a desired route
        } catch (error) {
            console.error('Error updating pitch:', error);
            setError('Error updating pitch. Please try again later.');
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
                Edit Pitch
            </Typography>
            <form onSubmit={handleSubmit}>
                <Grid container spacing={3} justifyContent="center">
                    {/* Pitch Name Input */}
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

export default EditPitchForm;
