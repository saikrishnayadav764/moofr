# Brewery Review System

The Brewery Review System is a web application that allows users to search for breweries, view details about them, and leave reviews. Users can like or dislike reviews, which affects their preferences for future recommendations.

## Table of Contents

- [Demo](#demo)
- [Features](#features)
- [Getting Started](#getting-started)
  - [Installation](#installation)
  - [Usage](#usage)
- [Dependencies](#dependencies)
- [APIs Used](#apis-used)
- [Contributing](#contributing)
- [License](#license)

## Demo

Provide a link to a live demo or screenshots/gifs showing your project in action.

## Features

- **User Authentication**: Users can sign up, log in, and log out securely.
- **Search Breweries**: Users can search for breweries by city, name, or type.
- **View Brewery Details**: Detailed information about each brewery is displayed.
- **Leave Reviews**: Users can leave reviews with ratings and descriptions.
- **Like/Dislike Reviews**: Users can react to reviews with likes or dislikes.
- **Pagination**: Browse through multiple pages of brewery search results.
- **Protected Routes**: Certain routes are protected and require authentication.

## Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/yourusername/brewery-review-system.git
   ```

2. Navigate to the project directory:

   ```bash
   cd brewery-review-system
   ```

3. Install dependencies:

   ```bash
   npm install
   ```

### Usage

1. Start the development server:

   ```bash
   npm start
   ```

2. Open [http://localhost:3000](http://localhost:3000) to view the app in the browser.

## Dependencies

- React
- Material-UI
- Axios
- react-router-dom
- js-cookie

## APIs Used

- **Open Brewery DB API**: Used for fetching brewery data based on search queries.
