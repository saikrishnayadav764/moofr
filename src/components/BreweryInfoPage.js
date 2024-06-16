import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Container,
  Typography,
  Box,
  TextField,
  Button,
  Link,
  CircularProgress,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Grid,
} from "@mui/material";
import axios from "axios";
import Cookies from "js-cookie";
import Review from "./Review"; 

const BreweryInfoPage = () => {
  const { id } = useParams();
  const [brewery, setBrewery] = useState({});
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(true);
  const [sortOrder, setSortOrder] = useState("latest");
  const [filterRating, setFilterRating] = useState("");
  const [filterByMe, setFilterByMe] = useState(false);
  const [hasReviewed, setHasReviewed] = useState(false);
  const [hasClicked, setHasClicked] = useState(false);
  const [reviewedBreweries, setReviewedBreweries] = useState([]);
  const [likedBreweries, setLikedBreweries] = useState([]);
  const [dislikedBreweries, setDislikedBreweries] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchBrewery = async () => {
      try {
        const response = await axios.get(
          `https://api.openbrewerydb.org/v1/breweries/${id}`
        );
        setBrewery(response.data);
        await fetchReviews(); 
      } catch (error) {
        console.error("Error fetching brewery:", error);
      } finally {
        setLoading(false);
      }
    };

    const fetchReviews = async () => {
      try {
        const response = await axios.get(
          `https://moobe-production.up.railway.app/api/breweries/${id}`,
          {
            headers: {
              Authorization: `Bearer ${Cookies.get("token")}`,
            },
          }
        );
        setReviews(response.data);
      } catch (error) {
        console.error("Error fetching reviews:", error);
      }
    };

    const checkIfReviewed = async () => {
      try {
        const response = await axios.get(
          `https://moobe-production.up.railway.app/api/auth/check?username=${Cookies.get(
            "username"
          )}&breweryId=${id}`,
          {
            headers: {
              Authorization: `Bearer ${Cookies.get("token")}`,
            },
          }
        );
        setHasReviewed(response.data.reviewed);
        setReviewedBreweries(response.data.reviewedBreweries);
        setLikedBreweries(response.data.likedBreweries);
        setDislikedBreweries(response.data.dislikedBreweries);
      } catch (error) {
        console.error("Error checking review status:", error);
      }
    };

    fetchBrewery();
    checkIfReviewed();
  }, [
    id,
    rating,
    sortOrder,
    filterRating,
    filterByMe,
    hasReviewed,
    hasClicked,
  ]);

  const getRandomColor = () => {
    let color = "#";
    const minBrightness = 50;
    const red = Math.floor(
      Math.random() * (255 - minBrightness) + minBrightness
    );
    const green = Math.floor(
      Math.random() * (255 - minBrightness) + minBrightness
    );
    const blue = Math.floor(
      Math.random() * (255 - minBrightness) + minBrightness
    );
    color += red.toString(16).padStart(2, "0");
    color += green.toString(16).padStart(2, "0");
    color += blue.toString(16).padStart(2, "0");
    return color;
  };

  const randomColor = getRandomColor();

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    const date = new Date();
    const options = { year: "numeric", month: "long" };
    const formattedDate = new Intl.DateTimeFormat("en-US", options).format(
      date
    );
    try {
      const numericRating = parseInt(rating);
      const newReview = {
        breweryId: `${id}`,
        rating: numericRating,
        description,
        date: formattedDate,
        reviewerName: Cookies.get("username"),
        reviewerProfilePic: randomColor,
        likes: 0,
        dislikes: 0,
      };
      await axios.post("https://moobe-production.up.railway.app/api/breweries", newReview, {
        headers: {
          Authorization: `Bearer ${Cookies.get("token")}`,
        },
      });
      setReviews((prevReviews) => [...prevReviews, newReview]);
      setRating("");
      setDescription("");

      const updatedReviewedBreweries = [...reviewedBreweries, id];
      await axios.put(
        "https://moobe-production.up.railway.app/api/auth/preferences",
        {
          username: `${Cookies.get("username")}`,
          reviewedBreweries: updatedReviewedBreweries,
        },
        { headers: { Authorization: `Bearer ${Cookies.get("token")}` } }
      );
      setReviewedBreweries(updatedReviewedBreweries);
      setHasReviewed(true);
    } catch (error) {
      console.error("Error submitting review:", error);
    }
  };

  const handleLogout = () => {
    Cookies.remove("token");
    navigate("/");
    console.log("Logged out");
  };

  const handleSortChange = (e) => {
    setSortOrder(e.target.value);
  };

  const handleFilterChange = (e) => {
    setFilterRating(e.target.value);
  };

  const handleFilterByMeChange = () => {
    setFilterByMe((prev) => !prev);
  };

  const calculateOverallRating = () => {
    if (reviews.length === 0) return 0;
    const total = reviews.reduce((acc, review) => acc + review.rating, 0);
    return (total / reviews.length).toFixed(1);
  };

  const overallRating = calculateOverallRating();

  const filteredReviews = reviews
    .filter((review) => {
      if (filterRating && review.rating !== parseInt(filterRating)) {
        return false;
      }
      if (filterByMe && review.reviewerName !== Cookies.get("username")) {
        return false;
      }
      return true;
    })
    .sort((a, b) => {
      if (sortOrder === "latest") {
        return new Date(b.date) - new Date(a.date);
      } else {
        return new Date(a.date) - new Date(b.date);
      }
    });

  return (
    <Container>
      <Box sx={{ mt: 4 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            mb: 4,
            flexWrap: "wrap",
          }}
        >
          <Typography variant="h4" gutterBottom>
            {brewery.name}
          </Typography>
          <Button onClick={handleLogout} variant="contained" color="error">
            Logout
          </Button>
        </Box>
        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <Typography variant="body1">
                  Address: {brewery.street}, {brewery.city}, {brewery.state}
                </Typography>
                <Typography variant="body1">Phone: {brewery.phone}</Typography>
                <Typography variant="body1">
                  Website:{" "}
                  <Link
                    href={brewery.website_url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {brewery.website_url}
                  </Link>
                </Typography>
                <Typography variant="h6" sx={{ mt: 2 }}>
                  Overall Rating: {overallRating}
                </Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Box sx={{ mt: 4 }}>
                  <Typography variant="h6">Add a Review</Typography>
                  {hasReviewed ? (
                    <Typography variant="body1" color="error">
                      You have reviewed this brewery.
                    </Typography>
                  ) : (
                    <form onSubmit={handleReviewSubmit}>
                      <TextField
                        select
                        fullWidth
                        label="Rating"
                        value={rating}
                        onChange={(e) => setRating(e.target.value)}
                        required
                        sx={{ mb: 2 }}
                      >
                        <MenuItem value={1}>1 - Poor</MenuItem>
                        <MenuItem value={2}>2 - Fair</MenuItem>
                        <MenuItem value={3}>3 - Good</MenuItem>
                        <MenuItem value={4}>4 - Very Good</MenuItem>
                        <MenuItem value={5}>5 - Excellent</MenuItem>
                      </TextField>
                      <TextField
                        fullWidth
                        label="Description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        required
                        multiline
                        rows={4}
                        sx={{ mb: 2 }}
                      />
                      <Button
                        onClick={handleReviewSubmit}
                        type="submit"
                        variant="contained"
                        color="primary"
                      >
                        Submit Review
                      </Button>
                    </form>
                  )}
                </Box>
              </Grid>
            </Grid>

            <Box sx={{ mt: 4 }}>
              <Typography sx={{ mb: 3 }} variant="h5">
                Reviews
              </Typography>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  mb: 2,
                  flexWrap: "wrap",
                  gap: 2,
                }}
              >
                <FormControl sx={{ minWidth: 120 }}>
                  <InputLabel>Sort By</InputLabel>
                  <Select
                    value={sortOrder}
                    onChange={handleSortChange}
                    label="Sort By"
                  >
                    <MenuItem value="latest">Latest</MenuItem>
                    <MenuItem value="oldest">Oldest</MenuItem>
                  </Select>
                </FormControl>
                <FormControl sx={{ minWidth: 120 }}>
                  <InputLabel>Filter By</InputLabel>
                  <Select
                    value={filterRating}
                    onChange={handleFilterChange}
                    label="Filter By"
                  >
                    <MenuItem value="">All Ratings</MenuItem>
                    <MenuItem value="5">Five Stars</MenuItem>
                    <MenuItem value="4">Four Stars</MenuItem>
                    <MenuItem value="3">Three Stars</MenuItem>
                    <MenuItem value="2">Two Stars</MenuItem>
                    <MenuItem value="1">One Star</MenuItem>
                  </Select>
                </FormControl>
                <Button
                  onClick={handleFilterByMeChange}
                  variant="contained"
                  color={filterByMe ? "primary" : "info"}
                >
                  {filterByMe ? "Show All Reviews" : "Show My Reviews"}
                </Button>
              </Box>
              {filteredReviews.map((review, index) => (
                <Review
                  key={index}
                  reviewId={review._id}
                  breweryId={id}
                  rating={review.rating}
                  description={review.description}
                  date={review.date}
                  reviewerName={review.reviewerName}
                  reviewerProfilePic={review.reviewerProfilePic}
                  likes={review.likes}
                  dislikes={review.dislikes}
                  likedBreweries={likedBreweries}
                  dislikedBreweries={dislikedBreweries}
                  setHasClicked={setHasClicked}
                />
              ))}
            </Box>
          </>
        )}
      </Box>
    </Container>
  );
};

export default BreweryInfoPage;
