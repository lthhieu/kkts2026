'use client'
import { Modal, message, notification, Upload, UploadProps, Table } from 'antd';
import React, { useMemo, useState } from 'react';
import { handleCreateManyThuvien } from '@/app/(main)/quan-tri/csvc/thu-vien/actions';
import { InboxOutlined } from '@ant-design/icons';
import * as Excel from 'exceljs';

interface IProps {
    access_token?: string;
    isModalImportOpen: boolean;
    setIsModalImportOpen: (value: boolean) => void;
}

const { Dragger } = Upload;
const Context = React.createContext({ name: 'Default' });

const ModalImportThuvien = (props: IProps) => {
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
                        // A=ma_thuvien, B=name, C=nam_sd, D=dt, E=dt_phongdoc, F=so_phong_doc
                        // G=soluong_maytinh, H=soluong_cho_ngoi_doc_sach, I=soluong_sach, J=soluong_tapchi
                        // K=soluong_sach_dien_tu, L=soluong_tapchi_dien_tu
                        // M=soluong_thu_vien_lien_ket_trong_nuoc, N=soluong_thu_vien_dien_tu_lien_ket_nuoc_ngoai
                        // O=soluong_dau_sach, P=soluong_dau_tap_chi, Q=soluong_dau_sach_dien_tu, R=soluong_dau_tap_chi_dien_tu
                        // S=so_dau_sach_dien_tu_co_truy_cap_truc_tuyen, T=so_dau_sach_co_ban_in, U=so_dau_sach_in_co_the_muon_truc_tiep
                        // V=tinhtrangcsvc(id), W=htsh(id), X=tinh_trang_sd(id), Y=ngay_chuyen_tt, Z=diachi
                        jsonData.push({
                            ma_thuvien: getVal(1) ? String(getVal(1)) : '',
                            name: getVal(2) ? String(getVal(2)) : '',
                            nam_sd: Number(getVal(3)) || 0,
                            dt: Number(getVal(4)) || 0,
                            dt_phongdoc: Number(getVal(5)) || 0,
                            so_phong_doc: Number(getVal(6)) || 0,
                            soluong_maytinh: Number(getVal(7)) || 0,
                            soluong_cho_ngoi_doc_sach: Number(getVal(8)) || 0,
                            soluong_sach: Number(getVal(9)) || 0,
                            soluong_tapchi: Number(getVal(10)) || 0,
                            soluong_sach_dien_tu: Number(getVal(11)) || 0,
                            soluong_tapchi_dien_tu: Number(getVal(12)) || 0,
                            soluong_thu_vien_lien_ket_trong_nuoc: Number(getVal(13)) || 0,
                            soluong_thu_vien_dien_tu_lien_ket_nuoc_ngoai: Number(getVal(14)) || 0,
                            tinh_trang_sd: getVal(15) ? String(getVal(15)) : null,
                            htsh: getVal(16) ? String(getVal(16)) : null,
                            soluong_dau_sach: Number(getVal(17)) || 0,
                            soluong_dau_tap_chi: Number(getVal(18)) || 0,
                            soluong_dau_sach_dien_tu: Number(getVal(19)) || 0,
                            soluong_dau_tap_chi_dien_tu: Number(getVal(20)) || 0,
                            tinhtrangcsvc: getVal(21) ? String(getVal(21)) : null,
                            ngay_chuyen_tt: getVal(22) ? String(getVal(22)) : null,
                            so_dau_sach_dien_tu_co_truy_cap_truc_tuyen: Number(getVal(23)) || 0,
                            so_dau_sach_co_ban_in: Number(getVal(24)) || 0,
                            so_dau_sach_in_co_the_muon_truc_tiep: Number(getVal(25)) || 0,
                            diachi: getVal(26) ? String(getVal(26)) : '',
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
            const response = await handleCreateManyThuvien(dataImport, access_token ?? '');
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
                title="Import dữ liệu thư viện"
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
                        &nbsp;<a onClick={(e) => e.stopPropagation()} href={`${process.env.NEXT_PUBLIC_FRONTEND_URI}sample/sample-thuvien.xlsx`} download>Tải file mẫu</a>
                    </p>
                </Dragger>
                <div>
                    <Table<any>
                        scroll={{ x: 'max-content' }}
                        title={() => <span>Dữ liệu:</span>}
                        dataSource={dataImport}
                        rowKey={() => crypto.randomUUID()}
                        columns={[
                            { dataIndex: 'ma_thuvien', title: 'Mã thư viện' },
                            { dataIndex: 'name', title: 'Tên thư viện' },
                            { dataIndex: 'nam_sd', title: 'Năm sử dụng' },
                            { dataIndex: 'dt', title: 'Diện tích (m²)' },
                            { dataIndex: 'diachi', title: 'Địa chỉ' },
                        ]}
                    />
                </div>
            </Modal>
        </Context.Provider>
    );
};

export default ModalImportThuvien;
