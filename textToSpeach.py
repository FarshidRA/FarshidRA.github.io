import pyttsx3
from kivy.app import App
from kivy.uix.button import Button

class TextToSpeechApp(App):
    def build(self):
        button = Button(text='convert', on_press=self.convert_text_to_speech)
        return button

    def convert_text_to_speech(self, instance):
        text = ("Welcome! I'm Farshid Ryahi, a Computer Engineering graduate with a bachelor’s degree in Computer Hardware. "
                "Since 2016, I have gained diverse experience in various technology and management roles, including network administration, "
                "software sales, website management, social media management, hardware production, and network equipment sales. "
                "My career has provided me with extensive skills in HTML, CSS, and Photoshop, alongside proficiency in social media management, "
                "CRM systems, and VoIP technologies. I thrive in dynamic environments where I can leverage my technical expertise and leadership abilities "
                "to drive successful outcomes. I am passionate about technology and committed to delivering high-quality solutions and strategies. "
                "My background in both technical and managerial roles equips me with a comprehensive understanding of the industry, "
                "making me well-suited for a range of challenges in the technology sector. Feel free to Contact me by submitting the form. I will get back to you as soon as possible.")
        
        engine = pyttsx3.init()
        # تغییر صدای موتور به صدای مرد
        voices = engine.getProperty('voices')
        engine.setProperty('voice', voices[0].id)  # معمولا صدای مرد در لیست صداها اولین صدا است
        engine.setProperty('rate', 150)  # تنظیم سرعت گفتار
        engine.save_to_file(text, r'd:\Users\Farshid\Desktop\mygit\audio\welcome.mp3')
        engine.runAndWait()

TextToSpeechApp().run()
