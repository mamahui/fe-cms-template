import React, { useState, useEffect, useCallback } from 'react';
import { PlusOutlined } from '@ant-design/icons';
import { Upload, Modal, message } from 'antd';
import { isEmpty } from '@suze/utils';

export const getBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
};

export default function UploadImg(props) {
  const { value, maxCount = 1, onChange, ...rest } = props;
  const [fileList, setFileList] = useState<any>([]);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewTitle, setPreviewTitle] = useState('');
  const [previewImage, setPreviewImage] = useState('');
  const handlePreview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setPreviewVisible(true);
    setPreviewImage(file.url || file.preview);
    setPreviewTitle(
      file.name || file.url.substring(file.url.lastIndexOf('/') + 1),
    );
  };
  useEffect(() => {
    if (!isEmpty(value)) {
      setFileList(value);
    }
  }, []);
  const handleChange = ({ fileList, file }) => {
    const { status } = file;

    if (!status || status === 'error') {
      fileList = fileList.filter(({ uid }) => uid !== file.uid);
    }

    fileList = fileList.slice(-maxCount).map((file) => {
      if (file.response) {
        const { data } = file.response;

        file.url = data;
        file.status = 'done';
      }

      return file;
    });

    onChange(fileList);
    setFileList(fileList);
  };
  const uploadProps = {
    action: `${process.env.API}/uploads`,
    accept: 'image/*',
    name: 'files[]',
    listType: 'picture-card',
    maxCount,
    beforeUpload(file) {
      const isLt2M = file.size / 1024 / 1024 < 1;
      if (!isLt2M) {
        message.error('图片大小必须小于1M，请重新选择图片进行上传');
      }
      return isLt2M;
    },
    fileList,
    onPreview: handlePreview,
    onChange: handleChange,
    ...rest,
  };
  const uploadButton = (
    <div>
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>上传图片</div>
    </div>
  );
  return (
    <div>
      <Upload {...uploadProps}>{fileList.length ? null : uploadButton}</Upload>
      <Modal
        visible={previewVisible}
        title={previewTitle}
        footer={null}
        onCancel={() => setPreviewVisible(false)}
      >
        <img alt="example" style={{ width: '100%' }} src={previewImage} />
      </Modal>
    </div>
  );
}
