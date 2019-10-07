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
    s = '''06.01
TOUR 2012 「M&W」preview / 桐生市市民文化会館　シルクホール
06.06
TOUR 2012 「M&W」preview / 盛岡市民文化ホール　大ホール
06.08
TOUR 2012 「M&W」preview / 郡山市民文化センター　大ホール
06.10
TOUR 2012 「M&W」preview / 仙台サンプラザホール
06.12
TOUR 2012 「M&W」preview / 本多の森ホール
06.14
TOUR 2012 「M&W」preview / ホクト文化ホール
06.21
TOUR 2012 「M&W」preview / 愛知県芸術劇場　大ホール
06.22
TOUR 2012 「M&W」preview / 愛知県芸術劇場　大ホール
06.24
TOUR 2012 「M&W」preview / 岐阜市民会館
06.26
TOUR 2012 「M&W」preview / 倉敷市民会館
06.28
TOUR 2012 「M&W」preview / 松山市民会館
06.30
TOUR 2012 「M&W」preview / 滋賀県立芸術劇場 びわ湖ホール
07.02
TOUR 2012 「M&W」preview / なら100年会館
07.04
TOUR 2012 「M&W」preview / オリックス劇場
07.05
TOUR 2012 「M&W」preview / オリックス劇場
07.11
TOUR 2012 「M&W」preview / メディキッド県民文化センター 演劇ホール
07.13
TOUR 2012 「M&W」preview / 福岡市民会館
07.14
TOUR 2012 「M&W」preview / 宝山ホール
07.19
TOUR 2012 「M&W」preview / 帯広市民文化ホール　大ホール
07.21
TOUR 2012 「M&W」preview / 札幌ニトリ文化ホール
07.22
TOUR 2012 「M&W」preview / 札幌ニトリ文化ホール
07.26
TOUR 2012 「M&W」preview / 東京国際フォーラム　ホールA
07.27
TOUR 2012 「M&W」preview / 東京国際フォーラム　ホールA'''

    make_tour(s, 'm&w_preview', 2012)
