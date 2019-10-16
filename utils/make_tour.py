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
    s = '''10.14
ONEMAN TOUR 2019「革命開花 ep1. -絶対"黒"領域-」 / 札幌KRAPS HALL
10.17
ONEMAN TOUR 2019「革命開花 ep1. -絶対"黒"領域-」 / 福岡DRUM SON
10.19
ONEMAN TOUR 2019「革命開花 ep1. -絶対"黒"領域-」 / 大阪MUSE
10.20
ONEMAN TOUR 2019「革命開花 ep1. -絶対"黒"領域-」 / 名古屋ell.FITSALL
10.25
ONEMAN TOUR 2019「革命開花 ep1. -絶対"黒"領域-」 / 恵比寿LIQUIDROOM
11.18
ONEMAN TOUR 2019「革命開花 ep1. -絶対"黒"領域-」 / 仙台HooK'''

    make_tour(s, 'revol_bloom_ep1', 2019)
