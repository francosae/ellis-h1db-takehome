import pandas as pd
from nltk.stem import WordNetLemmatizer
from nltk.corpus import stopwords
import nltk

nltk.download('wordnet')
nltk.download('stopwords')

data = pd.read_excel('data.xlsx')

def normalize_names(name):
    lemmatizer = WordNetLemmatizer()
    stop_words = set(stopwords.words('english'))

    if not isinstance(name, str):
        return name 

    tokens = [word for word in name.lower().split() if word not in stop_words]

    normalized = ' '.join([lemmatizer.lemmatize(word) for word in tokens])
    return normalized


data['EMPLOYER_NAME_NORMALIZED'] = data['EMPLOYER_NAME'].apply(normalize_names)

data.to_csv('preprocessed_data.csv', index=False)
