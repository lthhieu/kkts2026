'use client'
import React, { useMemo, useState } from 'react';
import { Button, Flex, Popconfirm, Space, Table, Tag, message, notification } from 'antd';
import type { PopconfirmProps, TableProps } from 'antd';
import { DeleteOutlined, EditOutlined, FolderAddOutlined } from '@ant-design/icons';
import { useRouter } from 'next/navigation';
import { handleDeleteUser } from '@/app/(main)/quan-tri/tai-khoan/actions';
import UserModal from '@/components/tai-khoan/modal';
import { canCreateUser, canDeleteUser, canUpdateUser } from '@/libs/users';


interface IProps {
    users: IUser[],
    access_token: string,
    meta: IMeta,
    units: IUnit[],
    user: IUser | null
}
const Context = React.createContext({ name: 'Default' });

const ROLE_COLOR_MAP: Record<string, string> = {
    superadmin: 'red',
    admin: 'gold',
    thukho: 'purple',
    truongdv: 'blue',
    gv: 'green',
};
const ROLE_LABEL_MAP: Record<string, string> = {
    superadmin: 'Quản trị hệ thống',
    admin: 'Quản trị',
    thukho: 'Thủ kho',
    truongdv: 'Trưởng đơn vị',
    gv: 'Giáo viên',
};


const TableUsers = (props: IProps) => {
    const { users, access_token, meta, units, user } = props
    const [isModalOpen, SetIsModalOpen] = useState(false)
    const [status, setStatus] = useState('')
    const [dataUpdate, setDataUpdate] = useState<null | IUser>(null)
    const router = useRouter()
    const [messageApi, contextHolder] = message.useMessage();
    const [api, contextHolderNotification] = notification.useNotification();
    const contextValue = useMemo(() => ({ name: 'Ant Design' }), []);

    const showModal = () => {
        setStatus("CREATE")
        SetIsModalOpen(true);
    }
    const confirm = (_id: string) => {
        deleteUser(_id)
    };
    const cancel: PopconfirmProps['onCancel'] = (e) => {
        // console.log(e);
    };

    const deleteUser = async (_id: string) => {
        const res = await handleDeleteUser(_id, access_token)
        if (!res.data) {
            api.error({
                title: `Có lỗi xảy ra`,
                description: res.message,
                placement: 'topRight',
            });
        }
        else {
            messageApi.success(res.message);
        }
    }

    const columns: TableProps<IUser>['columns'] = [
        {
            title: 'Tên tài khoản',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
            responsive: ['md'],
        },
        {
            title: 'Quyền hạn',
            dataIndex: 'role',
            key: 'role',
            responsive: ['md'],
            render: (_, record) => (
                <Tag color={ROLE_COLOR_MAP[record.role] || 'default'} variant='outlined'>
                    {ROLE_LABEL_MAP[record.role] || record.role}
                </Tag>
            )
        },
        {
            title: 'Đơn vị',
            dataIndex: ['unit', 'name'],
            key: 'unit',
            responsive: ['md'],
        },
        {
            title: '',
            key: 'action',
            render: (_, record) => (
                <Space size="middle">
                    {canUpdateUser(user as IUser) && (
                        <Button color="green" variant="outlined" icon={<EditOutlined />}
                            onClick={() => {
                                setDataUpdate(record)
                                setStatus("UPDATE")
                                SetIsModalOpen(true)
                            }}
                        ></Button>
                    )}

                    {canDeleteUser(user as IUser) && (
                        <Popconfirm
                            title="Xóa tài khoản này?"
                            description={`Bạn thực sự muốn xóa tài khoản ${record.email}`}
                            onConfirm={() => confirm(record._id)}
                            onCancel={cancel}
                            okText="Đồng ý"
                            cancelText="Hủy"
                        >
                            <Button icon={<DeleteOutlined />} color="danger" variant="outlined"></Button>
                        </Popconfirm>
                    )}
                </Space>
            ),
        },
    ];
    const handleOnChangePage = (current: number, pageSize: number) => {
        router.push(`/quan-tri/tai-khoan?current=${current}&pageSize=${pageSize}`);
    };

    return (
        <Context.Provider value={contextValue}>
            {contextHolder}{contextHolderNotification}
            <Flex style={{ marginBottom: 16 }} justify='space-between' align='center'>
                <h2>Danh sách tài khoản</h2>
                {canCreateUser(user ?? {} as IUser) && (
                    <Button onClick={showModal} type='primary' icon={<FolderAddOutlined />}>Thêm mới</Button>
                )}
            </Flex>
            <Table<IUser>
                pagination={{
                    current: meta.current,
                    pageSize: meta.pageSize,
                    total: meta.total,
                    showTotal: (total, range) => `${range[0]}-${range[1]} / ${total} kết quả`,
                    onChange: (page: number, pageSize: number) => handleOnChangePage(page, pageSize),
                    pageSizeOptions: [5, 10, 20],
                    showSizeChanger: true,
                }}
                columns={columns} dataSource={users} rowKey={"_id"} />
            <UserModal
                setStatus={setStatus}
                status={status}
                access_token={access_token}
                isModalOpen={isModalOpen}
                setIsModalOpen={SetIsModalOpen}
                //update info
                setDataUpdate={setDataUpdate}
                dataUpdate={dataUpdate}
                units={units}
            />
        </Context.Provider>
    )
}

export default TableUsers;