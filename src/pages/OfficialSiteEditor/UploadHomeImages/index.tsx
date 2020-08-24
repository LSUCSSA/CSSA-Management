import React from 'react';
import { Upload, Modal, Spin, Typography } from 'antd';
import token from '@/utils/token';
import { PlusOutlined } from '@ant-design/icons';
import fetch from 'node-fetch';
import styles from './index.less';

const { Title } = Typography;

function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
}

class PicturesWall extends React.Component {
  state = {
    previewVisible: false,
    previewImage: '',
    fileList: this.props.slideList,
    isLoading: false,
  };

  componentDidUpdate(prevProps) {
    if (this.props.slideList !== prevProps.slideList) {
      this.setState({fileList: this.props.slideList});
      // this.setState({
      //   fileList: this.props.slideList.map((s, i) => ({
      //     uid: -i,
      //     id: s.id,
      //     name: s.name,
      //     url: `/api/${s.url}`,
      //     status: s.status,
      //     formats: s.formats,
      //   })),
      // });
    }
  }

  handleCancel = () => this.setState({ previewVisible: false });

  handlePreview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }

    this.setState({
      previewImage: file.url || file.preview,
      previewVisible: true,
    });
  };

  handleChange = ({ file, fileList }) => {
    this.setState({ fileList });
  };

  render() {
    const {previewVisible, previewImage, fileList} = this.state;
    const {upload, slideList, isLoading, getImages, modelID} = this.props;
    console.log(this.props);
    // if (!isLoading && slideList.length !== 0) {
    //   this.setState({
    //     fileList: slideList.map((s, i) => ({
    //       uid: -i,
    //       id: s.id,
    //       name: s.name,
    //       url: `/api/${s.url}`,
    //       status: 'done',
    //       formats: s.formats,
    //     })),
    //   });
    // }
    const uploadButton = (
      <div>
        <PlusOutlined />
        <div className="ant-upload-text">上传</div>
        <div>(可多选)</div>
      </div>
    );

    return (
      <div className="clearfix">
        <Upload
          accept="image/*"
          multiple
          listType="picture-card"
          fileList={fileList}
          onRemove={async ({ id }) => {
            const sliderForm = new FormData();
            sliderForm.append(
              'data',
              JSON.stringify({
                slider: fileList.flatMap((o) => (o.id !== id ? [o.id] : [])),
              }),
            );
            await upload(sliderForm);
          }}
          customRequest={async ({ file, onError, onSuccess }) => {
            try {
              const fileForm = new FormData();
              fileForm.append(`files`, file, file.name);
              fileForm.append(`ref`, 'image-slide');
              fileForm.append(`field`, 'slider');
              fileForm.append(`refId`, modelID);

              const response = await fetch('/api/upload', {
                body: fileForm,
                method: 'POST',
                headers: {
                  Authorization: `Bearer ${token.get()}`,
                },
              });
              // console.log(fileList)
              // this.setState({fileList: [...fileList, file.originFileObj]});
              // const image = await res.json();
              // const sliderForm = new FormData();
              // sliderForm.append(
              //   'data',
              //   JSON.stringify({ slider: [...fileList.map((f) => f.id), image[0].id] }),
              // );
              // this.setState({fileList: [...fileList, file.originFileObj]})
              // await upload(sliderForm);
              onSuccess(response, file);
            } catch (e) {
              onError(e.stack);
            }
          }}
          onPreview={this.handlePreview}
          onChange={this.handleChange}
        >
          {slideList.length >= 8 ? null : uploadButton}
        </Upload>
        <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
          <img alt="example" style={{ width: '100%' }} src={previewImage} />
        </Modal>
      </div>
    );
  }
}

export default (props) => (
  <div className={styles.container}>
    <div id="components-upload-demo-picture-card">
      <Title level={3}>首页图集</Title>
      <Spin spinning={props.isLoading}>
        <PicturesWall
          {...props}
          // upload={upload}
          // slideList={slideList}
          // isLoading={isLoading}
          // getImages={getImages}
        />
      </Spin>
    </div>
  </div>
);
