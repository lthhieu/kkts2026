"use client"
import { Modal, Form, message, notification, Select } from 'antd';
import React, { useEffect, useMemo } from 'react';
import { STATUS_LABEL_MAP } from '@/components/de-nghi/table';
import { handleUpdateStatus } from '@/app/(main)/quan-tri/de-nghi/actions';

interface IProps {
    access_token?: string,
    isModalOpen: boolean,
    setIsModalOpen: (value: boolean) => void,
    //update
    dataUpdate: null | IRequestModule,
    setDataUpdate: (value: null | IRequestModule) => void,
    onRefresh?: () => void
}

const Context = React.createContext({ name: 'Default' });

const StatusRequestModal = (props: IProps) => {
    const { setIsModalOpen, isModalOpen, access_token, setDataUpdate, dataUpdate, onRefresh } = props
    const [form] = Form.useForm()
    const [messageApi, contextHolder] = message.useMessage();
    const [api, contextHolderNotification] = notification.useNotification();
    const contextValue = useMemo(() => ({ name: 'Ant Design' }), []);

    useEffect(() => {
        if (dataUpdate) {
            form.setFieldsValue({
                status: dataUpdate.status,
                _id: dataUpdate._id,
            })
        }
    }, [dataUpdate])

    const handleOk = () => {
        form.submit();
    };

    const handleCancel = () => {
        form.resetFields();
        setDataUpdate(null)
        setIsModalOpen(false);
    };

    const onFinish = async (values: IRequestModule) => {
        const response = await handleUpdateStatus(dataUpdate?._id ?? '', access_token ?? '', values.status)

        if (response.data) {
            messageApi.success(response.message);
            handleCancel()
            if (onRefresh) {
                onRefresh();
            }
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
                title={"Cập nhật trạng thái"}
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
                    name="status-request-modal"
                    onFinish={onFinish}
                    validateMessages={validateMessages}
                >
                    <Form.Item
                        style={{ marginBottom: 8 }}
                        label="Trạng thái"
                        name="status"
                        rules={[{ required: true }]}
                    >
                        <Select
                            style={{ width: '100%' }}
                            showSearch={{ optionFilterProp: 'label' }}
                            placeholder="Vui lòng chọn trạng thái"
                            allowClear
                            options={
                                Object.entries(STATUS_LABEL_MAP).map(([value, label]) => ({
                                    value,
                                    label
                                }))
                            }
                        />
                    </Form.Item>

                </Form>
            </Modal>
        </Context.Provider>
    );
};

export default StatusRequestModal;