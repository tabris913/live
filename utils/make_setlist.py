# encoding: utf-8

import pyperclip


def convert(string: str) -> str:
    l = string.split('\n')
    for i in range(len(l)):
        if l[i] == '':
            l[i] = 'encore'
        elif l[i] == '蜜指～ミツユビ～':
            l[i] = '蜜指_～ミツユビ～'
        elif l[i] == '吉開学17歳(無職)':
            l[i] = '吉開学17歳_(無職)'
        elif ' ' in l[i]:
            l[i] = l[i].replace(' ', '_')
    pyperclip.copy(' '.join(l))


if __name__ == '__main__':
    s = '''夏恋
smile
Re:Dreamer
蜜指～ミツユビ～
妄想日記
赤紙シャッフォー
合鍵
刺と猫
御手紙
モノクロのキス
循環
Sweet?
Dear Tokyo

眩暈
プロポーズ
dummy
吉開学17歳(無職)

エール'''

    convert(s)
