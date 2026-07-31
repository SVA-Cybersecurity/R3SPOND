import yaml
import os
import json

class Loader(yaml.SafeLoader):

    def __init__(self, stream):

        self._root = os.path.split(stream.name)[0]

        super(Loader, self).__init__(stream)

    def include(self, node):

        filename = os.path.join(self._root, self.construct_scalar(node))

        with open(filename, 'r') as f:
            return yaml.load(f, Loader)


Loader.add_constructor('!include', Loader.include)


def define_env(env):
    """ cache translations to avoid multiple file reads """
    translations = {}


    @env.macro
    def load_data(name):
        with open(f'docs/assets/data/{name}.yml', 'r') as f:
            return yaml.load(f, Loader)


    @env.macro
    def find_by_template_id(data, template_id):
        for item in data:
            if item["id"] == template_id:
                return item
        return None


    @env.macro
    def load_translations():
        if not translations:
            locales_dir = os.path.join(env.project_dir, 'docs/assets/locales')
            for lang in ['de', 'en']:
                filepath = os.path.join(locales_dir, f'{lang}.yml')
                if os.path.exists(filepath):
                    with open(filepath, 'r', encoding='utf-8') as f:
                        translations[lang] = yaml.load(f, Loader) or {}
                        f.close()


    @env.macro
    def export_js_translations():
        load_translations()

        lang = env.conf['theme'].get('language', 'de')

        lang_dict = translations.get(lang, translations.get('de', {}))

        js_data = json.dumps(lang_dict, ensure_ascii=False)

        return f"<script>window.translations = {js_data};</script>"


    @env.filter
    @env.macro
    def translate(key, **kwargs):
        load_translations()

        lang = env.conf['theme'].get('language', 'de')

        lang_dict = translations.get(lang, translations.get('de', {}))

        keys = key.split('.')
        value = lang_dict

        for k in keys:
            if isinstance(value, dict) and k in value:
                value = value[k]
            else:
                return f"**[{key} not found]**"

        result = str(value)

        """ replace custom placeholders in the translation string with provided values """

        for key, val in kwargs.items():
            placeholder = f"%{key}%"
            result = result.replace(placeholder, str(val))

        return result


    @env.macro
    def asset(path):
        desti_uri = getattr(env.page.file, 'desti_uri', '')

        if not desti_uri:
            return path

        desti_uri = desti_uri.replace('\\', '/')

        dir_path = os.path.dirname(desti_uri)

        if not dir_path:
            return path

        depth = len([d for d in dir_path.split('/') if d])

        return ("../" * depth) + path


    @env.macro
    def display_link(key: str, link: str, translation: bool = True):
        if translation:
            return f'[{translate(key)}]({link})'

        return f'[{key}]({link})'