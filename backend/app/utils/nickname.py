import random


def nickName() :
    save = []

    while True : 

        first = ('예쁜', '잘생긴', '멋진', '행복한', '따뜻한', '재미있는', '훌륭한', '귀여운', '친절한', 
                '매력적인', '순수한', '상냥한', '예의바른', '정직한', '성실한', '공정한', '부드러운', 
                '우아한', '즐거운', '밝은', '특별한', '지혜로운', '적극적인', '솔직한', '활발한', 
                '뜨거운', '용감한', '아름다운','곧은', '사랑스러운','달리는', '뛰는', '구경하는', '수영하는', 
                '수다떠는','외치는','마시는','먹는','잠자는','헤엄치는')

        last = ('장미', '개나리', '튤립', '목화', '백합', '카라', '히아신스', '히비스커스', '라일락', '목련', 
                '소나무', '민들레', '달맞이꽃', '리시안셔스', '소나무', '꿀벌', '나비', '해바라기','벚꽃', 
                '로즈마리', '아스터', '에델바이스', '아도니스', '고무나무', '능소화', '담쟁이덩굴', '데이지', 
                '동백꽃', '매화', '모과나무', '사과나무', '배나무', '배꽃', '사과꽃', '밤나무', '호두나무')
        
        firstName = random.choice(first)
        lastName = random.choice(last)

        nickName = f'{firstName} {lastName}'

        if nickName not in save :
            save.append(nickName)
            print(f'닉네임 {nickName}이 저장되었습니다')
            break
        else :
            print(f'{nickName}은 이미 있는 nickname입니다.')
            pass        
    

    return nickName
