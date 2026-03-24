'use client'
import React, { useEffect, useMemo, useState } from 'react';
import { Button, Flex, Grid, Input, Popconfirm, Select, Space, Table, Tag, Tooltip, Typography, message, notification } from 'antd';
import type { PopconfirmProps, TableProps } from 'antd';
import { ClearOutlined, CloudDownloadOutlined, CloudUploadOutlined, DeleteOutlined, EditOutlined, FolderAddOutlined, SearchOutlined } from '@ant-design/icons';
import { useRouter } from 'next/navigation';
import { handleDeleteUser, handleDeleteUserMany } from '@/app/(main)/quan-tri/tai-khoan/actions';
import UserModal from '@/components/tai-khoan/modal';
import { canCreateUser, canDeleteUser, canReadUser, canUpdateUser } from '@/libs/users';
import { CSVLink } from 'react-csv';
import ModalImport from '@/components/tai-khoan/modal.import';

type TableRowSelection<T extends object = object> = TableProps<T>['rowSelection'];

interface IProps {
    users: IUser[],
    access_token: string,
    meta: IMeta,
    units: IUnit[],
    user: IUser | null
}
const Context = React.createContext({ name: 'Default' });
const { useBreakpoint } = Grid;

export const ROLE_COLOR_MAP: Record<string, string> = {
    superadmin: 'red',
    admin: 'gold',
    thukho: 'purple',
    truongdv: 'blue',
    gv: 'green',
    guest: 'default'
};
export const ROLE_LABEL_MAP: Record<string, string> = {
    superadmin: 'Quản trị hệ thống',
    admin: 'Quản trị',
    thukho: 'Thủ kho',
    truongdv: 'Trưởng đơn vị',
    gv: 'Giáo viên',
    guest: 'Khách'
};

export const roleArray = [
    { value: 'superadmin', label: 'Quản trị hệ thống' },
    { value: 'admin', label: 'Quản trị' },
    { value: 'thukho', label: 'Thủ kho' },
    { value: 'truongdv', label: 'Trưởng đơn vị' },
    { value: 'gv', label: 'Giáo viên' },
    { value: 'guest', label: 'Khách' }
]


