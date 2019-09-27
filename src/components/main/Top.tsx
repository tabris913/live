import { Button, Col, Popover, Row } from 'antd';
import * as React from 'react';

import PageName, { toPublicUrl } from '../../constants/PageName';
import { MainProps } from '../../models/Main';

// music
// cd
// book

const Top = (props: MainProps) => {
  // このinterfaceつくろう
  const topButtons: any[] = [
    // {
    //   label: 'Event',
    //   linkto: PageName.EVENT_LIST,
    //   message: <p>→まだ中途半端だけど原型は出来てる</p>,
    //   popOver: (
    //     <div>
    //       <p>
    //         <Button
    //           type="link"
    //           onClick={() => props.history.push(toPublicUrl(PageName.EVENT_LIST || PageName.UNDEFINED))}
    //         >
    //           通常イベント
    //         </Button>
    //       </p>
    //       <p>
    //         <Button
    //           type="link"
    //           onClick={() => props.history.push(toPublicUrl(PageName.EVENT_LIST || PageName.UNDEFINED, ['special']))}
    //         >
    //           スペシャルイベント
    //         </Button>
    //       </p>
    //       <p>
    //         <Button
    //           type="link"
    //           onClick={() => props.history.push(toPublicUrl(PageName.EVENT_LIST || PageName.UNDEFINED, ['uc']))}
    //         >
    //           ユニットコレクション
    //         </Button>
    //       </p>
    //     </div>
    //   ),
    // },
    // { label: 'Scout', linkto: PageName.SCOUT_LIST, message: <p>→まだ中途半端だけど原型は出来てる</p> },
    // { label: 'Unit', linkto: PageName.UNIT_LIST, message: <p>→まだできてない</p> },
    // {
    //   label: 'Character',
    //   linkto: PageName.CHARACTER_LIST,
    //   message: (
    //     <p>
    //       →まだ中途半端だけど原型は出来てる
    //       <br />
    //       キャラ別にどのイベントorスカウトで来たか (つまり逆にいつから来てないか) もまとめたりするつもり
    //     </p>
    //   ),
    // },
    // { label: 'Card', linkto: PageName.CARD_LIST, message: <p>→まだ中途半端だけど原型は出来てる</p> },
  ];
  return (
    <Row style={{ overflowY: 'auto' }}>
      {topButtons.map(({ label, linkto, message, popOver }, idx) => (
        <>
          <Col style={{ padding: 5 }} key={idx}>
            <Popover content={popOver} trigger="click" placement="right">
              <Button
                type="link"
                style={{ fontSize: 30, height: '100%' }}
                onClick={popOver ? undefined : () => props.history.push(toPublicUrl(linkto || PageName.UNDEFINED))}
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
