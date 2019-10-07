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
    s = '''03.01
「dead stock TOUR 2011」 / 仙台サンプラザホール
03.02
「dead stock TOUR 2011」 / 仙台サンプラザホール
03.05
「dead stock TOUR 2011」 / 新潟県民会館
03.06
「dead stock TOUR 2011」 / 新潟県民会館
03.26
「dead stock TOUR 2011」 / 福岡マリンメッセ
04.03
「dead stock TOUR 2011」 / 日本ガイシホール
04.09
「dead stock TOUR 2011」 / 大阪城ホール
04.10
「dead stock TOUR 2011」 / 大阪城ホール
04.16
「dead stock TOUR 2011」 / 国立代々木競技場第一体育館
04.17
「dead stock TOUR 2011」 / 国立代々木競技場第一体育館
06.11
「dead stock TOUR 2011」 / 札幌ニトリ文化ホール
06.12
「dead stock TOUR 2011」 / 札幌ニトリ文化ホール'''

    make_tour(s)
