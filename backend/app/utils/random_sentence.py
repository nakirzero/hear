import random

def get_random_sentence():
    random_sentences = [
        "옛날 옛적에 작은 마을에...",
        "한 여름 밤의 꿈 속에서...",
        "바닷가에서 파도 소리를 들으며...",
        "깊은 숲속의 어둠을 헤치며..."
    ]
    return random.choice(random_sentences)
