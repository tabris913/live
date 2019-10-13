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
    s = '''06.17
SID collaboration TOUR 2019 / Zepp Tokyo
06.20
SID collaboration TOUR 2019 / Zepp Nagoya
06.21
SID collaboration TOUR 2019 / Zepp Osaka Bayside
06.27
SID collaboration TOUR 2019 / Zepp DiverCity TOKYO'''

    make_tour(s, 'collaboration', 2019)
