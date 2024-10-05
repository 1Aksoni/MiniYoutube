# Video Controller

This project implements a Video Controller for managing video uploads and interactions in a video-sharing application. It provides essential functionalities such as creating, updating, deleting, and fetching videos, along with features like pagination, sorting, and toggling publication status.

## Table of Contents

- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)
- [Dependencies](#dependencies)
- [Contributing](#contributing)
- [License](#license)

## Features

- **Get All Videos**: Retrieve all videos with pagination and sorting options.
- **Publish a Video**: Upload a video to Cloudinary and save video details in the database.
- **Get Video by ID**: Fetch video details using its unique identifier.
- **Update Video**: Modify video attributes such as title, description, and thumbnail.
- **Delete Video**: Remove a video from the database permanently.
- **Toggle Publish Status**: Change the visibility status of a video (public/private).

## Installation

Follow the steps below to set up the project locally:

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd <repository-name>

2. Install Dependencies
  Run the following command to install the required dependencies:
   ```bash
    npm install

3. Set Up Environment Variables
   ```bash
    MONGODB_URI=<your_mongodb_connection_string>
    CLOUDINARY_URL=<your_cloudinary_url>
    PORT=<your_preferred_port>
  
  ## Start the Server
  To start the server, run:
  
       npm run dev

  

# API Endpoints

| Method | Endpoint                  | Description                     |
|--------|---------------------------|---------------------------------|
| GET    | `/videos`                 | Get all videos                  |
| POST   | `/videos`                 | Publish a new video             |
| GET    | `/videos/:videoId`        | Get video by ID                 |
| PUT    | `/videos/:videoId`        | Update video details             |
| DELETE | `/videos/:videoId`        | Delete a video                  |
| PATCH  | `/videos/:videoId/publish`| Toggle video publish status      |

##Contributing
 Contributions are welcome! Fork the repo, make changes, and submit a pull request.

