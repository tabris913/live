# coding: utf-8

import math
import random
import datetime
import json
import networkx as nx


global localState, log

with open('../public/json/sid/songs.json', encoding='utf8') as songs:
    SONGS = json.load(songs)
with open('../public/json/sid/works.json', encoding='utf8') as works:
    WORKS = json.load(works)

N = 3
# l = list('ABCDEFG')
l = [SONGS[s]['name'] for s in WORKS['sid_al01']['songs']]
localState = {
    'g': nx.DiGraph(),
    'targetA': '',
    'targetB': '',
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


def check():
    to_remove = []
    for node in localState['g']:
        pre = list(nx.predecessor(localState['g'].reverse(), node).keys())
        pre.remove(node)
        prefer = []
        for p in pre:
            prefer.extend(localState['g'].nodes[p]['songs'])
        if len(prefer) >= N:
            to_remove.extend(localState['g'].nodes[node]['songs'])
    print('to_remove', to_remove)
    localState['g'].remove_nodes_from(to_remove)
    for node in to_remove:
        localState['target_list'].remove(node)

    connected = []
    for s in localState['g']:
        for t in localState['g']:
            if s == t:
                continue

            if nx.has_path(localState['g'], s, t):
                connected.append(tuple({s, t}))

    return connected


def answer():
    log.write(f'nodes: {localState["g"].nodes()}\n')
    log.write(f'edges: {localState["g"].edges()}\n')

    print('Your best songs')
    s, t = [], []
    for node in localState['g']:
        if len(list(localState['g'].successors(node))) == 0:
            s.append(node)
        if len(list(localState['g'].predecessors(node))) == 0:
            t.append(node)
    if len(s) != 1:
        raise Exception('no or multi sources')
    if len(t) != 1:
        raise Exception('no or multi target')

    print(list(nx.all_simple_paths(localState['g'], s[0], t[0])))


def select(value: str):
    targetA = localState['targetA']
    targetB = localState['targetB']

    nextA = targetA
    nextB = targetB
    nextAsked = localState['asked_list'].copy()
    isDefined = False  # len(localState['target_list']) <= N

    # if targetA not in localState['g']:
    #     localState['g'].add_node(targetA, songs=[targetA])
    # if targetB not in localState['g']:
    #     localState['g'].add_node(targetB, songs=[targetB])

    if value == '1':
        log.write(f'[{targetA} > {targetB}]\n')
        if targetA not in localState['g']:
            localState['g'].add_node(targetA, songs=[targetA])
        if targetB not in localState['g']:
            localState['g'].add_node(targetB, songs=[targetB])
        localState['g'].add_edge(targetA, targetB)
        nextAsked = check()
        if not isDefined and len(localState['target_list']) >= 1:
            nextA = random_choice(
                localState['target_list'], [targetA, targetB])
            if targetB not in localState['target_list']:
                nextB = random_choice(localState['target_list'], [nextA])
    elif value == '2':
        log.write(f'[{targetA} < {targetB}]\n')
        if targetA not in localState['g']:
            localState['g'].add_node(targetA, songs=[targetA])
        if targetB not in localState['g']:
            localState['g'].add_node(targetB, songs=[targetB])
        localState['g'].add_edge(targetB, targetA)
        nextAsked = check()
        if not isDefined and len(localState['target_list']) >= 1:
            nextB = random_choice(
                localState['target_list'], [targetA, targetB])
            if targetA not in localState['target_list']:
                nextA = random_choice(localState['target_list'], [nextB])
    elif value == '3':
        log.write(f'[{targetA} = {targetB}]\n')
        if targetA not in localState['g']:
            if targetB not in localState['g']:
                localState['g'].add_node(targetA, songs=[targetA, targetB])
            else:
                localState['g'].nodes[targetB]['songs'].append(targetA)
        else:
            if targetB not in localState['g']:
                localState['g'].nodes[targetA]['songs'].append(targetB)
            else:
                localState['g'].nodes[targetA]['songs'].extend(
                    localState['g'].nodes[targetB]['songs'])
                localState['g'].add_edges_from(
                    [(targetA, n) for n in localState['g'].successors(targetB)])
                localState['g'].add_edges_from(
                    [(n, targetA) for n in localState['g'].predecessors(targetB)])
                localState['g'].remove_node(targetB)
        localState['target_list'].remove(targetB)
        nextAsked = check()
        if not isDefined and len(localState['target_list']) >= 2:
            nextA = random_choice(
                localState['target_list'], [targetA, targetB])
            nextB = random_choice(localState['target_list'], [nextA, targetB])
    elif value == '4':
        log.write(f'[delete {targetA}]\n')
        if targetA in localState['g']:
            localState['g'].remove_node(targetA)
        localState['target_list'].remove(targetA)
        nextAsked = check()
        if not isDefined and len(localState['target_list']) >= 1:
            nextA = random_choice(localState['target_list'], [targetB])
    elif value == '5':
        log.write(f'[delete {targetB}]\n')
        if targetB in localState['g']:
            localState['g'].remove_node(targetB)
        localState['target_list'].remove(targetB)
        nextAsked = check()
        if not isDefined and len(localState['target_list']) >= 1:
            nextB = random_choice(localState['target_list'], [targetA])
    elif value == '6':
        log.write(f'[delete {targetA}, {targetB}]\n')
        if targetA in localState['g']:
            localState['g'].remove_node(targetA)
        if targetB in localState['g']:
            localState['g'].remove_node(targetB)
        llocalState['target_list'].remove(targetA)
        localState['target_list'].remove(targetB)
        nextAsked = check()
        if not isDefined and len(localState['target_list']) >= 2:
            nextA = random_choice(localState['target_list'])
            nextB = random_choice(localState['target_list'], [nextA])
    else:
        print('one target')
        return

    try:
        nx.cycles.find_cycle(localState['g'])
        raise Exception('has cycle')
    except nx.NetworkXNoCycle:
        ...  # ok

    if calc(localState['target_list']) <= len(nextAsked):
        # print('there is no more questions', l, nextAsked)
        answer()
        localState['target_list'].clear()
        nextAsked.clear()
        nextA = None
        nextB = None
        return

    while tuple({nextA, nextB}) in nextAsked:
        print(nextA, nextB, nextAsked)
        nextA = random_choice(localState['target_list'])
        nextB = random_choice(localState['target_list'], [nextA])

    localState['targetA'] = nextA
    localState['targetB'] = nextB
    localState['asked_list'] = nextAsked

    log.write(f'nodes: {localState["g"].nodes()}\n')
    log.write(f'edges: {localState["g"].edges()}\n')

    for k, v in localState.items():
        if k == 'g':
            print(f'[g]: {localState["g"].nodes()}')
            print(f'[g]: {localState["g"].edges()}')
        else:
            print(f'[{k}]: {v}')


localState['targetA'] = random_choice(l)
localState['targetB'] = random_choice(l, [localState['targetA']])
while len(localState['target_list']):
    select(ask())

log.close()
