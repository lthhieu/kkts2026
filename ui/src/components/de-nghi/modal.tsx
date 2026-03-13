"use client"
import { Modal, Form, Input, message, notification, Select, Upload, UploadProps, UploadFile } from 'antd';
import React, { useEffect, useMemo, useState } from 'react';
import { InboxOutlined } from '@ant-design/icons';
import { handleUploadImage } from '@/app/(main)/quan-tri/actions';
import { handleCreateRequest } from '@/app/(main)/quan-tri/de-nghi/actions';
import { typeArr } from '@/components/de-nghi/table';

const { Dragger } = Upload;

interface IProps {
    access_token?: string,
    isModalOpen: boolean,
    setIsModalOpen: (value: boolean) => void,
}

const Context = React.createContext({ name: 'Default' });


const RequestModal = (props: IProps) => {
    const { setIsModalOpen, isModalOpen, access_token } = props
    const [form] = Form.useForm()
    const [messageApi, contextHolder] = message.useMessage();
    const [api, contextHolderNotification] = notification.useNotification();
    const [imageProp, setImageProp] = useState<UploadFile | null>(null)
    const contextValue = useMemo(() => ({ name: 'Ant Design' }), []);

    const uploadProps: UploadProps = {
        name: 'file',
        multiple: false,
        maxCount: 1,
        beforeUpload: (file) => {
            const typeCheck = ['image/jpeg', 'image/png']
            const isValidate = typeCheck.some((element) => element === file.type);
            if (!isValidate) {
                message.error(`${file.name} không phải ảnh jpeg hoặc png`);
            }
            return isValidate || Upload.LIST_IGNORE;
        },

        //prevent call action
        customRequest: ({ onSuccess }) => {
            if (onSuccess) {
                onSuccess("ok");
            }
        },
        async onChange(info) {
            const { status } = info.file;
            if (status !== 'uploading') {
                // console.log(info.file, info.fileList);
            }
            if (status === 'done') {
                setImageProp(info.file)
                message.success(`${info.file.name} tải lên thành công`);
            } else if (status === 'error') {
                message.error(`${info.file.name} tải lên thất bại`);
            }
        },
        onDrop(e) {
            // console.log('Dropped files', e.dataTransfer.files);
        },
    };

    const handleOk = () => {
        form.submit();
    };

    const handleCancel = () => {
        form.resetFields();
        setImageProp(null)
        setIsModalOpen(false);
    };

    const onFinish = async (values: IRequestModule) => {

        if (imageProp) {
            const response = await handleUploadImage(imageProp.originFileObj, access_token ?? "")
            if (response.data) {
                values.image = response.data.link
            }
        }
        const response = await handleCreateRequest(values, access_token ?? '')

        if (response.data) {
            messageApi.success(response.message);
            handleCancel()
        } else {
            api.error({
                title: `Có lỗi xảy ra`,
                description: response.message,
                placement: 'topRight',
            });
        }
    }

    const validateMessages = {
        required: '${label} không được để trống',
    }

    return (
        <Context.Provider value={contextValue}>
            {contextHolder}{contextHolderNotification}
            <Modal
                title={"Tạo mới đề nghị"}
                closable={{ 'aria-label': 'Custom Close Button' }}
                open={isModalOpen}
                onOk={handleOk}
                onCancel={handleCancel}
                okText={"Đồng ý"}
                cancelText={"Hủy"}
                width={{
                    xs: '90%',
                    sm: '80%',
                    md: '70%',
                    lg: '60%',
                    xl: '50%',
                    xxl: '40%',
                }}
            >
                <Form<IRequestModule>
                    form={form}
                    autoComplete="off"
                    layout='vertical'
                    name="request-modal"
                    onFinish={onFinish}
                    validateMessages={validateMessages}
                >

                    <Form.Item
                        style={{ marginBottom: 8 }}
                        label="Mã thiết bị"
                        name="device"
                        rules={[{ required: true }]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        style={{ marginBottom: 8 }}
                        label="Tên Đề nghị"
                        name="name"
                        rules={[{ required: true }]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="Loại đề nghị"
                        name='type'
                        style={{ marginBottom: 6 }}
                        rules={[{ required: true }]}
                    >
                        <Select
                            style={{ width: '100%' }}
                            showSearch={{ optionFilterProp: 'label' }}
                            placeholder="Vui lòng chọn loại đề nghị"
                            options={typeArr}
                        />
                    </Form.Item>

                    <Form.Item
                        style={{ marginBottom: 8 }}
                        label="Tình trạng"
                        name="description"
                        rules={[{ required: true }]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        style={{ marginBottom: 8 }}
                        label="Hình ảnh minh họa"
                    >
                        <Dragger {...uploadProps}>
                            <p className="ant-upload-drag-icon">
                                <InboxOutlined />
                            </p>
                            <p className="ant-upload-text">Chọn hoặc kéo thả ảnh</p>
                            <p className="ant-upload-hint">
                                Chỉ hỗ trợ file jpeg và png
                            </p>
                        </Dragger>
                    </Form.Item>

                </Form>
            </Modal>
        </Context.Provider>
    );
};

export default RequestModal;