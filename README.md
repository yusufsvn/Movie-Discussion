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
mongoDB url is required to use the database

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
 ```bash
 nodemon app.js
 ```
 Python server
 ```bash
 uvicorn app:app --host 0.0.0.0 --port 8000
 ```

![loginpage](https://github.com/user-attachments/assets/e63911a4-4eb1-4616-ae46-c274bacb2057)
![comment](https://github.com/user-attachments/assets/36da025c-66a2-45b2-927f-f6527efb6549)
![moviepage](https://github.com/user-attachments/assets/f7fa168f-979a-401e-8e1e-cbcfacd0c58f)
![movie](https://github.com/user-attachments/assets/8c4c3c58-12cd-4627-9040-2d1696fe7868)

