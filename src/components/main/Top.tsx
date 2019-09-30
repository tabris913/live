import { Button, Col, Popover, Row, Spin } from 'antd';
import * as React from 'react';

import PageName, { toPublicUrl } from '../../constants/PageName';
import { ITopButton, MainProps, Uid } from '../../models/Main';

// music
// cd
// book

const Top = (props: MainProps<Uid>) => {
  const topButtons: Array<ITopButton<Uid>> = React.useMemo(
    () =>
      (props.content &&
        props.content.artists &&
        Object.values(props.content.artists).reduce(
          (preArtist, curArtist) =>
            preArtist.concat({
              label: curArtist.name,
              linkto: PageName.ARTIST,
              message: undefined,
              query: { id: curArtist.uid },
            }),
          [] as Array<ITopButton<Uid>>
        )) ||
      [],
    [props.content]
  );

  return props.content && props.content.artists ? (
    <Row style={{ overflowY: 'auto' }}>
      {topButtons.map(({ label, linkto, message, popOver, query }, idx) => (
        <>
          <Col style={{ padding: 5 }} key={idx}>
            <Popover content={popOver} trigger="click" placement="right">
              <Button
                type="link"
                style={{ fontSize: 30, height: '100%' }}
                onClick={
                  popOver
                    ? undefined
                    : () =>
                        props.history.push(
                          toPublicUrl(
                            linkto || PageName.UNDEFINED,
                            query && query.id ? [query.id as string] : undefined
                          )
                        )
                }
              >
                {label}
              </Button>
            </Popover>
          </Col>
          <Col style={{ paddingLeft: 25 }}>{message}</Col>
        </>
      ))}
    </Row>
  ) : (
    <Spin />
  );
};

export default Top;
