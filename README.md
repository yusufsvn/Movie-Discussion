# Film atlas
A website project where users can express their opinions about the movies and series they want.
users can get summary information about the movies, decide if they are worth watching and comment

## Features
- Login and sign up system
- Deep learning model for comment sentiment analysis
- Admin panel (addding,deleting movie or serie)
- Comment and reply system
## Dataset
Turkish sentiment analysis dataset used for model training 
 [Dataset](https://www.kaggle.com/datasets/mustfkeskin/turkish-movie-sentiment-analysis-dataset).

## Used Tecnologies:
- Back-End: Node.js(express.js),Python(FastApi)
- Front-End :Ejs,CSS
- Database: MongoDB
## Setup
1. Clone repo

  ```bash
git clone https://github.com/yusufsvn/Movie-Discussion.git
  ````
2.Install javascript modules:

   ```bash
npm install
   ```
## Start servers
 Node server
 ´´´bash
 nodemon app.js
 ´´´
 Python server
 ´´´bash
 uvicorn app:app --host 0.0.0.0 --port 8000
 ´´´
