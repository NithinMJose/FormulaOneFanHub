import React, { useEffect, useState, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import jwt_decode from 'jwt-decode';
import { useSpring, animated } from 'react-spring';
import {
  Button,
  Dialog,
  DialogContent,
  DialogActions,
  TextField,
  List,
  ListItem,
  Typography,
  Avatar,
  Paper,
  Box,
} from '@mui/material';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Footer from '../LoginSignup/Footer';
import UserNavbar from '../LoginSignup/UserNavbar';

const TopicComment = () => {
  const token = localStorage.getItem('jwtToken');
  const tokenPayload = jwt_decode(token);
  const userId = parseInt(tokenPayload?.userId, 10);
  const userName = tokenPayload?.userName;

  const location = useLocation();
  const navigate = useNavigate();
  const { state } = location;
  const [comments, setComments] = useState([]);
  const [userDetails, setUserDetails] = useState({});
  const [showCommentPopup, setShowCommentPopup] = useState(false);
  const [newComment, setNewComment] = useState('');

  const commentsRef = useRef(null);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await fetch(`https://localhost:7092/api/Comment/TopicComments?topicId=${state?.topicId}`);
        const data = await response.json();
        setComments(data);
        fetchUserDetails(data);
      } catch (error) {
        console.error('Error fetching comments:', error);
      }
    };

    const fetchUserDetails = async (comments) => {
      const userIds = comments.map((comment) => comment.userId);
      const uniqueUserIds = [...new Set(userIds)];

      for (const userId of uniqueUserIds) {
        try {
          const userResponse = await fetch(`https://localhost:7092/api/User/GetUserDetailsFromUserId?userId=${userId}`);
          const userData = await userResponse.json();
          setUserDetails((prevDetails) => ({ ...prevDetails, [userId]: userData }));
        } catch (error) {
          console.error(`Error fetching user details for userId ${userId}:`, error);
        }
      }
    };

    if (state && state.topicId) {
      fetchComments();
    }
 }, [state, userId, userName]);

  const getUserName = (userId) => {
    return userDetails[userId]?.userName || 'Unknown User';
 };

  const getRandomColor = () => {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
 };

  const handleAddCommentClick = () => {
    setShowCommentPopup(true);
 };

  const handleCancelComment = () => {
    setShowCommentPopup(false);
    setNewComment('');
 };

  const handleSaveComment = async () => {
    try {
      const response = await fetch('https://localhost:7092/api/Comment/InsertComment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: newComment,
          userId: userId,
          userName: getUserName(userId),
          topicId: state?.topicId,
        }),
      });

      if (response.status === 201) {
        toast.success('Comment added successfully');
        setShowCommentPopup(false);
        setNewComment('');

        navigate('/TopicComment', { replace: true, state: { topicId: state?.topicId } });
      } else {
        const errorData = await response.json();
        console.error('Comment creation failed:', errorData);
        toast.error('Comment creation failed');
      }
    } catch (error) {
      console.error('Comment creation failed:', error);
      toast.error('Comment creation failed');
    } finally {
      setShowCommentPopup(false);
      setNewComment('');
    }
 };

  const handleDeleteComment = async (commentId) => {
    try {
      const response = await fetch('https://localhost:7092/api/Comment/DeleteCommentById', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(commentId),
      });

      if (response.status === 200) {
        toast.success('Comment deleted successfully');
        setComments((prevComments) => prevComments.filter((comment) => comment.commentId !== commentId));
      } else {
        const errorData = await response.json();
        console.error('Comment deletion failed:', errorData);
        toast.error('Comment deletion failed');
      }
    } catch (error) {
      console.error('Comment deletion failed:', error);
      toast.error('Comment deletion failed');
    }
 };

  useEffect(() => {
    if (commentsRef.current) {
      commentsRef.current.scrollIntoView({ behavior: 'smooth' });
    }
 }, [comments]);

  const fadeIn = useSpring({ opacity: 1, from: { opacity: 0 } });

  // Create a new array that is the reverse of comments
  const reversedComments = [...comments].reverse();

  return (
    <animated.div style={fadeIn}>
      <div>
        <UserNavbar />
       <Typography variant="h2" style={{ marginTop: "100px" }}>{state?.title}</Typography>
        <List ref={commentsRef}>
         {reversedComments.map((comment) => (
            <ListItem key={comment.commentId}>
              <Avatar style={{ backgroundColor: getRandomColor(), marginRight: '10px' }}>
                {getUserName(comment.userId)?.charAt(0).toUpperCase()}
              </Avatar>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <Paper
                  elevation={3}
                  style={{
                    padding: '10px',
                    marginBottom: '10px',
                    borderRadius: '20px',
                 }}
                >
                  <Typography variant="subtitle1">{`${getUserName(comment.userId)}`}</Typography>
                  <Typography variant="body1">{`${comment.content}`}</Typography>
                  <Typography variant="caption">{`${new Date(comment.createdOn).toLocaleString()}`}</Typography>
                </Paper>
                {comment.userId === userId && (
                  <Button
                   name="deleteComment"
                    variant="outlined"
                    color="secondary"
                    style={{ width: '80px', alignSelf: 'flex-end', marginTop: '10px' }}
                    onClick={() => handleDeleteComment(comment.commentId)}
                  >
                    Delete
                  </Button>
                )}
              </div>
            </ListItem>
          ))}
        </List>
       <br />
        <Box display="flex" justifyContent="center">
          <Button
            className="addComment"
            variant="contained"
            color="primary"
            style={{ marginBottom: '10px' }}
            onClick={handleAddCommentClick}
          >
            Add Comment
          </Button>
        </Box>
        <Dialog open={showCommentPopup} onClose={handleCancelComment}>
          <DialogContent style={{ background: '#f0f0f0' , width: '500px'}}>
            <TextField
              className="commentTextField"
              label="Enter your comment"
              variant="outlined"
              fullWidth
              multiline
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              rows={4}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCancelComment} color="secondary">
              Cancel
            </Button>
            <Button onClick={handleSaveComment} color="primary">
              Save
            </Button>
          </DialogActions>
        </Dialog>
        <Footer />
      </div>
    </animated.div>
 );
};

export default TopicComment;
