import os
import zipfile
from django.conf import settings
import xml.etree.ElementTree as ET
from xml.dom import minidom
import shutil




TYPE_CHOICES = {
    1:'simple',
    2:'stake',
    3: 'secret',
    4: 'secretPublicPrice',
    5: 'noRisk'
}




def create_xml(package_data):
    package = ET.Element(
        "package",
        {
            "name": package_data["title"],
            "version": "5",
            "id": str(package_data["id"]),
            "date": package_data["date"],
            "difficulty": str(package_data["difficulty"]),
            "xmlns": "https://github.com/VladimirKhil/SI/blob/master/assets/siq_5.xsd"
        },
    )
    tags = ET.SubElement(package, "tags")
    for tag in package_data["tags"]:
        tag_element = ET.SubElement(tags, "tag")
        tag_element.text = tag["tag_names"]

    info = ET.SubElement(package, "info")
    authors = ET.SubElement(info, "authors")
    author_element = ET.SubElement(authors, "author")
    author_element.text = package_data["author"]

    rounds = ET.SubElement(package, "rounds")
    for round_data in package_data["rounds"]:
        round_attributes = {"name": round_data["round"]}
        if round_data.get("is_final_round", False):
            round_attributes["isFinal"] = "true"
        round_element = ET.SubElement(rounds, "round", round_attributes)

        themes = ET.SubElement(round_element, "themes")
        for theme_data in round_data["themes"]:
            theme_element = ET.SubElement(themes, "theme", {"name": theme_data["theme"]})

            questions = ET.SubElement(theme_element, "questions")
            for question_data in theme_data["questions"]:
                print('question_data', question_data)
                question_element = ET.SubElement(questions, "question", {
                    "price": str(question_data["question_price"]),
                    "type": str(TYPE_CHOICES.get(question_data["question_type"], 'simple')),
                    "time": str(question_data.get("answer_time", 30))  # Default time is 30 seconds if not provided
                })

                params = ET.SubElement(question_element, "params")
                param_question = ET.SubElement(params, "param", {"name": "question", "type": "content"})

                # Додати самі питання
                item_element = ET.SubElement(param_question, "item")
                item_element.text = question_data["question"]

                # Додати файли, якщо є
                if question_data["question_file"]:
                    file_type = None
                    if question_data["content_type"] == 2:
                        file_type = "image"
                    elif question_data["content_type"] == 3:
                        file_type = "audio"
                    elif question_data["content_type"] == 4:
                        file_type = "video"

                    if file_type:
                        item_file_element = ET.SubElement(param_question, "item", {
                            "type": file_type,
                            "isRef": "True"
                        })
                        item_file_element.text = question_data["question_file"].split('/')[-1]

                right_element = ET.SubElement(question_element, "right")
                answer_element = ET.SubElement(right_element, "answer")
                answer_element.text = question_data["answer"]

    xml_str = ET.tostring(package, encoding='utf-8')
    pretty_xml = minidom.parseString(xml_str).toprettyxml(indent="    ")

    return pretty_xml


def create_archive(package_data):
    archive_name = f"package_{package_data['id']}.zip"
    archive_path = os.path.join(settings.MEDIA_ROOT, f'packages/{archive_name}')

    images_dir = os.path.join("temp", "Images")
    videos_dir = os.path.join("temp", "Video")
    audio_dir = os.path.join("temp", "Audio")
    os.makedirs(images_dir, exist_ok=True)
    os.makedirs(videos_dir, exist_ok=True)
    os.makedirs(audio_dir, exist_ok=True)

    pretty_xml = create_xml(package_data)

    xml_path = os.path.join("temp", "content.xml")
    with open(xml_path, "w", encoding="utf-8") as file:
        file.write(pretty_xml)

    for round_data in package_data["rounds"]:
        for theme_data in round_data["themes"]:
            for question_data in theme_data["questions"]:
                if question_data["question_file"]:
                    file_type = None
                    if question_data["content_type"] == 2:
                        file_type = images_dir
                    elif question_data["content_type"] == 3:
                        file_type = audio_dir
                    elif question_data["content_type"] == 4:
                        file_type = videos_dir

                    if file_type:
                        question_file_path = question_data["question_file"].lstrip("/media")

                        src_file_path = os.path.normpath(
                            os.path.join(settings.MEDIA_ROOT, question_file_path))

                        dest_file_path = os.path.join(file_type, os.path.basename(question_file_path))

                        if os.path.exists(src_file_path):
                            shutil.copy2(src_file_path, dest_file_path)
                        else:
                            print(f"Warning: File {src_file_path} does not exist and will not be added to the archive.")

    with zipfile.ZipFile(archive_path, 'w', zipfile.ZIP_DEFLATED) as zipf:
        zipf.write(xml_path, arcname="content.xml")

        for folder_name in [images_dir, videos_dir, audio_dir]:
            for root, _, files in os.walk(folder_name):
                for file in files:
                    file_path = os.path.join(root, file)
                    arcname = os.path.relpath(file_path, start="temp")
                    zipf.write(file_path, arcname=arcname)

    shutil.rmtree("temp")

    siq_archive_path = archive_path.replace('.zip', '.siq')
    os.rename(archive_path, siq_archive_path)

    if os.path.exists(archive_path):
        os.remove(archive_path)

    return siq_archive_path
