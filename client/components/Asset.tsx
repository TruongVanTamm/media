import { Col, Image, PageHeader, Row } from 'antd';
import React from 'react';

const Asset = () => {
  return (
    <>
      <PageHeader
        className="site-page-header"
        title="Asset"
      />
      <Row gutter={16}>
        {
          /* @ts-ignore */
          data?.Contents.map((item, index) => {
            return (
              <Col
                span={4}
                key={index}
                className="asset gutter-row"
              >
                <div className="asset-image">
                  <Image.PreviewGroup>
                    <Image
                      src={`https://${process.env.BASE_URL_CDN}/${item.Key}`}
                      alt="ad"
                      width="100px"
                      height="100px"
                    />
                  </Image.PreviewGroup>
                </div>
                <p> {item.Key}</p>
              </Col>
            );
          })
        }
      </Row>
    </>
  );
};

export default Asset;
