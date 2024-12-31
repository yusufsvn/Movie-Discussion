from keras.models import load_model
from keras.preprocessing.sequence import pad_sequences
import numpy as np
import joblib
gru_model = load_model("gru_model.h5")
tokenizer = joblib.load("tokenizer.pkl") 

comment = "film oldukça ilgi çekici"
# Sonuçları analiz edin
comment_seq = tokenizer.texts_to_sequences([comment])
comment_padded = pad_sequences(comment_seq, maxlen=gru_model.input_shape[1])
    
# Tahmin işlemi
prediction = gru_model.predict(comment_padded)
sentiment = "Olumlu" if np.argmax(prediction) == 1 else "Olumsuz"

print(sentiment)

