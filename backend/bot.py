import discord
from flask import Flask, request, jsonify
from flask_cors import CORS
from os import getenv
from dotenv import load_dotenv

load_dotenv()

BOT_TOKEN = getenv("DISCORD_BOT_TOKEN")
CHANNEL_ID = 1116032082985091105

intents = discord.Intents.default()
client = discord.Client(intents=intents)

app = Flask(__name__)
CORS(app)


@app.route('/send-message', methods=['POST'])
def send_message():
    data = request.json
    if not data or 'message' not in data:
        return jsonify({'error': 'Invalid request. "message" is required'}), 400

    message_content = data['message']

    async def send_discord_message():
        channel = client.get_channel(CHANNEL_ID)
        if channel:
            await channel.send(message_content)

    client.loop.create_task(send_discord_message())
    return jsonify({'status': 'Message is being sent'}), 200


def run_flask():
    app.run(host='127.0.0.1', port=5000)


if __name__ == '__main__':
    import threading

    threading.Thread(target=run_flask, daemon=True).start()
    client.run(BOT_TOKEN)
