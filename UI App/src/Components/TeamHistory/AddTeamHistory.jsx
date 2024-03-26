import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { TextField, Button, CircularProgress, Typography } from '@mui/material';
import AdminNavbar from '../LoginSignup/AdminNavbar';
import Footer from '../LoginSignup/Footer';
import { useNavigate } from 'react-router-dom';
import TeamSidebar from '../sidebar/TeamSidebar';
import TeamNavbar from '../LoginSignup/Team/TeamNavbar';
import jwt_decode from 'jwt-decode';



const AddTeamHistory = () => {
  const { control, handleSubmit, formState: { errors } } = useForm();
  const navigate = useNavigate();
  const token = localStorage.getItem("jwtToken");
  const decoded = jwt_decode(token);
  const teamId = decoded.teamId;

  const onSubmit = async (data) => {
    try {
      // Include teamId in the data object
      data.teamId = teamId;

      const response = await fetch('https://localhost:7092/api/TeamHistory/CreateTeamHistory', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (response.status === 201) {
        toast.success('Team History added successfully');
        navigate('/TeamHistoryListTeam');
      } else {
        const errorData = await response.json();
        console.error('Team History creation failed:', errorData);
        toast.error('Team History creation failed');
      }
    } catch (error) {
      console.error('Team History creation failed:', error);
      toast.error('Team History creation failed');
    }
  };


  const validateHeading = (value) => {
    return value.length >= 7 || 'Heading should be at least 7 characters';
  };

  const validateParagraph = (value) => {
    return value.length >= 10 || 'Paragraph should be at least 10 characters';
  };

  return (
    <div className='AddTeamHistoryWrapper'>
      <TeamNavbar />
      <br />
      <br />
      <br />
      <br />
      <div className='container-fluid'>
        <div className='row'>
          <TeamSidebar /> {/* Display the TeamSidebar component as a sidebar */}
          <div className='col-md-9 ms-sm-auto col-lg-10 px-md-4'>
            <div className='AddTeamHistory'>
              <div style={{ display: 'flex', justifyContent: 'center', marginTop: '50px' }}>
                <div style={{ maxWidth: '500px', width: '100%', padding: '20px', borderRadius: '10px', overflow: 'hidden', background: '#fff', boxShadow: '0 0 10px 10px rgb(105, 135, 255)' }}>
                  <form onSubmit={handleSubmit(onSubmit)}>
                    <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                      <Typography variant="h4" color="primary">
                        Add Team History
                      </Typography>
                      <div style={{ width: '51px', height: '5px', background: '#3c009d', borderRadius: '80px', margin: 'auto' }}></div>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      <Controller
                        name="heading"
                        control={control}
                        defaultValue=""
                        rules={{
                          required: 'Heading is required',
                          validate: validateHeading,
                        }}
                        render={({ field }) => (
                          <TextField
                            id="testTHistoryHead"
                            {...field}
                            label="Heading"
                            error={!!errors.heading}
                            helperText={errors.heading?.message}
                            required
                            onChange={(e) => {
                              field.onChange(e);
                              validateHeading(e.target.value);
                            }}
                          />
                        )}
                      />
                      <Controller
                        name="paragraph"
                        control={control}
                        defaultValue=""
                        rules={{
                          required: 'Paragraph is required',
                          validate: validateParagraph,
                        }}
                        render={({ field }) => (
                          <TextField
                            id="testTHistoryPara"
                            {...field}
                            label="Paragraph"
                            multiline
                            error={!!errors.paragraph}
                            helperText={errors.paragraph?.message}
                            required
                            onChange={(e) => {
                              field.onChange(e);
                              validateParagraph(e.target.value);
                            }}
                          />
                        )}
                      />
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
                      <Button
                        id="testTHistory"
                        type="submit"
                        variant="contained"
                        color="primary"
                      >
                        Add Team History
                      </Button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
  
};

export default AddTeamHistory;
