# coding: utf-8

import math
import random
import datetime
import json


global localState, log

with open('../public/json/sid/songs.json', encoding='utf8') as songs:
    SONGS = json.load(songs)
with open('../public/json/sid/works.json', encoding='utf8') as works:
    WORKS = json.load(works)

N = 3
# l = list('ABCDEFG')
l = [SONGS[s]['name'] for s in WORKS['sid_al01']['songs']]
localState = {
    'targetA': '',
    'targetB': '',
    'result': {},
    'target_list': l.copy(),
    'asked_list': set()}
log = open(
    f'./choice_log/{datetime.datetime.now().strftime("%Y%m%d%H%M%S.%f")}.log',
    'w',
    encoding='utf8')


def name(target: str):
    return target


def calc(array: list):
    return (len(array) * (len(array) - 1)) // 2


def ask():
    targetA = name(localState["targetA"])
    targetB = name(localState["targetB"])
    print(
        f'---------------------------- ({calc(localState["target_list"]) - len(localState["asked_list"])})')
    if len(localState['target_list']) >= 2:
        print(f'which do you like, {targetA} or {targetB}?')
        print(f'1: I prefer {targetA} to {targetB}')
        print(f'2: I prefer {targetB} to {targetA}')
        print('3: I like the both')
        print(f'4: I don\'t know {targetA}')
        print(f'5: I don\'t know {targetB}')
        print('6: I don\'t know the both')
        chosen = input('? ')
        while chosen not in list('123456'):
            chosen = input('? ')
    else:
        print(f'7: I know {localState["target_list"][0]}')
        print(f'8: I don\'t know {localState["target_list"][0]}')
        chosen = input('? ')
        while chosen not in list('78'):
            chosen = input('? ')
    return chosen


def random_choice(choice_from: list, avoid_list: list = []):
    newFrom = list(set(choice_from) - set(avoid_list))
    return newFrom[math.floor(random.random() *
                              len(newFrom))] if newFrom else None


def like(better: str, worse: str, result: dict):
    result[better]['dislike'].append(worse)
    result[worse]['prefer'].append(better)


def check(result: dict, asked_list: set):
    def remove():
        to_remove = set()
        for k, v in result.items():
            if len(v['prefer']) >= N:
                to_remove |= set(v['same'] + v['dislike'] + [k])
            if k not in l:
                to_remove.add(k)
        for key in to_remove:
            del result[key]  # remove from result
            for k, v in result.items():
                result[k] = {
                    'prefer': list(filter(lambda x: x != key, v['prefer'])),
                    'same': list(filter(lambda x: x != key, v['same'])),
                    'dislike': list(filter(lambda x: x != key, v['dislike']))
                }
            if key in l:
                l.remove(key)  # remove from l
        for asked in list(filter(
                lambda x: x[0] in to_remove or x[1] in to_remove, asked_list)):
            asked_list.remove(asked)

    def innerCheckSame(id_, checked):
        newChecked = checked.copy()
        for id2 in result[id_]['same']:
            if id2 not in newChecked:
                newChecked = innerCheckSame(id2, newChecked | {id2})
        return newChecked

    def innerCheckDislike(id_, checked):
        newChecked = checked.copy()
        for id2 in result[id_]['dislike'] + result[id_]['same']:
            if id2 not in newChecked:
                newChecked = innerCheckDislike(id2, newChecked | {id2})
        return newChecked

    def innerCheckPrefer(id_, checked):
        newChecked = checked.copy()
        for id2 in result[id_]['prefer'] + result[id_]['same']:
            if id2 not in newChecked:
                newChecked = innerCheckPrefer(id2, newChecked | {id2})
        return newChecked

    # main
    remove()
    for sid in result:
        result[sid]['same'] = list(innerCheckSame(sid, set()) - {sid})

        checked = set(result[sid]['dislike'])
        for id2 in result[sid]['dislike'] + result[sid]['same']:
            checked |= innerCheckDislike(id2, checked)
        result[sid]['dislike'] = list(checked)

        checked = set(result[sid]['prefer'])
        for id2 in result[sid]['prefer'] + result[sid]['same']:
            checked |= innerCheckPrefer(id2, checked)
        result[sid]['prefer'] = list(checked)
    remove()
    # add to asked
    for k, v in result.items():
        for p in v['prefer']:
            asked_list.add(tuple({k, p}))
        for s in v['same']:
            asked_list.add(tuple({k, s}))
        for d in v['dislike']:
            asked_list.add(tuple({k, d}))


