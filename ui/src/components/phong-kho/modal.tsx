"use client"
import { handleCreateOrUpdateRoom } from '@/app/(main)/quan-tri/phong-kho/actions';
import { Modal, Form, Input, message, notification, Typography, InputNumber, Col, Row, Select } from 'antd';
import React, { useEffect, useMemo } from 'react';

interface IProps {
    access_token?: string,
    isModalOpen: boolean,
    setIsModalOpen: (value: boolean) => void,
    status: string,
    setStatus: (value: string) => void,
    //update
    dataUpdate: null | IRoom,
    setDataUpdate: (value: null | IRoom) => void,
    units: null | IUnit[]
}

const Context = React.createContext({ name: 'Default' });

const RoomModal = (props: IProps) => {
    const { setIsModalOpen, isModalOpen, setStatus, status, access_token, setDataUpdate, dataUpdate, units } = props
    const [form] = Form.useForm()
    const [messageApi, contextHolder] = message.useMessage();
    const [api, contextHolderNotification] = notification.useNotification();
    const contextValue = useMemo(() => ({ name: 'Ant Design' }), []);

    useEffect(() => {
        if (dataUpdate) {
            form.setFieldsValue({
                name: dataUpdate.name,
                _id: dataUpdate._id,
                info: dataUpdate.info.map(i => ({
                    ...i,
                    unit: i.unit?._id  // 🔥 ÉP VỀ ID
                }))
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

    const onFinish = async (values: IRoom) => {
        const { name, info } = values
        const data = { name, info }
        const response = await handleCreateOrUpdateRoom(data, access_token ?? '', status, dataUpdate)

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
    const onChange = (value: string) => {
        console.log(`selected ${value}`);
    };

    const validateMessages = {
        required: '${label} không được để trống',
    }

    return (
        <Context.Provider value={contextValue}>
            {contextHolder}{contextHolderNotification}
            <Modal
                title={status === "CREATE" ? "Thêm Phòng - Kho" : "Cập nhật Phòng - Kho"}
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
                <Form<IRoom>
                    form={form}
                    autoComplete="off"
                    layout='vertical'
                    name="room-modal"
                    onFinish={onFinish}
                    validateMessages={validateMessages}
                    initialValues={{
                        info: [{}]   // 🔥 mặc định 1 phần tử
                    }}
                >
                    <Form.Item
                        style={{ marginBottom: 8 }}
                        label="Tên Phòng - Kho"
                        name="name"
                        rules={[{ required: true }]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.List name="info">
                        {(fields, { add, remove }) => (
                            <>
                                {fields.map(({ key, name, ...restField }, index) => (
                                    <div
                                        key={key}
                                        style={{
                                            border: '1px solid #f0f0f0',
                                            padding: 12,
                                            marginBottom: 6,
                                            borderRadius: 6
                                        }}
                                    >
                                        <Typography.Text strong>
                                            Thông tin {index + 1}
                                        </Typography.Text>

                                        <Form.Item
                                            {...restField}
                                            label="Mô tả"
                                            name={[name, 'description']}
                                            rules={[{ required: true }]}
                                            style={{ marginBottom: 6 }}
                                        >
                                            <Input />
                                        </Form.Item>

                                        <Row gutter={12}>
                                            <Col span={8}>
                                                <Form.Item
                                                    {...restField}
                                                    label="Năm"
                                                    name={[name, 'year']}
                                                    rules={[{ required: true }]}
                                                >
                                                    <InputNumber type="number" />
                                                </Form.Item>
                                            </Col>

                                            <Col span={16}>
                                                <Form.Item
                                                    {...restField}
                                                    label="Đơn vị"
                                                    name={[name, 'unit']}
                                                    style={{ marginBottom: 6 }}
                                                    rules={[{ required: true }]}
                                                >
                                                    <Select
                                                        style={{ width: '100%' }}
                                                        showSearch={{ optionFilterProp: 'label' }}
                                                        placeholder="Vui lòng chọn đơn vị"
                                                        onChange={onChange}
                                                        options={
                                                            units && units.length > 0
                                                                ? units.map(({ _id, name }) => ({
                                                                    value: _id,
                                                                    label: name
                                                                }))
                                                                : []
                                                        }
                                                    />
                                                </Form.Item>
                                            </Col>
                                        </Row>

                                        <Typography.Link
                                            onClick={() => remove(name)}
                                            style={{ color: 'red' }}
                                        >
                                            Xóa thông tin này
                                        </Typography.Link>
                                    </div>
                                ))}

                                <Form.Item>
                                    <Typography.Link onClick={() => add()}>
                                        + Thêm thông tin
                                    </Typography.Link>
                                </Form.Item>
                            </>
                        )}
                    </Form.List>

                </Form>
            </Modal>
        </Context.Provider>
    );
};

export default RoomModal;