'use client'
import { Modal, message, notification, Upload, UploadProps, Table } from 'antd';
import React, { useMemo, useState } from 'react';
import { handleCreateManyCtk } from '@/app/(main)/quan-tri/csvc/ctk/actions';
import { InboxOutlined } from '@ant-design/icons';
import * as Excel from 'exceljs';

interface IProps {
    access_token?: string;
    isModalImportOpen: boolean;
    setIsModalImportOpen: (value: boolean) => void;
}

const { Dragger } = Upload;

const Context = React.createContext({ name: 'Default' });

const ModalImportCtk = (props: IProps) => {
    const { access_token, isModalImportOpen, setIsModalImportOpen } = props;
    const [messageApi, contextHolder] = message.useMessage();
    const [api, contextHolderNotification] = notification.useNotification();
    const contextValue = useMemo(() => ({ name: 'Ant Design' }), []);
    const [dataImport, setDataImport] = useState<any[]>([]);
    const [confirmLoading, setConfirmLoading] = useState(false);

    const uploadProps: UploadProps = {
        name: 'file',
        multiple: false,
        maxCount: 1,
        beforeUpload: (file) => {
            const typeCheck = ['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'text/csv'];
            const isValidate = typeCheck.some((element) => element === file.type);
            if (!isValidate) message.error(`${file.name} không phải file xlsx hoặc csv`);
            return isValidate || Upload.LIST_IGNORE;
        },
        customRequest: ({ onSuccess }) => { if (onSuccess) onSuccess('ok'); },
        async onChange(info) {
            const { status } = info.file;
            if (status === 'done' || info.fileList.length > 0) {
                try {
                    const arrayBuffer = await info.file.originFileObj!.arrayBuffer();
                    const workbook = new Excel.Workbook();
                    await workbook.xlsx.load(arrayBuffer);
                    const worksheet = workbook.getWorksheet(1) || workbook.worksheets[0];
                    if (!worksheet) return;

                    const jsonData: any[] = [];
                    worksheet.eachRow((row, rowNumber) => {
                        if (rowNumber <= 2) return;
                        const getVal = (col: number) => row.getCell(col).value;
                        // A=ma_ct, B=ten_ct, C=doi_tuong_sd, D=dt_sxd, E=von_bd, F=von_dt, G=so_phong_o_cong_vu, H=so_cho_o, I=nam_sd, J=diachi
                        jsonData.push({
                            ma_ct: getVal(1) ? String(getVal(1)) : '',
                            ten_ct: getVal(2) ? String(getVal(2)) : '',
                            loaicongtrinhcsvc: getVal(3) ? String(getVal(3)) : null,
                            mucdichsudungcsvc: getVal(4) ? String(getVal(4)) : null,
                            doi_tuong_sd: getVal(5) ? String(getVal(5)) : '',
                            dt_sxd: Number(getVal(6)) || 0,
                            von_bd: Number(getVal(7)) || 0,
                            von_dt: Number(getVal(8)) || 0,
                            tinhtrangcsvc: getVal(9) ? String(getVal(9)) : null,
                            htsh: getVal(10) ? String(getVal(10)) : null,
                            ct_csvc_trongnha: getVal(11) ? String(getVal(11)) : null,
                            so_phong_o_cong_vu_cho_cb_giangday: Number(getVal(12)) || 0,
                            so_cho_o_cho_cb_giangday: Number(getVal(13)) || 0,
                            nam_sd: Number(getVal(14)) || 0,
                            tinh_trang_sd: getVal(15) ? String(getVal(15)) : null,
                            ngay_chuyen_tt: getVal(16) ? String(getVal(16)) : null,
                            diachi: getVal(17) ? String(getVal(17)) : '',
                        });
                    });
                    setDataImport(jsonData);
                    if (status === 'done') message.success(`${info.file.name} tải lên thành công`);
                } catch (error) {
                    message.error('Có lỗi khi đọc file Excel');
                }
            } else if (status === 'error') {
                message.error(`${info.file.name} tải lên thất bại`);
            }
        },
        onDrop() { },
    };

    const handleOk = () => {
        setConfirmLoading(true);
        setTimeout(async () => {
            const response = await handleCreateManyCtk(dataImport, access_token ?? '');
            if (response.data) {
                messageApi.success(response.message);
                handleCancel();
            } else {
                api.error({ title: 'Có lỗi xảy ra', description: response.message, placement: 'topRight' });
            }
            setConfirmLoading(false);
        }, 2000);
    };

    const handleCancel = () => {
        setDataImport([]);
        setIsModalImportOpen(false);
    };

    return (
        <Context.Provider value={contextValue}>
            {contextHolder}{contextHolderNotification}
            <Modal
                title="Import dữ liệu công trình CSVC"
                closable={{ 'aria-label': 'Custom Close Button' }}
                open={isModalImportOpen}
                onOk={handleOk}
                okText="Import"
                cancelText="Hủy"
                onCancel={handleCancel}
                okButtonProps={{ disabled: dataImport.length === 0 }}
                confirmLoading={confirmLoading}
                width={{ xs: '90%', sm: '80%', md: '70%', lg: '60%', xl: '50%', xxl: '40%' }}
            >
                <Dragger {...uploadProps}>
                    <p className="ant-upload-drag-icon"><InboxOutlined /></p>
                    <p className="ant-upload-text">Chọn hoặc kéo thả file để tải dữ liệu</p>
                    <p className="ant-upload-hint">
                        Chỉ hỗ trợ file excel và csv
                        &nbsp;<a onClick={(e) => e.stopPropagation()} href={`${process.env.NEXT_PUBLIC_FRONTEND_URI}sample/sample-ctk.xlsx`} download>Tải file mẫu</a>
                    </p>
                </Dragger>
                <div>
                    <Table<any>
                        scroll={{ x: 'max-content' }}
                        title={() => <span>Dữ liệu:</span>}
                        dataSource={dataImport}
                        rowKey={() => crypto.randomUUID()}
                        columns={[
                            { dataIndex: 'ma_ct', title: 'Mã công trình' },
                            { dataIndex: 'ten_ct', title: 'Tên công trình' },
                            { dataIndex: 'nam_sd', title: 'Năm sử dụng' },
                        ]}
                    />
                </div>
            </Modal>
        </Context.Provider>
    );
};

export default ModalImportCtk;
