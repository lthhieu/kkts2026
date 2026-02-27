"use client"
import { Modal, Form, Input, message, Select, notification } from 'antd';
import React, { useEffect, useMemo } from 'react';
import { handleCreateOrUpdateUser } from '@/app/(main)/quan-tri/tai-khoan/actions';
import { LockOutlined } from '@ant-design/icons';

interface IProps {
    access_token?: string,
    isModalOpen: boolean,
    setIsModalOpen: (value: boolean) => void,
    status: string,
    setStatus: (value: string) => void,
    //update
    dataUpdate: null | IUser,
    setDataUpdate: (value: null | IUser) => void,
    units: IUnit[]
}

const Context = React.createContext({ name: 'Default' });


const UserModal = (props: IProps) => {
    const { setIsModalOpen, isModalOpen, setStatus, status, access_token, setDataUpdate, dataUpdate, units } = props
    const [form] = Form.useForm()
    const [messageApi, contextHolder] = message.useMessage();
    const [api, contextHolderNotification] = notification.useNotification();
    const contextValue = useMemo(() => ({ name: 'Ant Design' }), []);

    useEffect(() => {
        if (dataUpdate) {
            form.setFieldsValue({
                name: dataUpdate.name,
                email: dataUpdate.email,
                _id: dataUpdate._id,
                password: dataUpdate.password,
                unit: dataUpdate.unit?._id,
                role: dataUpdate.role
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

    const onFinish = async (values: IUser) => {
        const { name, email, password, unit, role } = values
        const data = { name, email, password, unit, role }
        const response = await handleCreateOrUpdateUser(data, access_token ?? '', status, dataUpdate)

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
        types: { email: '${label} không hợp lệ' },
    }

    const onChange = (value: string) => {
        console.log(`selected ${value}`);
    };

    const onSearch = (value: string) => {
        console.log('search:', value);
    };

    return (
        <Context.Provider value={contextValue}>
            {contextHolder}{contextHolderNotification}
            <Modal
                title={status === "CREATE" ? "Thêm Tài khoản" : "Cập nhật Tài khoản"}
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
                    name="user-modal"
                    onFinish={onFinish}
                    validateMessages={validateMessages}
                >
                    <Form.Item
                        style={{ marginBottom: 8 }}
                        label="Tên Tài khoản"
                        name="name"
                        rules={[{ required: true }]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        style={{ marginBottom: 8 }}
                        label="Email"
                        name="email"
                        rules={[{
                            required: true,
                        }]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        style={{ marginBottom: 8 }}
                        label="Mật khẩu"
                        name="password"
                        rules={[{
                            required: dataUpdate ? false : true,
                        }]}

                    >
                        <Input.Password
                            prefix={<LockOutlined />}
                            type="password"
                            placeholder="Mật khẩu"
                        />
                    </Form.Item>

                    <Form.Item label={'Đơn vị'} name={'unit'} rules={[{ required: true }]}>
                        <Select
                            style={{ minWidth: 250 }}
                            showSearch={{ optionFilterProp: 'label', onSearch }}
                            placeholder="Vui lòng chọn đơn vị"
                            onChange={onChange}
                            options={units.length > 0 ? units.map(({ _id, name }) => ({
                                value: _id,
                                label: name
                            })) : []
                            }
                        />
                    </Form.Item>
                    <Form.Item label={'Quyền hạn'} name={'role'} rules={[{ required: true }]}>
                        <Select
                            style={{ minWidth: 250 }}
                            showSearch
                            placeholder="Vui lòng chọn quyền hạn"
                            options={[
                                { value: 'superadmin', label: 'Quản trị hệ thống' },
                                { value: 'admin', label: 'Quản trị' },
                                { value: 'thukho', label: 'Thủ kho' },
                                { value: 'truongdv', label: 'Trưởng đơn vị' },
                                { value: 'gv', label: 'Giáo viên' }
                            ]
                            }
                        />
                    </Form.Item>
                </Form>
            </Modal>
        </Context.Provider>
    );
};

export default UserModal;