import React, { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import AWS from 'aws-sdk';
import { Button, Col, Image, PageHeader, Row } from 'antd';
import { Modal } from 'antd';
import Swal from 'sweetalert2';
import Link from 'next/link';
import { FileUpload } from 'primereact/fileupload';
import { store } from '../_app';

const Folder = () => {
  const router = useRouter();
  const slug = (router.query.slug as string[]) || [];
  const [data, setData] = useState();
  /* @ts-ignore */
  const param = slug;
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isCreateFolder, setIsCreateFoldere] = useState(false);
  const [folderName, setFolderName] = useState('');
  const uploadForm = useRef<any>();
  const showModal = () => {
    setIsModalVisible(true);
  };
  const handleOk = () => {
    setIsModalVisible(false);
  };
  const handleCancel = () => {
    setIsModalVisible(false);
    setIsCreateFoldere(false);
  };
  const showCreateFolder = () => {
    setIsCreateFoldere(true);
  };
  const handelChangeInput = (e: any) => {
    setFolderName(
      e.target.value.charAt(0).toUpperCase() + e.target.value.slice(1)
    );
  };
  AWS.config.update({
    secretAccessKey: process.env.AWS_ACCESS_SECRET,
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    region: process.env.AWS_REGION,
  });
  const s3 = new AWS.S3();
  const url = param.toString().replaceAll(',', '/');
  useEffect(() => {
    if (folderName === undefined) {
      return;
    }
    s3.listObjects(
      {
        /* @ts-ignore */
        Bucket: process.env.AWS_BUCKET_NAME,
        Prefix: `${url}/`,
      },
      function (err, data: any) {
        if (err) console.log(err, err.stack);
        else {
          data?.Contents.shift();

          setData(data);
        }
      }
    );
  }, [folderName, isModalVisible, url, isCreateFolder]);

  const handleCreateFolder = async (e: any) => {
    e.preventDefault();
    if (folderName !== '') {
      await fetch('/api/folder', {
        method: 'POST',
        body: JSON.stringify({ folderName }),
        headers: { 'Content-Type': 'application/json' },
      });
      Swal.fire('Good job!', 'Create folder success !', 'success');
      setFolderName('');
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Something went wrong!',
      });
    }
  };
  /* @ts-ignore */
  const folderQuantity = data?.Contents.filter((item) => {
    if (item.Key.split(url)[1] === undefined) {
      return;
    } else
      return (
        item.Key.split(url)[1].split('/').length === 3 &&
        !item.Key.includes('.')
      );
  });
  /* @ts-ignore */
  const assetQuantity = data?.Contents.filter((item) => {
    return item.Key.includes('.');
  });
  const fileUploadHandler = async (e: any) => {
    const file = e.files;
    await file.map((item: any) => {
      uploadFile(item);
    });
    Swal.fire('Good job!', 'Upload success !', 'success');
    uploadForm?.current?.clear();
  };
  const uploadFile = async (File: any) => {
    let formData = new FormData();
    formData.append('fileUpload', File);
    await fetch(`/api/uploadFolder`, {
      method: 'POST',
      body: formData,
    }).catch((error) => {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Something went wrong!',
      });
    });
  };
  console.log(store.getState());
  return (
    <div className="site-page-header-ghost-wrapper container">
      <Link href='media/aaa'>
      <p style={{color: 'black'}}>asdasd</p>
      </Link> 
      <PageHeader
        className="site-page-header"
        title={url}
        onBack={() => window.history.back()}
        footer={`${folderQuantity ? folderQuantity.length : 0} folder - ${
          assetQuantity ? assetQuantity.length : 0
        } asset`}
        extra={[
          <Button
            key="1"
            type="primary"
            onClick={showModal}
          >
            Upload
          </Button>,
          <Button
            key="2"
            onClick={showCreateFolder}
          >
            Add folder
          </Button>,
        ]}
      />
      <div
        className="
          media-main
          "
      >
        <div className="container">
          <div
            className={`folder-wrapper ${
              folderQuantity?.length === 0 ? 'empty' : ''
            }`}
          >
            <PageHeader
              className="site-page-header"
              title="--Folder--"
            />
            <Row>
              {
                /* @ts-ignore */
                data?.Contents.map((item, index) => {
                  if (item.Key.split(url)[1] === undefined) {
                    return (
                      <p
                        style={{ color: 'red' }}
                        key={index}
                      ></p>
                    );
                  } else {
                    if (
                      item.Key.split(url)[1].split('/').length === 3 &&
                      !item.Key.includes('.')
                    )
                      return (
                        <Col
                          span={3}
                          key={index}
                          className="folder gutter-row"
                        >
                          <>
                            <div className="folder-image">
                              <Link
                                href={`${item.Key.replaceAll(' ', '-')}`}
                                prefetch={false}
                              >
                                <a>
                                  <Image
                                    src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAOEAAADhCAMAAAAJbSJIAAAAmVBMVEX////+zgD/vg7+4lD7673/2Rz/uwD+/e/94D/++eb+4kz+9s793m/+53H+4EL+0Aj802v+/vr965D/1BT+4lX+7qT+yAn+wQz+wh7+/fL+8K7+41393nD+xAr+zAb+wwv+99b+87/98rf++eD+53r965P96of97Zz92Vr/2z3+2TD90SH96ab91kz+43v82Wv82oj94YP72H4zixdGAAAD/klEQVR4nO3cbVubMBiG4RI3W7GDKUhXkbTTVZ3uxe3//7il1CqlhCYPaULYfX7Z4Wodl08MtHJsNAIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAOiHi+W5vqXro9ZwHU0ifZOTr64PXNXD5IQknNy6PnQ1dxEtUIjmrg9eyVWHQj/W6WVIL7x2ffBKNoUppTD0qDBNSYn5J6lvgvzBq7HtQqpQZv0tS6WPhlF650mhRJrnBxZFmF/4XCgC80Or3uI+bLwwT3OFH+tw5b4wpW2wYoIn+eHPCi/tFoaTDXG5uRWJbaTyYVUk+fv1I+I54nm7X6ry8ObP0HpheD8fG6H2ZeYPofVCe/9c6QqFRqHwGFBoVrfC8RnBeOVN4fIxDkiS734UntPySk8+FM6f1WLipkFzHwpveYcZ8hvTIVKbqzbKMx87BAZ8ajpEijzDsy6BXhT+4MSN1Enh/ehC289OMwxsFobPsdjvtG0PlTLJ2Gbh6qnbLCjW3yCLM7QfWCbaK/ylcVbrsrXUAi2u0mlZmHxUkCRJ4/UJITC2uJeWhYfKYiNllUCbZ4tp0DpBM1OrB/ak0HzcNjCwesZvLkySI8RVAm0W3uwXJseY3TbvdWE4LDxaXln4dsJxtkqVFmdM21rXfW/Ps3y2SPTGJwLlnyp7YPNtcVIYvBZq7C0tM5Q+Eu9O3n6hXh9hlYolmrgs1DliWmDtWZYLdfto2+3OsywXah0nuXBHbwsN9fW3cH2aMHNF0M/Ccn6GLnn6Wig/3Q2hMA7MvY3hsFB+SWL41WIPC9uuRX0qlIrbLkaHUWg2MAh+963QtOLzwAsLNvDCBRt44YyxUz8KaZsPF4GDLswY86eQomADL5yxYRdmjA27sGBOCrvc2aSFz5ibQrMZ8svXjLGhFDbfqScGOJgZNgUWrMbbwubAbFYP9LawMZAv9vq8LWwM3FugHhfGDdtMwwL1t7BhgrI+PwvV5+dlYby/QnlLn8OrNvL7afU3/Nvm53KG1Lss6i+GD/U5XKVtvz5rv8viHW8+P/SmsOV9/ZbC98eU+pwVEu+yqDzr8PJ0X0gLjDXGt+GisONdFsrjc1jY4VbgbKHX52KVdvjlUuOLh+EUav3wuSsk5vGMMD1HMyQkcs2txWXhzo2fanXEtemoUHcL7TY8F4XKKzQ2VGe58Eb1RM+zwlCd5cKpwm0knGuf0Q/qzWt8k3E7X6cPv5lZL0uTk/siuChcNY3N6I9cNfH9gxdrhctKWZl2jLb9QLa0Vjj6k4muYnG8sm0gqwSe/rUXOBq9sNPjE9vMrPKhvTVamp9/sMyP/9oVAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD+B/8AG/CO1ulu2aQAAAAASUVORK5CYII="
                                    alt="ad"
                                    preview={false}
                                  />
                                </a>
                              </Link>
                              <p> {item.Key.split(url)[1].split('/')[1]}</p>
                            </div>
                          </>
                        </Col>
                      );
                  }
                })
              }
            </Row>
          </div>
          <div className="asset-wrapper">
            <Image.PreviewGroup>
              <PageHeader
                className="site-page-header"
                title="--Asset--"
              />
              <Row gutter={16}>
                {
                  /* @ts-ignore */
                  data?.Contents.map((item, index) => {
                    if (item.Key.includes('.')) {
                      return (
                        <Col
                          span={4}
                          key={index}
                          className="asset gutter-row"
                        >
                          {item.Key.includes('.mp4') ||
                          item.Key.includes('webm') ? (
                            <div className="asset-image">
                              <video
                                src={`https://${process.env.BASE_URL_CDN}/${item.Key}`}
                                controls
                              ></video>
                            </div>
                          ) : (
                            <div className="asset-image">
                              <Image
                                src={`https://${process.env.BASE_URL_CDN}/${item.Key}`}
                                alt="ad"
                              />
                            </div>
                          )}
                          <p> {item.Key.split('/').pop()}</p>
                        </Col>
                      );
                    }
                  })
                }
              </Row>
            </Image.PreviewGroup>
          </div>
        </div>
      </div>
      <Modal
        title="Add new asset"
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <PageHeader
          ghost={false}
          subTitle="This is a subtitle"
          extra={[
            <Button
              key="1"
              type="primary"
              // onClick={handleUpload}
            >
              Primary
            </Button>,
          ]}
        ></PageHeader>
        <FileUpload
          ref={uploadForm}
          name="fileUpload"
          multiple
          accept="image/*"
          customUpload
          uploadHandler={fileUploadHandler}
          emptyTemplate={
            <p className="p-m-0">Drag and drop files to here to upload.</p>
          }
        ></FileUpload>
      </Modal>

      <Modal
        title="Add new folder"
        visible={isCreateFolder}
        onOk={handleCreateFolder}
        onCancel={handleCancel}
      >
        <input
          type="text"
          value={folderName}
          onChange={handelChangeInput}
          style={{
            background: 'white',
            color: 'black',
          }}
          className="folder-input"
          placeholder="Enter folder name"
        />
      </Modal>
    </div>
  );
};
export default Folder;
