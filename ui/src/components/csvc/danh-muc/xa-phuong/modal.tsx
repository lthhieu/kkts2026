'use client'
import { Modal, Form, Input, message, notification } from 'antd';
import React, { useEffect, useMemo } from 'react';
import { handleCreateOrUpdateXaphuong } from '@/app/(main)/quan-tri/csvc/danh-muc/xa-phuong/actions';

interface IProps {
    access_token?: string;
    isModalOpen: boolean;
    setIsModalOpen: (value: boolean) => void;
    status: string;
    setStatus: (value: string) => void;
    dataUpdate: null | IXaphuong;
    setDataUpdate: (value: null | IXaphuong) => void;
}

const Context = React.createContext({ name: 'Default' });

const XaphuongModal = (props: IProps) => {
    const { setIsModalOpen, isModalOpen, setStatus, status, access_token, setDataUpdate, dataUpdate } = props;
    const [form] = Form.useForm();
    const [messageApi, contextHolder] = message.useMessage();
    const [api, contextHolderNotification] = notification.useNotification();
    const contextValue = useMemo(() => ({ name: 'Ant Design' }), []);

    useEffect(() => {
        if (dataUpdate) form.setFieldsValue({ name: dataUpdate.name });
    }, [dataUpdate]);

    const handleOk = () => form.submit();
    const handleCancel = () => { form.resetFields(); setStatus(''); setDataUpdate(null); setIsModalOpen(false); };

    const onFinish = async (values: { name: string }) => {
        const response = await handleCreateOrUpdateXaphuong(values, access_token ?? '', status, dataUpdate);
        if (response.data) { messageApi.success(response.message); handleCancel(); }
        else api.error({ title: 'Có lỗi xảy ra', description: response.message, placement: 'topRight' });
    };

    return (
        <Context.Provider value={contextValue}>
            {contextHolder}{contextHolderNotification}
            <Modal title={status === 'CREATE' ? 'Thêm xã phường' : 'Cập nhật xã phường'}
                open={isModalOpen} onOk={handleOk} onCancel={handleCancel} okText="Đồng ý" cancelText="Hủy"
                width={{ xs: '90%', sm: '80%', md: '60%', lg: '50%', xl: '40%', xxl: '30%' }}>
                <Form form={form} layout="vertical" onFinish={onFinish}
                    validateMessages={{ required: '${label} không được để trống' }}>
                    <Form.Item label="Tên" name="name" rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>
                </Form>
            </Modal>
        </Context.Provider>
    );
};

export default XaphuongModal;
