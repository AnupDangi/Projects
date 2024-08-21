# ChatGPT Clone Using Gemini API

This is my 4th sem project which i created to learn about API working and user authentication.

## Stack Used 
HTML,CSS,Javascript,Node,Express,MongoDB

## Prerequisites

Before you begin, ensure you have the following installed on your system:

- Node.js (v14.0.0 or later)
- npm (v6.0.0 or later)
- MongoDB (v4.0 or later)


## Run Locally


## Installation

1. Clone the repository:

```bash
git clone https://github.com/AnupDangi/Projects.git
```
2. After cloning make sure that your project structure looks like this :
## Project Structure

- `/backend`: Contains only server.js file for database connection and running server.
- `/frontend`: Contains all the requried HTML,CSS,Javascript files and logo.

3. Navigate to the project directory:
```bash
cd backend
```

4. Install the dependencies:
```
npm install 
```

4. Create a `.env` file in the current directory ie backend and add your 
```bash
MONGODB_URI=here copy your mongodb connection 
PORT=write the port number in which you want to run it mostly it is 3000
SECRET_KEY= Your Gemini API
```

## Running the Project

1. Start the MongoDB compass by connecting the server.

2. Move to backend folder and start the server

```bash
node server.js
```
# After This  a message will pop as 
```
Server running on port 3000
Connected to MongoDB
```
3.Run index.html file from live server

## Contributing

Feel free to fork this repository and submit pull requests to contribute to this project. For major changes, please open an issue first to discuss what you would like to change.

# Upgrading the project
This project can be taken to next level by using react,adding images generation and voice as input from the user through API.Feel free to upgrade this project as per your need and requirement.

## License
This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.


