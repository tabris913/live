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
    s = '''04.09
SID TOUR 2014 OUTSIDER / 松戸・森のホール21
04.12
SID TOUR 2014 OUTSIDER / 愛知県芸術劇場 大ホール
04.13
SID TOUR 2014 OUTSIDER / 愛知県芸術劇場 大ホール
04.16
SID TOUR 2014 OUTSIDER / 渋谷公会堂
04.17
SID TOUR 2014 OUTSIDER / 渋谷公会堂
04.20
SID TOUR 2014 OUTSIDER / ベイシア文化ホール
04.22
SID TOUR 2014 OUTSIDER / コラニー文化ホール
04.25
SID TOUR 2014 OUTSIDER / 新潟県民会館
04.27
SID TOUR 2014 OUTSIDER / 富山オーバードホール
04.29
SID TOUR 2014 OUTSIDER / 秋田市文化会館
05.01
SID TOUR 2014 OUTSIDER / 宇都宮市文化会館
05.04
SID TOUR 2014 OUTSIDER / 福岡サンパレス
05.05
SID TOUR 2014 OUTSIDER / 福岡サンパレス
05.08
SID TOUR 2014 OUTSIDER / 中野サンプラザホール
05.09
SID TOUR 2014 OUTSIDER / 中野サンプラザホール
05.16
SID TOUR 2014 OUTSIDER / Macpherson Stadium (Hong Kong)
05.23
SID TOUR 2014 OUTSIDER / ATT Show Box (Taiwan)
05.24
SID TOUR 2014 OUTSIDER / ATT Show Box (Taiwan)
06.06
SID TOUR 2014 OUTSIDER / 広島上野学園ホール
06.08
SID TOUR 2014 OUTSIDER / 鳴門市文化会館
06.14
SID TOUR 2014 OUTSIDER / 東京エレクトロンホール宮城
06.15
SID TOUR 2014 OUTSIDER / 東京エレクトロンホール宮城
06.18
SID TOUR 2014 OUTSIDER / よこすか芸術劇場
06.21
SID TOUR 2014 OUTSIDER / 札幌　ニトリ文化ホール
06.22
SID TOUR 2014 OUTSIDER / 札幌　ニトリ文化ホール
06.26
SID TOUR 2014 OUTSIDER / 茨城県立県民文化センター
06.30
SID TOUR 2014 OUTSIDER / 大宮ソニックシティ
07.05
SID TOUR 2014 OUTSIDER / 神戸ワールド記念ホール
07.06
SID TOUR 2014 OUTSIDER / 神戸ワールド記念ホール'''

    make_tour(s, 'outsider_tour', 2014)