const TableUsers = (props: IProps) => {
    const { users, access_token, meta, units, user } = props
    const [isModalOpen, SetIsModalOpen] = useState(false)
    const [status, setStatus] = useState('')
    const [dataUpdate, setDataUpdate] = useState<null | IUser>(null)
    const [isModalImportOpen, SetIsModalImportOpen] = useState(false)

    const router = useRouter()
    const [messageApi, contextHolder] = message.useMessage();
    const [api, contextHolderNotification] = notification.useNotification();
    const contextValue = useMemo(() => ({ name: 'Ant Design' }), []);
    const screens = useBreakpoint();
    const isMobile = !screens.md;  // < 768px
    const [loading, setLoading] = useState(false);
    const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
    const [dataExport, setDataExport] = useState<any[]>([])

    const [selectedUnit, setSelectedUnit] = useState<string | undefined>(undefined);
    const [selectedRole, setSelectedRole] = useState<string | undefined>(undefined);

    const [selectedEmail, setSelectedEmail] = useState<string | undefined>(undefined);

    useEffect(() => {
        const filteredData = users.map(({ _id, name, email, role, unit }) =>
        ({
            _id, name, email, role: ROLE_LABEL_MAP[role] || role, unit: unit?.name || ""
        }));
        setDataExport(filteredData);
    }, [users])

    const showModal = () => {
        setStatus("CREATE")
        SetIsModalOpen(true);
    }
    const showModalImport = () => {
        SetIsModalImportOpen(true);
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
            render: (_, record) => <Space>
                <Typography.Text copyable={{ text: record._id }}>
                    {record.name}
                </Typography.Text>
                {canUpdateUser(user as IUser) && (
                    <Tooltip title="Cập nhật">
                        <EditOutlined
                            style={{ color: '#1cc03d', cursor: 'pointer' }}
                            onClick={() => {
                                setDataUpdate(record)
                                setStatus("UPDATE")
                                SetIsModalOpen(true)
                            }}
                        />
                    </Tooltip>
                )}

                {canDeleteUser(user as IUser) && (
                    <Popconfirm
                        title="Xóa tài khoản này?"
                        description={`Bạn thực sự muốn xóa tài khoản ${record.email}`}
                        onConfirm={() => confirm(record._id)}
                        onCancel={cancel}
                        okText="Đồng ý"
                        cancelText="Hủy"
                        placement='rightBottom'
                    >
                        <Tooltip title="Xóa">
                            <DeleteOutlined
                                style={{ color: '#f12929', cursor: 'pointer' }} />
                        </Tooltip>
                    </Popconfirm>


                )}
            </Space>
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
            render: (_, record) => (
                <Typography.Text copyable={{ text: record.email }}>
                    {record.email}
                </Typography.Text>
            )
        },
        {
            title: 'Quyền hạn',
            dataIndex: 'role',
            key: 'role',
            render: (_, record) => (
                <Tag color={ROLE_COLOR_MAP[record.role] || 'default'} variant='outlined'>
                    {ROLE_LABEL_MAP[record.role] || record.role}
                </Tag>
            )
        },
        {
            title: 'Số điện thoại',
            dataIndex: 'phone',
            key: 'phone',
            render: (_, record) => (
                <Typography.Text copyable={{ text: record.phone }}>
                    {record.phone}
                </Typography.Text>
            )
        },
        {
            title: 'Đơn vị',
            dataIndex: ['unit', 'name'],
            key: 'unit',
        },
    ];
    const handleOnChangePage = (current: number, pageSize: number) => {
        const params = new URLSearchParams()

        if (selectedEmail) params.set('email', selectedEmail)
        if (selectedUnit) params.set('unit', selectedUnit)
        if (selectedRole) params.set('role', selectedRole)

        params.set('current', current.toString())
        params.set('pageSize', pageSize.toString())
        router.push(`/quan-tri/tai-khoan?${params.toString()}`);
    };
    const deleteUserMany = async (ids: string[]) => {
        const res = await handleDeleteUserMany(ids, access_token)
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

    const start = () => {
        setLoading(true);
        // ajax request after empty completing
        setTimeout(() => {
            deleteUserMany(selectedRowKeys as string[])
            setSelectedRowKeys([])
            setLoading(false);
        }, 1000);
    };
    const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
        console.log('selectedRowKeys changed: ', newSelectedRowKeys);
        setSelectedRowKeys(newSelectedRowKeys);
    };
    const hasSelected = selectedRowKeys.length > 0;
    const rowSelection: TableRowSelection<IUser> = {
        selectedRowKeys,
        onChange: onSelectChange,
    };
    const headers = [
        { label: "Mã tài khoản", key: "_id" },
        { label: "Tên tài khoản", key: "name" },
        { label: "Email", key: "email" },
        { label: "Quyền hạn", key: "role" },
        { label: "Đơn vị", key: "unit" },
    ];

    // Hàm xử lý khi chọn unit
    const onChangeUnit = (value: string) => {
        setSelectedUnit(value);
    };

    // Hàm xử lý khi chọn role
    const onChangeRole = (value: string) => {
        setSelectedRole(value);
    };

    // Hàm xóa bộ lọc
    const handleClear = () => {
        setSelectedUnit(undefined);
        setSelectedRole(undefined);
        setSelectedEmail(undefined);
    };
    const handleFilter = () => {
        const params = new URLSearchParams()
        if (selectedUnit) params.set('unit', selectedUnit)
        if (selectedRole) params.set('role', selectedRole)
        if (selectedEmail) params.set('email', selectedEmail)

        params.set('current', '1')
        params.set('pageSize', meta.pageSize.toString())

        router.push(`/quan-tri/tai-khoan?${params.toString()}`)
    }

    return (
        <Context.Provider value={contextValue}>
            {contextHolder}{contextHolderNotification}
            <Flex style={{ marginBottom: 16 }} justify='space-between'
                align={isMobile ? 'stretch' : 'center'}
                vertical={isMobile} gap={16}>
                <h2>Danh sách tài khoản</h2>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                    {canDeleteUser(user ?? {} as IUser) && (<Button icon={<DeleteOutlined />} color="danger" variant="solid" onClick={start} disabled={!hasSelected} loading={loading}>Xóa {selectedRowKeys.length !== 0 && `(${selectedRowKeys.length})`}</Button>)}
                    {canCreateUser(user ?? {} as IUser) && <Button onClick={showModalImport} type='primary' icon={<CloudUploadOutlined />}>Import</Button>}
                    {canReadUser(user ?? {} as IUser) && (<Button type='primary' icon={<CloudDownloadOutlined />}>
                        <CSVLink
                            data={dataExport}
                            filename={"tai-khoan.csv"}
                            headers={headers}
                            separator={";"}
                        >
                            Export
                        </CSVLink>
                    </Button>)}
                    {canCreateUser(user ?? {} as IUser) && (
                        <Button onClick={showModal} type='primary' icon={<FolderAddOutlined />}>Thêm mới</Button>
                    )}
                </div>

            </Flex>
            {canReadUser(user ?? {} as IUser) && (<Space style={{ marginBottom: 16, flexWrap: 'wrap' }}>
                <Input allowClear placeholder="Tìm theo địa chỉ email"
                    onChange={(e) => setSelectedEmail(e.target.value)} value={selectedEmail} />
                {user?.role === 'truongdv' ? <></> : <Select
                    style={{ width: '100%' }}
                    showSearch={{ optionFilterProp: 'label' }}
                    placeholder="Vui lòng chọn đơn vị"
                    // 🔥 Gán value từ state vào đây
                    value={selectedUnit}
                    onChange={onChangeUnit}
                    allowClear
                    options={
                        units && units.length > 0
                            ? units.map(({ _id, name }) => ({
                                value: _id,
                                label: name
                            }))
                            : []
                    }
                />}
                <Select
                    style={{ width: '100%' }}
                    showSearch={{ optionFilterProp: 'label' }}
                    placeholder="Vui lòng chọn quyền hạn"
                    // 🔥 Gán value từ state vào đây
                    value={selectedRole}
                    onChange={onChangeRole}
                    allowClear
                    options={roleArray}
                />
                <Button icon={<ClearOutlined />} onClick={handleClear}>Xóa bộ lọc</Button>
                <Button icon={<SearchOutlined />} type='primary' onClick={handleFilter}>Lọc</Button>
            </Space>)}
            <Table<IUser>
                scroll={{ x: "max-content" }}
                pagination={{
                    current: meta.current,
                    pageSize: meta.pageSize,
                    total: meta.total,
                    showTotal: (total, range) => `${range[0]}-${range[1]} / ${total} kết quả`,
                    onChange: (page: number, pageSize: number) => handleOnChangePage(page, pageSize),
                    pageSizeOptions: [20, 50, 100],
                    defaultPageSize: 20,
                    showSizeChanger: true,
                }}
                rowSelection={{ type: 'checkbox', ...rowSelection }}
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
            <ModalImport
                access_token={access_token}
                isModalImportOpen={isModalImportOpen}
                setIsModalImportOpen={SetIsModalImportOpen}
            />
        </Context.Provider>
    )
}

export default TableUsers;