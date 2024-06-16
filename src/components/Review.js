import React, { useState, useEffect } from "react";
import { Card, CardContent, Typography, Avatar, IconButton, Box } from "@mui/material";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import ThumbDownIcon from "@mui/icons-material/ThumbDown";
import Cookies from "js-cookie"; 
import axios from "axios"; 

const Review = ({ reviewId, rating, description, reviewerName, date, reviewerProfilePic, likes, dislikes, likedBreweries, dislikedBreweries, setHasClicked }) => {
    const [feedbackMessage, setFeedbackMessage] = useState("");
    const [lBreweries, setLBreweries] = useState([])
    const [dBreweries, setDBreweries] = useState([])

    

    const handleLike = async () => {
      

        if (likedBreweries.includes(reviewId) || dislikedBreweries.includes(reviewId) || lBreweries.includes(reviewId) || dBreweries.includes(reviewId)) {
            setFeedbackMessage("You already expressed for this review.");
            return;
        }

        try {
            const response = await axios.put(
                `https://moobe.onrender.com/api/breweries/${reviewId}`,
                {
                    likes: likes + 1,
                    dislikes: dislikes,
                },
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${Cookies.get('token')}`,
                    },
                }
            );
            setLBreweries([...lBreweries, reviewId])
            setHasClicked(Math.random())
            const updatedLikedBreweries = [...likedBreweries, reviewId];
            await updatePreferences(updatedLikedBreweries, dislikedBreweries);
        } catch (error) {
            console.error("Error updating likes:", error);
        }
    };

    const handleDislike = async () => {
        if (likedBreweries.includes(reviewId) || dislikedBreweries.includes(reviewId) || lBreweries.includes(reviewId) || dBreweries.includes(reviewId)) {
            setFeedbackMessage("You already expressed for this review.");
            return;
        }

        try {
            const response = await axios.put(
                `https://moobe.onrender.com/api/breweries/${reviewId}`,
                {
                    likes: likes,
                    dislikes: dislikes + 1,
                },
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${Cookies.get("token")}`,
                    },
                }
            );
            setDBreweries([...dBreweries, reviewId])
            setHasClicked(Math.random())
            const updatedDislikedBreweries = [...dislikedBreweries, reviewId];
            await updatePreferences(likedBreweries, updatedDislikedBreweries);
        } catch (error) {
            console.error("Error updating dislikes:", error);
        }
    };

    const updatePreferences = async (updatedLikedBreweries, updatedDislikedBreweries) => {
        try {
            await axios.put(
                "https://moobe.onrender.com/api/auth/preferences",
                {
                    username: Cookies.get("username"),
                    likedBreweries: updatedLikedBreweries,
                    dislikedBreweries: updatedDislikedBreweries,
                },
                {
                    headers: {
                        Authorization: `Bearer ${Cookies.get("token")}`,
                    },
                }
            );
        } catch (error) {
            console.error("Error updating preferences:", error);
        }
    };

    const getRatingLabel = (numericRating) => {
        switch (numericRating) {
            case 1:
                return "Poor";
            case 2:
                return "Fair";
            case 3:
                return "Good";
            case 4:
                return "Very Good";
            case 5:
                return "Excellent";
            default:
                return "";
        }
    };

    const options = {
        year: 'numeric',
        month: 'long'
    };
    const formattedDate = new Intl.DateTimeFormat('en-US', options).format(new Date(date));

    return (
        <Card sx={{ mt: 2, mb:2, boxShadow: 'rgba(6, 24, 44, 0.4) 0px 0px 0px 2px, rgba(6, 24, 44, 0.65) 0px 4px 6px -1px, rgba(255, 255, 255, 0.08) 0px 1px 0px inset;'}}>
            <CardContent>
                <Box display="flex" alignItems="center" mb={1}>
                    <Avatar
                        alt={reviewerName}
                        sx={{
                            width: 48,
                            height: 48,
                            marginRight: 2,
                            backgroundColor: reviewerProfilePic,
                            color: "#fff",
                        }}
                    />
                    <Box>
                        <Typography variant="body2" color="textSecondary">
                            {reviewerName}
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                            {formattedDate}
                        </Typography>
                        <Typography variant="body2">
                            Rating: {getRatingLabel(rating)}
                        </Typography>
                    </Box>
                </Box>
                <Typography variant="body1" mb={2}>{description}</Typography>
                {feedbackMessage && (
                    <Typography variant="body2" color="error" mb={1}>
                        {feedbackMessage}
                    </Typography>
                )}
                <Box display="flex" alignItems="center">
                    <IconButton onClick={handleLike} color="primary">
                        <ThumbUpIcon />
                    </IconButton>
                    <Typography variant="body2" color="textSecondary" mr={2}>{likes}</Typography>
                    <IconButton onClick={handleDislike} color="secondary">
                        <ThumbDownIcon />
                    </IconButton>
                    <Typography variant="body2" color="textSecondary">{dislikes}</Typography>
                </Box>
            </CardContent>
        </Card>
    );
};

export default Review;