def answer(result: dict, target: list):

    def display_result(res: dict, depth: int):
        if len(res) == 1:
            print(f'{depth}: {name(list(res.keys())[0])}')
            log.write(f'{depth}: {name(list(res.keys())[0])}\n')
            return
        no_prefer = [k for k in res if not res[k]['prefer']]
        if no_prefer:
            for np in no_prefer[:]:
                no_prefer.extend(res[np]['same'])
                if res[np]['prefer']:
                    raise Exception('there is more pefer')
            print(f'{depth}: {", ".join(map(name, list(set(no_prefer))))}')
            log.write(
                f'{depth}: {", ".join(map(name, list(set(no_prefer))))}\n')
        else:
            raise Exception('there is no top')
        newRes = {
            k: {
                'prefer': [
                    k2 for k2 in v['prefer'] if k2 not in no_prefer],
                'same': v['same'],
                'dislike': v['dislike']} for k,
            v in res.items() if k not in no_prefer}
        if newRes and depth + len(no_prefer) <= N:
            display_result(newRes, depth + len(no_prefer))

    log.write(f'res: {result}\n')
    log.write(f'target: {target}\n')

    print('Your best songs')
    if result:
        print(result)
        display_result(result, 1)
    else:
        print('', ', '.join(target))


def select(value: str):
    targetA = localState['targetA']
    targetB = localState['targetB']

    nextA = targetA
    nextB = targetB
    result = localState['result'].copy()
    nextAsked = localState['asked_list'].copy()
    isDefined = len(localState['target_list']) <= N

    if targetA not in result:
        result[targetA] = {'prefer': [], 'same': [], 'dislike': []}
    if targetB not in result:
        result[targetB] = {'prefer': [], 'same': [], 'dislike': []}

    if value == '1':
        log.write(f'[{targetA} > {targetB}]\n')
        like(targetA, targetB, result)
        nextAsked.add(tuple({targetA, targetB}))
        check(result, nextAsked)
        if not isDefined and len(localState['target_list']) >= 1:
            nextA = random_choice(l, [targetA, targetB])
            if targetB not in l:
                nextB = random_choice(l, [nextA])
    elif value == '2':
        log.write(f'[{targetA} < {targetB}]\n')
        like(targetB, targetA, result)
        nextAsked.add(tuple({targetA, targetB}))
        check(result, nextAsked)
        if not isDefined and len(localState['target_list']) >= 1:
            nextB = random_choice(l, [targetA, targetB])
            if targetA not in l:
                nextA = random_choice(l, [nextB])
    elif value == '3':
        log.write(f'[{targetA} = {targetB}]\n')
        result[targetA]['same'].append(targetB)
        result[targetB]['same'].append(targetA)
        nextAsked.add(tuple({targetA, targetB}))
        check(result, nextAsked)
        if not isDefined and len(localState['target_list']) >= 2:
            nextA = random_choice(l, [targetA, targetB])
            nextB = random_choice(l, [nextA, targetB])
    elif value == '4':
        log.write(f'[delete {targetA}]\n')
        l.remove(targetA)
        check(result, nextAsked)
        if not isDefined and len(localState['target_list']) >= 1:
            nextA = random_choice(l, [targetB])
    elif value == '5':
        log.write(f'[delete {targetB}]\n')
        l.remove(targetB)
        check(result, nextAsked)
        if not isDefined and len(localState['target_list']) >= 1:
            nextB = random_choice(l, [targetA])
    elif value == '6':
        log.write(f'[delete {targetA}, {targetB}]\n')
        l.remove(targetA)
        l.remove(targetB)
        check(result, nextAsked)
        if not isDefined and len(localState['target_list']) >= 2:
            nextA = random_choice(l)
            nextB = random_choice(l, [nextA])
    else:
        print('your best songs:')
        if value == '7':
            print(f' 1: {l[0]}')
        else:
            print(' none')

        answer({k: v for k, v in result.items()
                if v['prefer'] + v['same'] + v['dislike']}, 0)
        l.remove(l[0])
        return

    if calc(l) <= len(nextAsked):
        # print('there is no more questions', l, nextAsked)
        answer({k: v for k, v in result.items()
                if v['prefer'] + v['same'] + v['dislike']}, l)
        l.clear()
        nextAsked.clear()
        nextA = None
        nextB = None
        return

    while tuple({nextA, nextB}) in nextAsked:
        print(nextA, nextB, nextAsked)
        nextA = random_choice(l)
        nextB = random_choice(l, [nextA])

    localState['targetA'] = nextA
    localState['targetB'] = nextB
    localState['result'] = result
    localState['target_list'] = l
    localState['asked_list'] = nextAsked

    log.write(f'res: {result}\n')
    log.write(f'target: {l}\n')

    for k, v in localState.items():
        print(f'[{k}]: {v}')


localState['targetA'] = random_choice(l)
localState['targetB'] = random_choice(l, [localState['targetA']])
while len(localState['target_list']):
    select(ask())

log.close()
