"use client"
import { Modal, Form, message, notification, Upload, UploadProps, Table } from 'antd';
import React, { useMemo, useState } from 'react';
import { handleCreateMany } from '@/app/(main)/quan-tri/don-vi/actions';
import { InboxOutlined } from '@ant-design/icons';
// import sampleFile from '@public/sample/sample-unit.xlsx'
import * as Excel from 'exceljs';


interface IProps {
    access_token?: string,
    isModalImportOpen: boolean,
    setIsModalImportOpen: (value: boolean) => void,
}

interface IUpload {
    name: string
}

const { Dragger } = Upload;

const Context = React.createContext({ name: 'Default' });


const ModalImport = (props: IProps) => {
    const { access_token, isModalImportOpen, setIsModalImportOpen } = props
    const [messageApi, contextHolder] = message.useMessage();
    const [api, contextHolderNotification] = notification.useNotification();
    const contextValue = useMemo(() => ({ name: 'Ant Design' }), []);
    const [dataImport, setDataImport] = useState<IUpload[]>([])
    const [confirmLoading, setConfirmLoading] = useState(false);

    const uploadProps: UploadProps = {
        name: 'file',
        multiple: false,
        maxCount: 1,
        //only csv or xlsx
        beforeUpload: (file) => {
            const typeCheck = ['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'text/csv']
            const isValidate = typeCheck.some((element) => element === file.type);
            if (!isValidate) {
                message.error(`${file.name} không phải file excel hoăc csv`);
            }
            return isValidate || Upload.LIST_IGNORE;
        },

        //prevent call action
        customRequest: ({ onSuccess }) => {
            if (onSuccess) {
                onSuccess("ok");
            }
        },
        async onChange(info) {
            const { status } = info.file;
            if (status !== 'uploading') {
                console.log(info.file, info.fileList);
            }
            if (status === 'done') {
                if (info.fileList && info.fileList.length > 0) {
                    //js file fo buffer
                    const arrayBuffer = await info.file.originFileObj!.arrayBuffer()
                    //load buffer data - read
                    const workbook = new Excel.Workbook();
                    let jsonData: IUpload[] = [];
                    await workbook.xlsx.load(arrayBuffer).then(function () {
                        const worksheet = workbook.getWorksheet(1);
                        //excel to json
                        if (worksheet) {
                            // read first row as data keys
                            let firstRow = worksheet.getRow(1);
                            if (!firstRow.cellCount) return;
                            let keys = firstRow.values as Array<any>;
                            worksheet.eachRow((row, rowNumber) => {
                                if (rowNumber == 1) return;
                                let values = row.values as Array<any>
                                let obj: any = {};
                                for (let i = 1; i < keys.length; i++) {
                                    obj[keys[i]] = values[i];
                                }
                                jsonData.push(obj);
                            })
                        }

                    });
                    setDataImport(jsonData)
                }
                message.success(`${info.file.name} tải lên thành công`);
            } else if (status === 'error') {
                message.error(`${info.file.name} tải lên thất bại`);
            }
        },
        onDrop(e) {
            console.log('Dropped files', e.dataTransfer.files);
        },
    };

    const handleOk = () => {
        setConfirmLoading(true);
        setTimeout(async () => {
            const response = await handleCreateMany(dataImport, access_token ?? '')

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
            setConfirmLoading(false);
        }, 2000)
    };

    const handleCancel = () => {
        setDataImport([])
        setIsModalImportOpen(false);
    };

    return (
        <Context.Provider value={contextValue}>
            {contextHolder}{contextHolderNotification}
            <Modal
                title={"Import dữ liệu"}
                closable={{ 'aria-label': 'Custom Close Button' }}
                open={isModalImportOpen}
                onOk={handleOk}
                okText={"Import"}
                cancelText={"Hủy"}
                onCancel={handleCancel}
                okButtonProps={{ disabled: dataImport.length !== 0 ? false : true }}
                confirmLoading={confirmLoading}
                width={{
                    xs: '90%',
                    sm: '80%',
                    md: '70%',
                    lg: '60%',
                    xl: '50%',
                    xxl: '40%',
                }}
                maskClosable={false}
            >
                <Dragger {...uploadProps}>
                    <p className="ant-upload-drag-icon">
                        <InboxOutlined />
                    </p>
                    <p className="ant-upload-text">Chọn hoặc kéo thẻ file để tải dữ liệu</p>
                    <p className="ant-upload-hint">
                        Chỉ hỗ trợ file excel và csv
                        &nbsp;<a onClick={(e) => e.stopPropagation()} href={`${process.env.NEXT_PUBLIC_FRONTEND_URI}sample/sample-unit.xlsx`} download>Tải file mẫu</a>
                    </p>
                </Dragger>
                <div>
                    <Table<IUpload>
                        title={() => <span>Dữ liệu:</span>}
                        dataSource={dataImport} rowKey={'name'}
                        columns={[
                            { dataIndex: 'name', title: 'Tên đơn vị' }
                        ]} />
                </div>
            </Modal>
        </Context.Provider>
    );
};

export default ModalImport;