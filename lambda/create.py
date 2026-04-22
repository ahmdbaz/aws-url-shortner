import json
import boto3
import random
import string

dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table('UrlShortener')

def generate_short_code():
    characters = string.ascii_letters + string.digits
    return ''.join(random.choices(characters, k=6))

def lambda_handler(event, context):
    body = json.loads(event['body'])
    long_url = body['long_url']
    
    short_code = generate_short_code()
    
    table.put_item(Item={
        'short_code': short_code,
        'long_url': long_url
    })
    
    return {
        'statusCode': 200,
        'headers': {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'POST',
        },
        'body': json.dumps({
            'short_code': short_code,
            'short_url': f'https://mlahz1s2e0.execute-api.us-east-1.amazonaws.com/prod/{short_code}'
        })
    }