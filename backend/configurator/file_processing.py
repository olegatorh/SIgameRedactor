import os

import ffmpeg
from PIL import Image
from django.core.files.base import ContentFile
import time

from ffmpeg import overwrite_output


##ffmpeg needs to be installed on server


def process_image(file_field):
    try:
        with Image.open(file_field) as img:
            img = img.convert("RGB")
            img.thumbnail((1024, 1024))

            temp_file = ContentFile(b"")
            img.save(temp_file, format="JPEG", quality=85)

            return temp_file
    except Exception as e:
        raise Exception(f"Image processing failed: {e}")


def process_audio(file_field, answer_time):
    input_file = file_field.path
    temp_output_file = input_file.rsplit('.', 1)[0] + '_temp.mp3'
    bitrate = 192
    max_size = 1 * 1024 * 1024  # 1MB in bytes

    try:
        while True:
            (ffmpeg.input(input_file, t=answer_time)
             .output(temp_output_file, format='mp3', audio_bitrate=f'{bitrate}k')
             .run(overwrite_output=True))
            file_size = os.path.getsize(temp_output_file)
            if file_size <= max_size:
                os.remove(input_file)
                break

            bitrate -= 16
            if bitrate < 32:
                os.remove(temp_output_file)
                raise Exception("Unable to compress audio to the desired size without significant quality loss.")
        with open(temp_output_file, 'rb') as f:
            return ContentFile(f.read(), name=os.path.basename(temp_output_file)), temp_output_file

    except Exception as e:
        raise Exception(f"Audio processing failed: {e}")


def process_video(file_field, time):
    print(f"Audio input file path: {file_field.path}")  #
    try:
        input_file = file_field.path
        output_file = input_file.rsplit('.', 1)[0] + '.mp4'
        print(f"changed Audio input file path: {output_file}")
        ffmpeg.input(input_file).output(output_file, format='mp4', vcodec='libx264', acodec='aac',
                                        strict='experimental').run(overwrite_output=True)
        with open(output_file, 'rb') as f:
            return ContentFile(f.read(), name=os.path.basename(output_file))
    except Exception as e:
        raise Exception(f"Video processing failed: {e}")
