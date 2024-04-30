from flask import Flask, request, jsonify
from flask_cors import CORS, cross_origin
from dotenv import load_dotenv
import os
from elasticsearch import Elasticsearch

def create_app():
    load_dotenv()

    app = Flask(__name__)
    cors = CORS(app)
    app.config['CORS_HEADERS'] = 'Content-Type'

    apiKey = os.getenv('elastic_apikey')

    es = Elasticsearch(
    "https://4367b9c533634e038d0e3fbd329a6342.us-central1.gcp.cloud.es.io:443",
    api_key=apiKey
    )

    @app.route('/search', methods=['GET'])
    def search():
        query = request.args.get('query', '')
        page = int(request.args.get('page', 1))  
        size = int(request.args.get('size', 10)) 
        from_ = (page - 1) * size

        response = es.search(
            index='h1b_visa_applications',
            body={
                "from": from_,
                "size": size,
                    "query": {
            "bool": {
                "must": [
                    {
                        "match_phrase": {
                            "EMPLOYER_NAME_NORMALIZED": {
                                "query": query,
                                "slop": 0  
                            }
                        }
                    }
                ],
                "should": [
                    {
                        "match": {
                            "EMPLOYER_NAME_NORMALIZED": {
                                "query": query,
                                "operator": "and"
                            }
                        }
                    }
                ],
                "minimum_should_match": 1
            }
        }
            }
        )

        results = [hit['_source'] for hit in response['hits']['hits']]
        return jsonify(results)

    @app.route('/case', methods=['GET'])
    def get_case():
        case_number = request.args.get('case_number')
        if not case_number:
            return jsonify({'error': 'No case number provided'}), 400

        response = es.search(
            index='h1b_visa_applications',
            body={
                "size": 1,
                "query": {
                    "term": {
                        "CASE_NUMBER": case_number
                    }
                }
            },
        )
        
        print(response)

        if response['hits']['hits']:
            return jsonify(response['hits']['hits'][0]['_source'])
        else:
            return jsonify({'error': 'Case not found'}), 404
    
    return app