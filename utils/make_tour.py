# coding: utf-8

import pyperclip


def make_tour(strings: str, tid: str, year: int):
    l = list(map(lambda x: x.split(' / '), strings.split('\n')))
    i, count = 0, 1

    l2 = []
    while i < len(l):
        date = l[i][0].replace('.', '-')
        i += 1

        name, place = map(lambda x: x.replace(' ', '_'), l[i])
        i += 1
        l2.append(
            f'{tid}_{count:02d} {name}_#{count:02d} {year}-{date} {place} True '
        )
        count += 1

    pyperclip.copy('\n'.join(l2))


if __name__ == "__main__":
    s = '''08.16
シド 女限定ツアー2015“乙魂-otodama-” / 仙台Rensa
08.26
シド 女限定ツアー2015“乙魂-otodama-” / Zepp Nagoya
09.05
シド 女限定ツアー2015“乙魂-otodama-” / Zepp Namba
09.12
シド 女限定ツアー2015“乙魂-otodama-” / Zepp Fukuoka
09.26
シド 女限定ツアー2015“乙魂-otodama-” / 幕張メッセ イベントホール'''

    make_tour(s, 'otodama_women', 2015)
