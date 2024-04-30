from elasticsearch import Elasticsearch, helpers

import pandas as pd

es = Elasticsearch(
  "https://4367b9c533634e038d0e3fbd329a6342.us-central1.gcp.cloud.es.io:443",
  api_key="OUg3Z0xZOEI0ckRUVWNSN2VVMDI6WGMtRXF1VzRUbnFBNjNoMEZfWEpTZw=="
)

if not es.ping():
    raise ValueError("Connection failed")

index_name = 'h1b_visa_applications'
settings = {
    "settings": {
        "analysis": {
            "analyzer": {
                "custom_search_analyzer": {
                    "type": "custom",
                    "tokenizer": "whitespace",
                    "filter": ["lowercase", "synonym_filter"]
                },
                "custom_index_analyzer": {
                    "type": "custom",
                    "tokenizer": "standard",
                    "filter": ["lowercase", "synonym_filter"]
                }
            },
            "filter": {
                "synonym_filter": {
                    "type": "synonym",
                    "synonyms": [
                        "amazon, amazon.com, amazon services => amazon"
                    ]
                }
            }
        }
    },
    "mappings": {
        "properties": {
            "CASE_NUMBER": {
                "type": "keyword"
            },
            "EMPLOYER_NAME": {
                "type": "text",
                "analyzer": "custom_index_analyzer",
                "search_analyzer": "custom_search_analyzer"
            },
            "EMPLOYER_NAME_NORMALIZED": {
                "type": "text",
                "analyzer": "custom_index_analyzer",
                "search_analyzer": "custom_search_analyzer"
            }
        }
    }
}

if es.indices.exists(index=index_name):
    es.indices.delete(index=index_name)
es.indices.create(index=index_name, body=settings)


data = pd.read_csv('preprocessed_data.csv')
data.fillna('', inplace=True)

def generate_docs(data):
    for index, row in data.iterrows():
        yield {
            "_index": index_name,
            "_id": row['CASE_NUMBER'],
            "_source": 
            row.to_dict()
        }

try:
    helpers.bulk(es, actions=generate_docs(data))
    print("Data indexing complete.")
except helpers.BulkIndexError as e: 
    print(e.errors)
except Exception as e:
    print(f"err: {e}")
