import discord
from flask import Flask, request, jsonify
from flask_cors import CORS
from os import getenv
from dotenv import load_dotenv
from io import BytesIO

load_dotenv()

BOT_TOKEN = getenv("DISCORD_BOT_TOKEN")
CHANNEL_ID = getenv("TARGET_CHANNEL_ID")

intents = discord.Intents.default()
client = discord.Client(intents=intents)

app = Flask(__name__)
CORS(app)


@app.route('/send-message', methods=['POST'])
def send_message():
    data = request.form
    files = [(file.filename, file.read()) for file in request.files.getlist('files')]
    
    if not data or 'message' not in data:
        return jsonify({'error': 'Invalid request. "message" is required'}), 400

    message_content = data['message']

    async def send_discord_message(message_content, files):
        channel = client.get_channel(int(CHANNEL_ID))
        if channel:
            safa_role = discord.utils.get(channel.guild.roles, name="SAFA so good!")
            umd_role = discord.utils.get(channel.guild.roles, name="UM-Dearborn")

            if safa_role:
                message_content = message_content.replace("@SAFA so good!", safa_role.mention)
            if umd_role:
                message_content = message_content.replace("@UM-Dearborn", umd_role.mention)

            discord_files = [discord.File(BytesIO(file_content), filename=filename) for filename, file_content in files] if files else None
            await channel.send(content=message_content, files=discord_files)

    client.loop.create_task(send_discord_message(message_content, files))
    return jsonify({'status': 'Message is being sent'}), 200

def run_flask():
    app.run(host='127.0.0.1', port=5000)


if __name__ == '__main__':
    import threading

    threading.Thread(target=run_flask, daemon=True).start()
    client.run(BOT_TOKEN)
