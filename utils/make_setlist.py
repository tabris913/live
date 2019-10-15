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
        elif ' ' in l[i]:
            l[i] = l[i].replace(' ', '_')
        elif l[i].startswith('///'):
            remove.insert(0, i)
    for i in remove:
        del l[i]
    pyperclip.copy(' '.join(l))


if __name__ == '__main__':
    s = '''承認欲求
see through
ANNIVERSARY
MUSIC
2月
手
淡い足跡
罠
妄想日記
Trick
ポジティブの魔法
ホソイコエ
Blood Vessel
プロポーズ
敬礼ボウイ
その未来へ
涙雨

デアイ=キセキ
循環
Re:Dreamer
one way
君色の朝'''

    convert(s)
