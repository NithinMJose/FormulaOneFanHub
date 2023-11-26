import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { TextField, Button, CircularProgress, Typography } from '@mui/material';
import AdminNavbar from './AdminNavbar';
import Footer from './Footer';
import './AddF1History.css';
import { useNavigate } from 'react-router-dom';



const AddF1History = () => {
    const { control, handleSubmit, setValue, formState: { errors }, setError } = useForm();
    const navigate = useNavigate();

    const onSubmit = async (data) => {
        try {
            const response = await fetch('https://localhost:7092/api/F1History/CreateF1History', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            if (response.status === 201) {
                toast.success('F1 History added successfully');
                navigate('/F1HistoryList');
                // Additional logic or navigation can be added here
            } else {
                const errorData = await response.json();
                console.error('F1 History creation failed:', errorData);
                toast.error('F1 History creation failed');
            }
        } catch (error) {
            console.error('F1 History creation failed:', error);
            toast.error('F1 History creation failed');
        }
    };

    return (
        <div className='AddF1Historywrapper'>
            <AdminNavbar />

            <div className='AddF1History'>
                <div style={{ display: 'flex', justifyContent: 'center', marginTop: '50px' }}>
                    <div style={{ maxWidth: '500px', width: '100%', padding: '20px', borderRadius: '10px', overflow: 'hidden', background: '#fff', boxShadow: '0 0 10px 10px rgb(105, 135, 255)' }}>
                        <form onSubmit={handleSubmit(onSubmit)}>
                            <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                                <Typography variant="h4" color="primary">
                                    Add F1 History
                                </Typography>
                                <div style={{ width: '51px', height: '5px', background: '#3c009d', borderRadius: '80px', margin: 'auto' }}></div>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                <Controller
                                    name="heading"
                                    control={control}
                                    defaultValue=""
                                    rules={{ required: 'Heading is required' }}
                                    render={({ field }) => (
                                        <TextField
                                            {...field}
                                            label="Heading"
                                            error={!!errors.heading}
                                            helperText={errors.heading?.message}
                                            required
                                        />
                                    )}
                                />
                                <Controller
                                    name="paragraph"
                                    control={control}
                                    defaultValue=""
                                    rules={{ required: 'Paragraph is required' }}
                                    render={({ field }) => (
                                        <TextField
                                            {...field}
                                            label="Paragraph"
                                            multiline
                                            error={!!errors.paragraph}
                                            helperText={errors.paragraph?.message}
                                            required
                                        />
                                    )}
                                />
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
                                <Button
                                    type="submit"
                                    variant="contained"
                                    color="primary"
                                >
                                    Add F1 History
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
            <br></br>
            <br></br>
            <Footer />
        </div>
    );
};

export default AddF1History;
