# coding: utf-8

import argparse
import json
import os
from typing import List, Sequence

import pyperclip


def add_live(
        live_uid: str,
        name: str = '',
        date: str = '',
        place: str = '',
        songs: Sequence[str] = [],
        is_tour: bool = False
):
    SONGS = json.load(open(SONGS_JSON, 'r', encoding='utf-8'))
    CONVERTED_SONGS = {SONGS[uid]['name']: uid for uid in SONGS}

    year = date.split('-')[0]
    uid = live_uid if is_tour else f'{year}_{live_uid}'
    title = '_'.join(uid.split('_')[:-1]) if is_tour else uid

    # make {live_uid}.json
    obj = {
        'uid': uid,
        'name': name,
        'date': date,
        'place': place,
        'setlist': [None] * len(songs),
        'is_tour': is_tour
    }
    for idx, song in enumerate(songs):
        if song != 'encore':
            if (song in CONVERTED_SONGS):
                obj['setlist'][idx] = CONVERTED_SONGS[song]
            else:
                print(f'{song} is unknown')
                obj['setlist'][idx] = f'[unknown] {song}'
        else:
            obj['setlist'][idx] = song
    json.dump(
        obj,
        open(
            LIVE_JSON.format(uid),
            'w',
            encoding='utf-8'
        ),
        ensure_ascii=False
    )

    # add to lives.json
    if os.path.exists(LIVES_JSON):
        LIVES = json.load(open(LIVES_JSON, 'r', encoding='utf-8'))
    else:
        LIVES = {}
    if year in LIVES:
        LIVES[year].update({
            title: {
                'uid': title,
                'name': name if not is_tour else ' '.join(name.split(' ')[:-1]),
                'is_tour': is_tour,
                'number': LIVES[year][title]['number'] + 1 if is_tour and title in LIVES[year] else 1
            }
        })
    else:
        LIVES[year] = {
            title: {
                'uid': title,
                'name': name,
                'is_tour': is_tour,
                'number': 1
            }
        }

    json.dump(
        LIVES,
        open(
            LIVES_JSON,
            'w',
            encoding='utf-8'
        ),
        ensure_ascii=False
    )

    # sort lives.json
    for k in LIVES:
        LIVES[k] = dict(
            sorted(
                LIVES[k].items(),
                key=lambda key_val: json.load(
                    open(
                        LIVE_JSON.format(
                            f'{key_val[0]}_01') if LIVES[k][key_val[0]]['is_tour'] else LIVE_JSON.format(key_val[0]),
                        'r',
                        encoding='utf-8'
                    )
                )['date']
            )
        )
    LIVES = dict(sorted(LIVES.items(), key=lambda key_val: int(key_val[0])))

    json.dump(
        LIVES,
        open(
            LIVES_JSON,
            'w',
            encoding='utf-8'
        ),
        ensure_ascii=False
    )

    return obj


def add_song(songs: Sequence[str]):
    if os.path.exists(SONGS_JSON):
        SONGS = json.load(open(SONGS_JSON, 'r', encoding='utf-8'))
    else:
        SONGS = {}
    CONVERTED_SONGS = {SONGS[uid]['name']: uid for uid in SONGS}

    size = len(SONGS)
    for idx, song in enumerate(songs, 1):
        if song not in CONVERTED_SONGS:
            uid = f'{ARTIST_UID}{size+idx:03d}'
            SONGS.update({uid: {'uid': uid, 'name': song}})
    # sort
    SONGS = dict(sorted(SONGS.items(),
                        key=lambda key_val: int(key_val[0][-3:])))
    json.dump(
        SONGS,
        open(
            SONGS_JSON,
            'w',
            encoding='utf-8'
        ),
        ensure_ascii=False
    )


def class_order(_class: str):
    return {
        'sg': 0,
        'ds': 1,  # dvd sg
        'di': 2,  # distribution
        'al': 3,
        'ba': 4,  # best
        'ca': 5,  # compilation
        'cv': 6,  # cover
        'ra': 7,  # remix
        'sv': 8,  # self
        'ot': 9,  # other
    }[_class.split('_')[1][:2]]


