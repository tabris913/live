# encoding: utf-8

import pyperclip


def convert(string: str) -> str:
    l = string.split('\n')
    remove = []
    for i in range(len(l)):
        if ';;' in l[i]:
            l[i] = l[i].split(';;')[0].replace(' ', '_')

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
        elif ' ' in l[i]:
            l[i] = l[i].replace(' ', '_')
        elif l[i].startswith('///'):
            remove.insert(0, i)
    for i in remove:
        del l[i]
    pyperclip.copy(' '.join(l))


if __name__ == '__main__':
    s = '''コナゴナ
Dear Tokyo
硝子の瞳
泣き出した女と虚無感
眩暈
one way
ANNIVERSARY'''

    convert(s)
