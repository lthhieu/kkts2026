"use client"
import { Modal, Form, Input, message, notification, DatePicker, Row, Col, Select, DatePickerProps, } from 'antd';
import React, { useEffect, useMemo } from 'react';
import slugify from 'slugify';
import { handleCreateOrUpdateNews } from '@/app/(main)/quan-tri/tin-tuc/actions';
import dayjs from 'dayjs';
import { categoryArr } from '@/components/tin-tuc/table';

interface IProps {
    access_token?: string,
    isModalOpen: boolean,
    setIsModalOpen: (value: boolean) => void,
    status: string,
    setStatus: (value: string) => void,
    //update
    dataUpdate: null | INews,
    setDataUpdate: (value: null | INews) => void
}

const Context = React.createContext({ name: 'Default' });


const NewsModal = (props: IProps) => {
    const { setIsModalOpen, isModalOpen, setStatus, status, access_token, setDataUpdate, dataUpdate } = props
    const [form] = Form.useForm()
    const [messageApi, contextHolder] = message.useMessage();
    const [api, contextHolderNotification] = notification.useNotification();
    const contextValue = useMemo(() => ({ name: 'Ant Design' }), []);

    const title = Form.useWatch('title', form);

    useEffect(() => {

        if (!title) return;

        form.setFieldsValue({
            slug: slugify(title, { locale: 'vi', lower: true })
        });
    }, [title]);


    useEffect(() => {
        if (dataUpdate) {
            form.setFieldsValue({
                title: dataUpdate.title,
                _id: dataUpdate._id,
                slug: dataUpdate.slug,
                content: dataUpdate.content,
                thumbnail: dataUpdate.thumbnail,
                category: dataUpdate.category,
            })
        }
    }, [dataUpdate])

    const handleOk = () => {
        form.submit();
    };

    const handleCancel = () => {
        form.resetFields();
        setStatus("")
        setDataUpdate(null)
        setIsModalOpen(false);
    };

    const onFinish = async (values: INews) => {
        const { title, slug, content, category, thumbnail } = values
        const data = { title, slug, content, category, thumbnail }
        const response = await handleCreateOrUpdateNews(data, access_token ?? '', status, dataUpdate)

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
                title={status === "CREATE" ? "Thêm Tin tức" : "Cập nhật Tin tức"}
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
                <Form
                    form={form}
                    autoComplete="off"
                    layout='vertical'
                    name="news-modal"
                    onFinish={onFinish}
                    validateMessages={validateMessages}
                >
                    <Form.Item
                        style={{ marginBottom: 8 }}
                        label="Tiêu đề tin tức"
                        name="title"
                        rules={[{ required: true }]}
                    >
                        <Input.TextArea autoSize />
                    </Form.Item>

                    <Form.Item
                        style={{ marginBottom: 8 }}
                        label="Slug"
                        name="slug"
                        rules={[{ required: true }]}
                    >
                        <Input.TextArea autoSize />
                    </Form.Item>
                    <Form.Item
                        style={{ marginBottom: 8 }}
                        label="Nội dung"
                        name="content"
                        rules={[{ required: true }]}
                    >
                        <Input.TextArea autoSize />
                    </Form.Item>

                    <Form.Item
                        style={{ marginBottom: 8 }}
                        label="Ảnh bìa"
                        name="thumbnail"
                        rules={[{ required: true }]}
                    >
                        <Input.TextArea autoSize />
                    </Form.Item>

                    <Form.Item
                        label="Loại tin tức"
                        name="category"
                        rules={[{ required: true }]}
                    >
                        <Select
                            style={{ width: '100%' }}
                            showSearch={{ optionFilterProp: 'label' }}
                            placeholder="Vui lòng chọn loại tin tức"
                            options={categoryArr}
                        />
                    </Form.Item>
                </Form>
            </Modal>
        </Context.Provider>
    );
};

export default NewsModal;