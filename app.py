from keras.models import load_model
from fastapi import FastAPI
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from keras.preprocessing.sequence import pad_sequences
import numpy as np
import joblib


app = FastAPI()


gru_model = load_model("gru_model.h5")
tokenizer = joblib.load("tokenizer.pkl") 

class Comment(BaseModel):
    text: str = None
    
@app.post("/predict")
async def predict(yorum:Comment):
    try:
        text = yorum.text
        comment_seq = tokenizer.texts_to_sequences([text])
        comment_padded = pad_sequences(comment_seq, maxlen=gru_model.input_shape[1])
        # Tahmin yap
        prediction = gru_model.predict(comment_padded)
        sentiment = 1 if np.argmax(prediction) == 1 else 0

        return JSONResponse(content=sentiment, status_code=201,headers={"Content-Type": "application/json"} )
    except Exception:
        print(Exception)
    