def add_work(name: str, songs: Sequence[str], _class: str, date: str = ''):
    if os.path.exists(WORKS_JSON):
        WORKS = json.load(open(WORKS_JSON, 'r', encoding='utf-8'))
    else:
        WORKS = {}
    others = {} if 'others' not in WORKS else WORKS['others']
    ex = {key: val for key, val in WORKS.items() if key != 'others'}
    SONGS = json.load(open(SONGS_JSON, 'r', encoding='utf-8'))
    CONVERTED_SONGS = {SONGS[uid]['name']: uid for uid in SONGS}

    num = 0
    for k in ex:
        if k.split('_')[1].startswith(_class) and len(k.split('_')) == 2:
            num += 1
    uid = f'{ARTIST_UID}_{_class}{num + 1:02d}'
    obj = {uid: {'uid': uid, 'name': name, 'date': date, 'songs': [
        CONVERTED_SONGS[song] if song in CONVERTED_SONGS else 'unknown' for song in songs
    ]}}
    if 'unknown' in obj[uid]['songs']:
        print(f'unknown song is in {uid} ({name})')
        print(obj[uid]['songs'])
    ex.update(obj)
    # sort
    ex = dict(sorted(ex.items(), key=lambda key_val: (
        ex[key_val[0]]['date'], class_order(key_val[0]), ex[key_val[0]]['name']
    )))
    ex.update({'others': others})
    json.dump(ex, open(WORKS_JSON, 'w', encoding='utf-8'), ensure_ascii=False)


def convert_songs_to_id(songs: Sequence[str]) -> List[str]:
    if os.path.exists(SONGS_JSON):
        SONGS = json.load(open(SONGS_JSON, 'r', encoding='utf-8'))
    else:
        SONGS = {}
    CONVERTED_SONGS = {SONGS[uid]['name']: uid for uid in SONGS}

    return [CONVERTED_SONGS[song] if song in CONVERTED_SONGS else 'encore' if song ==
            '' else f'[unknown] {song}' for song in songs]


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
    return ' '.join(l)


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
            f'{year}_{tid}_{count:02d} {name}_#{count:02d} {year}-{date} {place} True '
        )
        count += 1

    return '\n'.join(l2)


def convert_strings(string: str) -> str:
    return string.replace('_', ' ')


def start_adding_songs(args: argparse.Namespace):
    if args.fill_space:
        with open(f'setlist_{args.artist}.txt', 'r', encoding='utf-8') as file:
            converted = convert(file.read())
        pyperclip.copy(converted)
    elif args.uid:
        with open(f'setlist_{args.artist}.txt', 'r', encoding='utf-8') as file:
            ids = convert_songs_to_id(file.read())
        pyperclip.copy(str(ids))
    else:
        with open(f'songs.txt', 'r', encoding='utf-8') as file:
            songs = map(str.strip, file.readlines())
            add_song(songs)


def start_adding_works(args: argparse.Namespace):
    with open('works.txt', 'r', encoding='utf-8') as file:
        works = map(str.strip, file.readlines())
        for work in works:
            name, _class, date, *songs = work.split('')
            songs = map(lambda s: s.replace('_', ' '), songs)
            add_work(name.replace('_', ' '), songs, _class, date)


def start_adding_lives(args: argparse.Namespace):
    with open('lives.txt', 'r', encoding='utf-8') as file:
        lives = map(str.strip, file.readlines())
        for live in lives:
            uid, name, date, place, is_tour, *songs = live.split(' ')
            add_live(uid, convert_strings(name), date, convert_strings(
                place), list(map(convert_strings, songs)), eval(is_tour))


def start_adding_tour(args: argparse.Namespace):
    with open('tour.txt', 'r', encoding='utf-8') as file:
        tour = make_tour(file.read(), args.id, args.year)
    pyperclip.copy(tour)


if __name__ == "__main__":
    # print(add_live('sample', songs=['encore', '眩暈'], date='2019-10-01'))
    # add_song(['モノクロのキス', 'season'])
    # add_work('sample', ['眩暈'], 'cv', '2008-08-13')

    parser = argparse.ArgumentParser()
    parser.add_argument('artist', choices=['alicenine', 'sid'])
    subparsers = parser.add_subparsers()

    song = subparsers.add_parser('song')
    song.add_argument('-u', '--uid', action='store_true')
    song.add_argument('-f', '--fill-space', action='store_true')
    song.set_defaults(start=start_adding_songs)

    work = subparsers.add_parser('work')
    work.set_defaults(start=start_adding_works)

    live = subparsers.add_parser('live')
    live.set_defaults(start=start_adding_lives)

    tour = subparsers.add_parser('tour')
    tour.add_argument('id')
    tour.add_argument('year', type=int)
    tour.set_defaults(start=start_adding_tour)

    args = parser.parse_args()
    ARTIST_UID = args.artist
    SONGS_JSON = f'../public/json/{ARTIST_UID}/songs.json'
    LIVES_JSON = f'../public/json/{ARTIST_UID}/lives.json'
    LIVE_JSON = f'../public/json/{ARTIST_UID}/lives/{{}}.json'
    WORKS_JSON = f'../public/json/{ARTIST_UID}/works.json'

    if os.path.exists(f'../public/json/{ARTIST_UID}') is False:
        os.mkdir(f'../public/json/{ARTIST_UID}')
        os.mkdir(f'../public/json/{ARTIST_UID}/lives')

    args.start(args)
