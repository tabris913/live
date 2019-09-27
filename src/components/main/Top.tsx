import { Button, Col, Popover, Row } from 'antd';
import * as React from 'react';

import PageName, { toPublicUrl } from '../../constants/PageName';
import { ITopButton, MainProps } from '../../models/Main';
import { getArtists } from '../../utils/ArtistUtils';

// music
// cd
// book

const Top = (props: MainProps) => {
  const topButtons: ITopButton[] = getArtists().map(artist => ({
    label: artist.name,
    linkto: PageName.ARTIST,
    message: undefined,
    query: { id: artist.uid },
  }));
  return (
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
                          toPublicUrl(linkto || PageName.UNDEFINED, query && query.id ? [query.id] : undefined)
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
  );
};

export default Top;
