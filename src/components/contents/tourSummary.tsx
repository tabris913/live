import { Button, Checkbox, List, Typography } from 'antd';
import React from 'react';
import { MainProps, TourUid } from '../../models/Main';

const TourSummary = (props: MainProps<TourUid>) => {
  const TimePlayed = () =>
    props.content && props.content.songList ? (
      <>
        <Typography.Title level={4}>曲ごとの演奏回数</Typography.Title>
        <Checkbox>CHECK</Checkbox>
        {/* チェックボックスでフォーカス曲を選択させる */}
        <List
          dataSource={props.content.songList.sort((a, b) => {
            if (a.misc!.times < b.misc!.times) return 1;
            if (a.misc!.times > b.misc!.times) return -1;
            return Number(a.uid.slice(-3)) < Number(b.uid.slice(-3)) ? -1 : 1;
          })}
          renderItem={item => (
            <List.Item>
              <Button type="link">
                {item.name} ({item.misc!.times})
              </Button>
            </List.Item>
          )}
          size="small"
          style={{ overflowY: 'auto' }}
          bordered={true}
        />
      </>
    ) : (
      <></>
    );

  return (
    <>
      <TimePlayed />
    </>
  );
};

export default TourSummary;
