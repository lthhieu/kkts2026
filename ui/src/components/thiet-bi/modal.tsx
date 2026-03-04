"use client"
import { Modal, Form, Input, message, Select, Row, Col, InputNumber, Typography, notification } from 'antd';
import React, { useEffect, useMemo } from 'react';
import { handleCreateOrUpdateDevice } from '@/app/(main)/quan-tri/thiet-bi/actions';
import { statusArr, typeArr } from '@/components/thiet-bi/table';

interface IProps {
    access_token?: string,
    email: string,
    isModalOpen: boolean,
    setIsModalOpen: (value: boolean) => void,
    status: string,
    setStatus: (value: string) => void,
    //update
    dataUpdate: null | IDevice,
    setDataUpdate: (value: null | IDevice) => void,
    rooms: IRoom[],
    units: IUnit[]
}

const Context = React.createContext({ name: 'Default' });

const DeviceModal = (props: IProps) => {
    const { setIsModalOpen, isModalOpen, setStatus, status, access_token, setDataUpdate, dataUpdate, rooms, units, email } = props
    const [form] = Form.useForm()
    const [messageApi, contextHolder] = message.useMessage();
    const [api, contextHolderNotification] = notification.useNotification();
    const contextValue = useMemo(() => ({ name: 'Ant Design' }), []);

    useEffect(() => {
        if (dataUpdate) {
            form.setFieldsValue({
                "parent": dataUpdate?.parent || null,
                "name": dataUpdate.name,
                "_id": dataUpdate._id,
                "description": dataUpdate.description,
                "usedLocation": dataUpdate.usedLocation.map(i => ({
                    ...i,
                    room: i.room?._id,  // 🔥 ÉP VỀ ID
                    reason: i.reason,
                    person: i.person
                })),
                "usedYear": dataUpdate.usedYear,
                "soKeToan": {
                    "soLuong": dataUpdate.soKeToan.soLuong,
                    "nguyenGia": dataUpdate.soKeToan.nguyenGia,
                    "giaTriConLai": dataUpdate.soKeToan.giaTriConLai
                },
                "kiemKe": {
                    "soLuong": dataUpdate.kiemKe.soLuong,
                    "nguyenGia": dataUpdate.kiemKe.nguyenGia,
                    "giaTriConLai": dataUpdate.kiemKe.giaTriConLai
                },
                "chenhLech": {
                    "thua": dataUpdate.chenhLech.thua,
                    "thieu": dataUpdate.chenhLech.thieu,
                    "giaTriConLai": dataUpdate.chenhLech.giaTriConLai
                },
                "chatLuongConLai": 100,
                "note": dataUpdate.note,
                "trongSoChatLuong": dataUpdate.trongSoChatLuong,
                "type": dataUpdate.type,
                "unit": dataUpdate.unit._id,
                "status": dataUpdate.status
            })
        }
    }, [dataUpdate])
    const usedYear = Form.useWatch('usedYear', form);
    const trongSoChatLuong = Form.useWatch('trongSoChatLuong', form);

    useEffect(() => {

        if (!usedYear || !trongSoChatLuong) return;

        const currentYear = new Date().getFullYear();

        let chatLuong = 100;

        if (usedYear < currentYear) {
            chatLuong = 100 - (currentYear - usedYear) * trongSoChatLuong;
        }

        form.setFieldsValue({
            chatLuongConLai: chatLuong > 0 ? chatLuong : 0
        });
    }, [usedYear, trongSoChatLuong]);


    const handleOk = () => {
        form.submit();
    };

    const handleCancel = () => {
        form.resetFields();
        setStatus("")
        setDataUpdate(null)
        setIsModalOpen(false);
    };

    const onFinish = async (values: IDevice) => {
        // console.log('Received values of form: ', values);
        const { name, description, usedLocation, usedYear, soKeToan, kiemKe, chenhLech, chatLuongConLai, note, trongSoChatLuong, type, unit, parent, status: statusDevice } = values
        const data = { name, description, usedLocation, usedYear, soKeToan, kiemKe, chenhLech, chatLuongConLai, note, trongSoChatLuong, type, unit, parent, statusDevice }

        const response = await handleCreateOrUpdateDevice(data, access_token ?? '', status, dataUpdate)

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

    const onChange = (value: string) => {
        console.log(`selected ${value}`);
    };

    return (
        <Context.Provider value={contextValue}>
            {contextHolder}{contextHolderNotification}
            <Modal
                title={status === "CREATE" ? "Thêm Thiết bị" : "Cập nhật Thiết bị"}
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
                    name="device-modal"
                    onFinish={onFinish}
                    validateMessages={validateMessages}
                    initialValues={
                        {
                            "usedYear": new Date().getFullYear(),
                            "chenhLech": {
                                "thua": 0,
                                "thieu": 0,
                                "giaTriConLai": null
                            },
                            usedLocation: [{}]
                        }
                    }
                >
                    {status === 'UPDATE' && <Form.Item
                        style={{ marginBottom: 8 }}
                        label="Tên nhóm thiết bị"
                        name="parent"
                    >
                        <Input />
                    </Form.Item>}
                    <Form.Item
                        style={{ marginBottom: 8 }}
                        label="Tên Thiết bị"
                        name="name"
                        rules={[{ required: true }]}
                    >
                        <Input />
                    </Form.Item>

                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                style={{ marginBottom: 8 }}
                                label="Mã số/Mô tả"
                                name="description"
                                rules={[{ required: true }]}
                            >
                                <Input />
                            </Form.Item>

                        </Col>

                        <Col span={12}>
                            <Form.Item
                                label="Đơn vị"
                                name="unit"
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
                    <Row gutter={16}>
                        <Col span={12}>
                            {status === 'UPDATE' && <Form.Item
                                style={{ marginBottom: 8 }}
                                label="Trạng thái"
                                name="status"
                            >
                                <Select
                                    style={{ width: '100%' }}
                                    showSearch={{ optionFilterProp: 'label' }}
                                    placeholder="Vui lòng chọn trạng thái"
                                    options={statusArr}
                                />
                            </Form.Item>}
                            {status === 'CREATE' && <Form.Item
                                style={{ marginBottom: 8 }}
                                label="Ghi chú"
                                name="note"
                                rules={[{ required: true }]}
                            >
                                <Input />
                            </Form.Item>}

                        </Col>

                        <Col span={12}>
                            <Form.Item
                                label="Loại thiết bị"
                                name="type"
                                rules={[{ required: true }]}
                            >
                                <Select
                                    style={{ width: '100%' }}
                                    showSearch={{ optionFilterProp: 'label' }}
                                    placeholder="Vui lòng chọn loại thiết bị"
                                    onChange={onChange}
                                    options={typeArr}
                                />
                            </Form.Item>
                        </Col>
                    </Row>
                    {status === 'UPDATE' && <Form.Item
                        style={{ marginBottom: 8 }}
                        label="Ghi chú"
                        name="note"
                        rules={[{ required: false }]}
                    >
                        <Input />
                    </Form.Item>}

                    <Row gutter={16}>
                        <Col span={8}>
                            <Form.Item
                                style={{ marginBottom: 8 }}
                                label="Năm sử dụng"
                                name="usedYear"
                                rules={[{ required: true }]}
                            >
                                <InputNumber style={{ width: '100%' }} />
                            </Form.Item>
                        </Col>

                        <Col span={8}>
                            <Form.Item
                                style={{ marginBottom: 8 }}
                                label="Tỷ lệ khấu hao"
                                name="trongSoChatLuong"
                                rules={[{ required: true }]}
                            >
                                <InputNumber style={{ width: '100%' }} />
                            </Form.Item>
                        </Col>

                        <Col span={8}>
                            <Form.Item
                                style={{ marginBottom: 8 }}
                                label="Chất lượng còn lại"
                                name="chatLuongConLai"
                                rules={[{ required: true }]}
                            >
                                <InputNumber readOnly style={{ width: '100%' }} />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Typography style={{ margin: '6px 0', fontWeight: 'bold' }}>Sổ kế toán</Typography>
                    <Row gutter={16}>
                        <Col span={8}>
                            <Form.Item
                                style={{ marginBottom: 8 }}
                                label="Số lượng"
                                name={['soKeToan', 'soLuong']}
                                rules={[{ required: true }]}
                            >
                                <InputNumber style={{ width: '100%' }} />
                            </Form.Item>
                        </Col>

                        <Col span={8}>
                            <Form.Item
                                style={{ marginBottom: 8 }}
                                label="Nguyên giá"
                                name={['soKeToan', 'nguyenGia']}
                            >
                                <InputNumber style={{ width: '100%' }} />
                            </Form.Item>
                        </Col>

                        <Col span={8}>
                            <Form.Item
                                style={{ marginBottom: 8 }}
                                label="Giá trị còn lại"
                                name={['soKeToan', 'giaTriConLai']}
                            >
                                <InputNumber readOnly style={{ width: '100%' }} />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Typography style={{ margin: '6px 0', fontWeight: 'bold' }}>Kiểm kê</Typography>
                    <Row gutter={16}>
                        <Col span={8}>
                            <Form.Item
                                style={{ marginBottom: 8 }}
                                label="Số lượng"
                                name={['kiemKe', 'soLuong']}
                                rules={[{ required: true }]}
                            >
                                <InputNumber style={{ width: '100%' }} />
                            </Form.Item>
                        </Col>

                        <Col span={8}>
                            <Form.Item
                                style={{ marginBottom: 8 }}
                                label="Nguyên giá"
                                name={['kiemKe', 'nguyenGia']}
                            >
                                <InputNumber style={{ width: '100%' }} />
                            </Form.Item>
                        </Col>

                        <Col span={8}>
                            <Form.Item
                                style={{ marginBottom: 8 }}
                                label="Giá trị còn lại"
                                name={['kiemKe', 'giaTriConLai']}
                            >
                                <InputNumber readOnly style={{ width: '100%' }} />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Typography style={{ margin: '6px 0', fontWeight: 'bold' }}>Chênh lệch</Typography>
                    <Row gutter={16}>
                        <Col span={8}>
                            <Form.Item
                                style={{ marginBottom: 8 }}
                                label="Thừa"
                                name={['chenhLech', 'thua']}
                                rules={[{ required: true }]}
                            >
                                <InputNumber style={{ width: '100%' }} />
                            </Form.Item>
                        </Col>

                        <Col span={8}>
                            <Form.Item
                                style={{ marginBottom: 8 }}
                                label="Thiếu"
                                name={['chenhLech', 'thieu']}
                                rules={[{ required: true }]}
                            >
                                <InputNumber style={{ width: '100%' }} />
                            </Form.Item>
                        </Col>

                        <Col span={8}>
                            <Form.Item
                                style={{ marginBottom: 8 }}
                                label="Giá trị còn lại"
                                name={['chenhLech', 'giaTriConLai']}
                            >
                                <InputNumber readOnly style={{ width: '100%' }} />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Form.List name="usedLocation">
                        {(fields, { add, remove }) => (
                            <>
                                {fields.map(({ key, name, ...restField }, index) => {
                                    const currentLocation = form.getFieldValue(['usedLocation', name]);
                                    const showReasonInfo = currentLocation?.person || currentLocation?.reason;
                                    return (
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
                                                Nơi sử dụng {index + 1}
                                            </Typography.Text>

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
                                                        label="Phòng - kho"
                                                        name={[name, 'room']}
                                                        style={{ marginBottom: 6 }}
                                                        rules={[{ required: true }]}
                                                    >
                                                        <Select
                                                            style={{ width: '100%' }}
                                                            showSearch={{ optionFilterProp: 'label' }}
                                                            placeholder="Vui lòng chọn phòng - kho"
                                                            onChange={onChange}
                                                            options={
                                                                rooms && rooms.length > 0
                                                                    ? rooms.map(({ _id, name, currentUnit }) => ({
                                                                        value: _id,
                                                                        label: `${name} (${currentUnit?.name || 'N/A'})`
                                                                    }))
                                                                    : []
                                                            }
                                                        />
                                                    </Form.Item>
                                                </Col>
                                            </Row>
                                            {showReasonInfo && <Row gutter={12}>
                                                <Col span={8}>
                                                    <Form.Item
                                                        {...restField}
                                                        label="Người thay đổi"
                                                        name={[name, 'person']}
                                                        rules={[{ required: true }]}
                                                    >
                                                        <Input readOnly />
                                                    </Form.Item>
                                                </Col>

                                                <Col span={16}>
                                                    <Form.Item
                                                        {...restField}
                                                        label="Lý do"
                                                        name={[name, 'reason']}

                                                        style={{ marginBottom: 6 }}
                                                        rules={[{ required: true }]}
                                                    >
                                                        <Input />
                                                    </Form.Item>
                                                </Col>
                                            </Row>}

                                            <Typography.Link
                                                onClick={() => remove(name)}
                                                style={{ color: 'red' }}
                                            >
                                                Xóa nơi sử dụng này
                                            </Typography.Link>
                                        </div>
                                    )
                                }
                                )}
                                <Form.Item>
                                    <Typography.Link onClick={() => add({
                                        year: new Date().getFullYear(),
                                        person: email, // Điền sẵn email vào field person
                                        reason: ''
                                    })}>
                                        + Thêm nơi sử dụng
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

export default DeviceModal;