/* eslint-disable @next/next/no-img-element */
import React, { useEffect, useRef, useState } from 'react';
import { Col, Row } from 'antd';
import { Button, Descriptions, PageHeader, Image } from 'antd';
import { Modal } from 'antd';
import { FileUpload } from 'primereact/fileupload';
import AWS from 'aws-sdk';
import Link from 'next/link';
import Swal from 'sweetalert2';
import { Checkbox } from 'antd';
import ReactLoading from 'react-loading';
import { useSelector, useDispatch } from 'react-redux';
import { setpath, back } from '../../actions/counter';

const App: React.FC = () => {
  AWS.config.update({
    secretAccessKey: process.env.AWS_ACCESS_SECRET,
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    region: process.env.AWS_REGION,
  });
  const s3 = new AWS.S3();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isCreateFolder, setIsCreateFoldere] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [folderName, setFolderName] = useState('');
  const [objectID, setObjectID] = useState<any>([]);
  const [showDeleteButton, setShowDeleteButton] = useState(true);
  const [data, setData] = useState();
  const [checkAll, setCheckAll] = useState(false);
  const [indeterminate, setIndeterminate] = useState(false);
  const uploadForm = useRef<any>();
  /* @ts-ignore */
  const pathname = useSelector((state) => state.pathname);
  const dispatch = useDispatch();
  const prefixListObject = pathname.replace('/', '').trim() + '/';
  const showModal = () => {
    setIsModalVisible(true);
  };
  const showCreateFolder = () => {
    setIsCreateFoldere(true);
  };
  const handleOk = () => {
    setIsModalVisible(false);
  };
  const handleCancel = () => {
    setIsModalVisible(false);
    setIsCreateFoldere(false);
  };
  const handelChangeInput = (e: any) => {
    setFolderName(e.target.value);
  };
  const handleCreateFolder = async (e: any) => {
    e.preventDefault();
    if (folderName !== '') {
      s3.putObject(
        {
          Key: `${
            prefixListObject === '/' ? '' : prefixListObject
          }${folderName}/`,
          Bucket: process.env.AWS_BUCKET_NAME,
        },
        function (err, data) {
          if (err) console.log(err, err.stack);
          else console.log(data);
        }
      );
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

  const fileUploadHandler = async (e: any) => {
    const file = e.files;
    await uploadFile(file);
    Swal.fire('Good job!', 'Upload success !', 'success');
    uploadForm?.current?.clear();
  };

  const uploadFile = async (File: any) => {
    console.log(File);
    File.map((item: any) => {
      s3.putObject(
        {
          Key: item.name,
          Bucket: `${process.env.AWS_BUCKET_NAME}${pathname.trim()}`,
          Body: item,
          ACL: 'public-read',
        },
        function (err, data) {
          if (err) console.log(err, err.stack);
          else console.log(data);
        }
      );
    });
  };

  const handleDelete = async () => {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
    }).then(async (result) => {
      if (result.isConfirmed) {
        setIsLoading(true);
        // await fetch('/api/folder', {
        //   method: 'DELETE',
        //   body: JSON.stringify({ objectID }),
        //   headers: { 'Content-Type': 'application/json' },
        // });
        await objectID.map((item: string | undefined) => {
          var params = {
            Bucket: process.env.AWS_BUCKET_NAME,
            Prefix: `${item}`,
          };
          s3.listObjects(params, function (err, data) {
            /* @ts-ignore */
            params = {
              Bucket: process.env.AWS_BUCKET_NAME,
            };
            /* @ts-ignore */
            params.Delete = { Objects: [] };
            if (data !== undefined && data.Contents !== undefined) {
              data.Contents.forEach(function (content) {
                /* @ts-ignore */
                params.Delete.Objects.push({ Key: content.Key });
              });
            }
            /* @ts-ignore */
            s3.deleteObjects(params, function (err, data) {
              if (err) console.log(err, err.stack);
              else console.log(data);
            });
          });
        });
        Swal.fire({
          title: 'Deleted!',
          text: 'Your file has been deleted.',
          icon: 'success',
          didClose: () => {
            s3.listObjects(
              {
                /* @ts-ignore */
                Bucket: process.env.AWS_BUCKET_NAME,
                Delimiter: '/',
              },
              function (err, data: any) {
                if (err) console.log(err, err.stack);
                else reloadData(data);
              }
            );
          },
        });
        setIsLoading(false);
        setCheckAll(false);
        setObjectID([]);
      }
    });
  };
  const reloadData = (data: any) => {
    setData(data);
  };
  const onChange = (e: any) => {
    if (e.target.checked === true) {
      objectID.push(e.target.valuePropName);
      setShowDeleteButton(false);
    } else {
      objectID.pop(e.target.valuePropName);
      if (objectID.length === 0) {
        setShowDeleteButton(true);
      }
    }
  };
  const onCheckAllChange = () => {
    if (checkAll) {
      /* @ts-ignore */
      data?.CommonPrefixes.map((data) => {
        objectID.pop(data.Prefix);
      });
      setShowDeleteButton(true);
    } else {
      /* @ts-ignore */
      data?.CommonPrefixes.map((data) => {
        objectID.push(data.Prefix);
        setShowDeleteButton(false);
      });
    }
    setCheckAll(!checkAll);
  };
  useEffect(() => {
    s3.listObjects(
      {
        /* @ts-ignore */
        Bucket: process.env.AWS_BUCKET_NAME,
        Prefix: `${
          pathname.trim() === '' ? pathname.trim() : prefixListObject
        }`,
        Delimiter: '/',
      },
      function (err, data: any) {
        if (err) console.log(err, err.stack);
        else reloadData(data);
      }
    );
    setCheckAll(false);
    setObjectID([]);
  }, [isCreateFolder, isModalVisible, pathname]);
  return (
    <>
      {isLoading ? (
        <div className="loading">
          <ReactLoading
            type={'spin'}
            color={'red'}
            height={'10%'}
            width={'10%'}
          />
        </div>
      ) : (
        <div className="site-page-header-ghost-wrapper container">
          <PageHeader
            ghost={false}
            onBack={
              pathname.trim() === ''
                ? () => {
                    window.history.back();
                  }
                : () =>
                    dispatch(
                      back(
                        pathname.replace(`/${pathname.split('/').pop()}`, '')
                      )
                    )
            }
            title={
              pathname.trim() !== ''
                ? `Folder: ${pathname.replace('/', '')}`
                : 'Media Library'
            }
            /* @ts-ignore */
            footer={`${data?.Contents.length} asset - ${
              /* @ts-ignore */
              data?.CommonPrefixes.length
            } folder`}
            extra={[
              <Button
                key="2"
                onClick={showCreateFolder}
              >
                Add folder
              </Button>,
              <Button
                key="1"
                type="primary"
                onClick={showModal}
              >
                Upload
              </Button>,
            ]}
          ></PageHeader>
          <div className="media-main">
            <div className="container">
              <div
                className="
    folder-wrapper
      "
              >
                <PageHeader
                  className="site-page-header"
                  title="Folder"
                />
                <Row gutter={16}>
                  <Button
                    onClick={handleDelete}
                    hidden={showDeleteButton}
                    className="buttonDelete"
                  >
                    Delete
                  </Button>
                  {
                    /* @ts-ignore */
                    data?.CommonPrefixes.map((item, index) => {
                      return (
                        <Col
                          span={3}
                          key={index}
                          className="folder gutter-row"
                        >
                          <>
                            <div
                              className="folder-image"
                              onClick={() =>
                                dispatch(
                                  setpath(
                                    `${item.Prefix.split('/')[
                                      item.Prefix.split('/').length - 2
                                    ].trim()}`
                                  )
                                )
                              }
                            >
                              <a>
                                <Image
                                  src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAOEAAADhCAMAAAAJbSJIAAAAmVBMVEX////+zgD/vg7+4lD7673/2Rz/uwD+/e/94D/++eb+4kz+9s793m/+53H+4EL+0Aj802v+/vr965D/1BT+4lX+7qT+yAn+wQz+wh7+/fL+8K7+41393nD+xAr+zAb+wwv+99b+87/98rf++eD+53r965P96of97Zz92Vr/2z3+2TD90SH96ab91kz+43v82Wv82oj94YP72H4zixdGAAAD/klEQVR4nO3cbVubMBiG4RI3W7GDKUhXkbTTVZ3uxe3//7il1CqlhCYPaULYfX7Z4Wodl08MtHJsNAIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAOiHi+W5vqXro9ZwHU0ifZOTr64PXNXD5IQknNy6PnQ1dxEtUIjmrg9eyVWHQj/W6WVIL7x2ffBKNoUppTD0qDBNSYn5J6lvgvzBq7HtQqpQZv0tS6WPhlF650mhRJrnBxZFmF/4XCgC80Or3uI+bLwwT3OFH+tw5b4wpW2wYoIn+eHPCi/tFoaTDXG5uRWJbaTyYVUk+fv1I+I54nm7X6ry8ObP0HpheD8fG6H2ZeYPofVCe/9c6QqFRqHwGFBoVrfC8RnBeOVN4fIxDkiS734UntPySk8+FM6f1WLipkFzHwpveYcZ8hvTIVKbqzbKMx87BAZ8ajpEijzDsy6BXhT+4MSN1Enh/ehC289OMwxsFobPsdjvtG0PlTLJ2Gbh6qnbLCjW3yCLM7QfWCbaK/ylcVbrsrXUAi2u0mlZmHxUkCRJ4/UJITC2uJeWhYfKYiNllUCbZ4tp0DpBM1OrB/ak0HzcNjCwesZvLkySI8RVAm0W3uwXJseY3TbvdWE4LDxaXln4dsJxtkqVFmdM21rXfW/Ps3y2SPTGJwLlnyp7YPNtcVIYvBZq7C0tM5Q+Eu9O3n6hXh9hlYolmrgs1DliWmDtWZYLdfto2+3OsywXah0nuXBHbwsN9fW3cH2aMHNF0M/Ccn6GLnn6Wig/3Q2hMA7MvY3hsFB+SWL41WIPC9uuRX0qlIrbLkaHUWg2MAh+963QtOLzwAsLNvDCBRt44YyxUz8KaZsPF4GDLswY86eQomADL5yxYRdmjA27sGBOCrvc2aSFz5ibQrMZ8svXjLGhFDbfqScGOJgZNgUWrMbbwubAbFYP9LawMZAv9vq8LWwM3FugHhfGDdtMwwL1t7BhgrI+PwvV5+dlYby/QnlLn8OrNvL7afU3/Nvm53KG1Lss6i+GD/U5XKVtvz5rv8viHW8+P/SmsOV9/ZbC98eU+pwVEu+yqDzr8PJ0X0gLjDXGt+GisONdFsrjc1jY4VbgbKHX52KVdvjlUuOLh+EUav3wuSsk5vGMMD1HMyQkcs2txWXhzo2fanXEtemoUHcL7TY8F4XKKzQ2VGe58Eb1RM+zwlCd5cKpwm0knGuf0Q/qzWt8k3E7X6cPv5lZL0uTk/siuChcNY3N6I9cNfH9gxdrhctKWZl2jLb9QLa0Vjj6k4muYnG8sm0gqwSe/rUXOBq9sNPjE9vMrPKhvTVamp9/sMyP/9oVAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD+B/8AG/CO1ulu2aQAAAAASUVORK5CYII="
                                  alt="ad"
                                  preview={false}
                                />
                              </a>
                              <p>
                                {' '}
                                {
                                  item.Prefix.split('/')[
                                    item.Prefix.split('/').length - 2
                                  ]
                                }
                              </p>
                            </div>
                            <Checkbox
                              onChange={onChange}
                              /* @ts-ignore */
                              valuePropName={item.Prefix}
                              // checked={checkAll}
                              // indeterminate={indeterminate}
                            ></Checkbox>
                          </>
                        </Col>
                      );
                    })
                  }
                  <Checkbox
                    onChange={onCheckAllChange}
                    // checked={checkAll}
                  >
                    Check all
                  </Checkbox>
                </Row>
              </div>
              <div
                className="
      asset-wrapper
      "
              >
                <PageHeader
                  className="site-page-header"
                  title="Asset"
                />
                <Image.PreviewGroup>
                  <Row gutter={8}>
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
                                  <Checkbox
                                    onChange={onChange}
                                    /* @ts-ignore */
                                    valuePropName={item.Key}
                                  ></Checkbox>
                                </div>
                              ) : (
                                <div className="asset-image">
                                  <Image
                                    src={`https://${process.env.BASE_URL_CDN}/${item.Key}`}
                                    alt="ad"
                                  />
                                  <Checkbox
                                    onChange={onChange}
                                    /* @ts-ignore */
                                    valuePropName={item.Key}
                                  ></Checkbox>
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
            <FileUpload
              ref={uploadForm}
              name="fileUpload"
              multiple
              accept="image/*"
              customUpload
              uploadHandler={fileUploadHandler}
              emptyTemplate={
                <p
                  className="p-m-0"
                  style={{
                    textAlign: 'center',
                    margin: 0,
                    fontSize: 12,
                    paddingTop: 50,
                    paddingBottom: 50,
                  }}
                >
                  Drag and drop files to here to upload...
                </p>
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
      )}
    </>
  );
};

export default App;
