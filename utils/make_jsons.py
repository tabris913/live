# coding: utf-8

import json
import os
from typing import List

import pyperclip

ARTIST_UID = 'alicenine'
SONGS_JSON = f'../public/json/{ARTIST_UID}/songs.json'
LIVES_JSON = f'../public/json/{ARTIST_UID}/lives.json'
LIVE_JSON = f'../public/json/{ARTIST_UID}/lives/{{}}.json'
WORKS_JSON = f'../public/json/{ARTIST_UID}/works.json'

if os.path.exists(f'../public/json/{ARTIST_UID}') is False:
    os.mkdir(f'../public/json/{ARTIST_UID}')
    os.mkdir(f'../public/json/{ARTIST_UID}/lives')


def add_live(
        live_uid: str,
        name: str = '',
        date: str = '',
        place: str = '',
        songs: List[str] = [],
        is_tour: bool = False
):
    SONGS = json.load(open(SONGS_JSON, 'r', encoding='utf-8'))
    CONVERTED_SONGS = {SONGS[uid]['name']: uid for uid in SONGS}

    year = date.split('-')[0]
    uid = f'{year}_{live_uid}'
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


def add_song(songs: List[str]):
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


def add_work(name: str, songs: List[str], _class: str, date: str = ''):
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


def convert_songs_to_id(songs: List[str]) -> List[str]:
    if os.path.exists(SONGS_JSON):
        SONGS = json.load(open(SONGS_JSON, 'r', encoding='utf-8'))
    else:
        SONGS = {}
    CONVERTED_SONGS = {SONGS[uid]['name']: uid for uid in SONGS}

    return [CONVERTED_SONGS[song] if song in CONVERTED_SONGS else 'encore' if song ==
            '' else f'[unknown] {song}' for song in songs]


if __name__ == "__main__":
    # print(add_live('sample', songs=['encore', '眩暈'], date='2019-10-01'))
    # add_song(['モノクロのキス', 'season'])
    # add_work('sample', ['眩暈'], 'cv', '2008-08-13')

    # add songs
    if False:
        with open('songs.txt', 'r', encoding='utf-8') as file:
            songs = map(str.strip, file.readlines())
            add_song(songs)

    # add work
    if False:
        with open('works.txt', 'r', encoding='utf-8') as file:
            works = map(str.strip, file.readlines())
            for work in works:
                name, _class, date, *songs = work.split(' ')
                songs = map(lambda s: s.replace('_', ' '), songs)
                add_work(name.replace('_', ' '), songs, _class, date)
                # print(list(songs))

    # add live
    if True:
        with open('lives.txt', 'r', encoding='utf-8') as file:
            lives = map(str.strip, file.readlines())
            for live in lives:
                uid, name, date, place, is_tour, *songs = live.split(' ')
                add_live(
                    uid,
                    name.replace(
                        '_',
                        ' '),
                    date,
                    place,
                    list(map(lambda x: x.replace('_', ' '), songs)),
                    eval(is_tour)
                )

    if False:
        cl = convert_songs_to_id('''闇ニ散ル桜
-Dice-
Le Grand Bleu
Phoenix
RUMWOLF
造花の代償
秘密
Scarlet
ハイカラなる輪舞曲
開戦前夜
道化師
九龍 -NINE HEADS RODEO SHOW-
荊棘

革命開花 -Revolutionary Blooming-
ZERO
DEAD SCHOOL SCREAMING
RAINBOWS'''.split('\n'))
        pyperclip.copy(str(cl))
