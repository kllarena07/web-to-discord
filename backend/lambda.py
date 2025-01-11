import discord
from os import getenv
from dotenv import load_dotenv
from io import BytesIO

load_dotenv()

BOT_TOKEN = getenv("DISCORD_BOT_TOKEN")
CHANNEL_ID = getenv("TARGET_CHANNEL_ID")

intents = discord.Intents.default()
client = discord.Client(intents=intents)

async def send_discord_message(message_content, files):
  await client.wait_until_ready()
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

@client.event
async def on_ready():
  print(f'Logged in as {client.user}')

if __name__ == '__main__':
  message_content = "Your message here"
  files = []  # Add your files here as a list of tuples (filename, file_content)
  
  client.loop.create_task(send_discord_message(message_content, files))
  client.run(BOT_TOKEN)
