# encoding: utf-8

import pyperclip


def convert(string: str) -> str:
    l = string.split('\n')
    remove = []
    for i in range(len(l)):
        if ';;' in l[i]:
            l[i] = l[i].split(';;')[0].replace(' ', '_')
        if '@@' in l[i]:
            l[i] = l[i].split('@@')[0].replace(' ', '_')

        if l[i] == '':
            l[i] = 'encore'
        elif l[i] == '蜜指～ミツユビ～':
            l[i] = '蜜指_～ミツユビ～'
        elif l[i] == '吉開学17歳(無職)':
            l[i] = '吉開学17歳_(無職)'
        elif l[i] == '楽園':
            l[i] = '落園'
        elif l[i] == 'Cafe de Bossa':
            l[i] = 'Café_de_Bossa'
        elif l[i] == 'デアイ=キセキ':
            l[i] = 'デアイ＝キセキ'
        elif l[i] == '九龍':
            l[i] = '九龍_-NINE_HEADS_RODEO_SHOW-'
        elif l[i] == '革命開花':
            l[i] = '革命開花_-Revolutionary_Blooming-'
        elif l[i] == 'G3':
            l[i] = '極彩極色極道歌_<G3>'
        elif ' ' in l[i]:
            l[i] = l[i].replace(' ', '_')
        elif l[i].startswith('///'):
            remove.insert(0, i)
    for i in remove:
        del l[i]
    pyperclip.copy(' '.join(l))


if __name__ == '__main__':
    s = '''the beautiful name
RAINBOWS
ヴェルヴェット
華一匁
RED CARPET GOING ON
革命開花
ハイカラなる輪舞曲
九龍
闇ニ散ル桜
すべてへ

春夏秋冬;;(with maya&マモ)'''

    convert(s)
