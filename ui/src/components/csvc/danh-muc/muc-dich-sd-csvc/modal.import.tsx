'use client'
import { Modal, message, notification, Upload, UploadProps, Table } from 'antd';
import React, { useMemo, useState } from 'react';
import { handleCreateManyMucdichsudungcsvc } from '@/app/(main)/quan-tri/csvc/danh-muc/muc-dich-sd-csvc/actions';
import { InboxOutlined } from '@ant-design/icons';
import * as Excel from 'exceljs';

interface IProps {
    access_token?: string;
    isModalImportOpen: boolean;
    setIsModalImportOpen: (value: boolean) => void;
}

const { Dragger } = Upload;
const Context = React.createContext({ name: 'Default' });

const ModalImport = (props: IProps) => {
    const { access_token, isModalImportOpen, setIsModalImportOpen } = props;
    const [messageApi, contextHolder] = message.useMessage();
    const [api, contextHolderNotification] = notification.useNotification();
    const contextValue = useMemo(() => ({ name: 'Ant Design' }), []);
    const [dataImport, setDataImport] = useState<{ name: string }[]>([]);
    const [confirmLoading, setConfirmLoading] = useState(false);

    const uploadProps: UploadProps = {
        name: 'file', multiple: false, maxCount: 1,
        beforeUpload: (file) => {
            const valid = ['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'text/csv'].includes(file.type);
            if (!valid) message.error(`${file.name} không phải file xlsx hoặc csv`);
            return valid || Upload.LIST_IGNORE;
        },
        customRequest: ({ onSuccess }) => { if (onSuccess) onSuccess('ok'); },
        async onChange(info) {
            if (info.fileList.length > 0) {
                try {
                    const arrayBuffer = await info.file.originFileObj!.arrayBuffer();
                    const workbook = new Excel.Workbook();
                    await workbook.xlsx.load(arrayBuffer);
                    const worksheet = workbook.getWorksheet(1) || workbook.worksheets[0];
                    if (!worksheet) return;
                    const jsonData: { name: string }[] = [];
                    worksheet.eachRow((row, rowNumber) => {
                        if (rowNumber <= 2) return;
                        const name = row.getCell(1).value;
                        if (name) jsonData.push({ name: String(name) });
                    });
                    setDataImport(jsonData);
                } catch (e) { message.error('Có lỗi khi đọc file Excel'); }
            }
        },
    };

    const handleOk = () => {
        setConfirmLoading(true);
        setTimeout(async () => {
            const response = await handleCreateManyMucdichsudungcsvc(dataImport, access_token ?? '');
            if (response.data) { messageApi.success(response.message); handleCancel(); }
            else api.error({ title: 'Có lỗi xảy ra', description: response.message, placement: 'topRight' });
            setConfirmLoading(false);
        }, 2000);
    };

    const handleCancel = () => { setDataImport([]); setIsModalImportOpen(false); };

    return (
        <Context.Provider value={contextValue}>
            {contextHolder}{contextHolderNotification}
            <Modal title="Import dữ liệu" open={isModalImportOpen} onOk={handleOk} okText="Import"
                cancelText="Hủy" onCancel={handleCancel} okButtonProps={{ disabled: dataImport.length === 0 }}
                confirmLoading={confirmLoading}
                width={{ xs: '90%', sm: '80%', md: '70%', lg: '60%', xl: '50%', xxl: '40%' }}>
                <Dragger {...uploadProps}>
                    <p className="ant-upload-drag-icon"><InboxOutlined /></p>
                    <p className="ant-upload-text">Chọn hoặc kéo thả file để tải dữ liệu</p>
                    <p className="ant-upload-hint">Chỉ hỗ trợ file excel và csv</p>
                </Dragger>
                <Table<{ name: string }>
                    scroll={{ x: 'max-content' }}
                    title={() => <span>Dữ liệu:</span>}
                    dataSource={dataImport} rowKey={() => crypto.randomUUID()}
                    columns={[{ dataIndex: 'name', title: 'Tên' }]} />
            </Modal>
        </Context.Provider>
    );
};

export default ModalImport;
