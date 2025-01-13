import json
import requests
from os import environ

def lambda_handler(event, context):
    webhook_url = environ["DISCORD_WEBHOOK_URL"]

    message = event.get('message', 'Hello, world!')
    image_urls = event.get('attachmentURLs', [])

    try:
        files = {}

        for index, image_url in enumerate(image_urls):
            image_response = requests.get(image_url)
            if image_response.status_code == 200:
                files[f"file{index}"] = (f"image{index + 1}.jpg", image_response.content)
            else:
                return {
                    "statusCode": 400,
                    "body": json.dumps(f"Failed to download image from {image_url}: {image_response.status_code}")
                }

        payload = {
            "content": message
        }

        if files:
            response = requests.post(webhook_url, data=payload, files=files)
        else:
            response = requests.post(webhook_url, json=payload)

        if 200 <= response.status_code < 300:
            return {
                "statusCode": 200,
                "body": json.dumps("Message sent successfully!")
            }
        else:
            return {
                "statusCode": response.status_code,
                "body": json.dumps(f"Failed to send message: {response.text}")
            }

    except Exception as e:
        return {
            "statusCode": 500,
            "body": json.dumps(f"Error sending message: {str(e)}")
        }