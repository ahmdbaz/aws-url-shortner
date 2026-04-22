import json
import boto3

dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table('UrlShortener')

def lambda_handler(event, context):
    short_code = event['pathParameters']['short_code']
    
    response = table.get_item(Key={'short_code': short_code})
    
    if 'Item' not in response:
        return {
            'statusCode': 404,
            'body': json.dumps({'error': 'Short URL not found'})
        }
    
    long_url = response['Item']['long_url']
    
    return {
        'statusCode': 301,
        'headers': {
            'Location': long_url,
            'Access-Control-Allow-Origin': '*',
        },
        'body': ''
    }