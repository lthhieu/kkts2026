'use client'

import { Typography, Tag, Descriptions } from 'antd';
import { formatMoney } from '@/components/thietbiv2/device.detail';
import { STATUS_COLOR_MAP, STATUS_LABEL_MAP } from '@/components/chungtu/table';
import dayjs from 'dayjs';

interface IProps {
    chungtu: IChungtu | null;
}

const ChungtuDetail = ({ chungtu }: IProps) => {
    if (!chungtu) return null;

    return (
        <div >
            <Descriptions
                size="small"
                column={1}
            >
                <Descriptions.Item label="Ngày nhận CT">
                    {<Typography.Text >{chungtu?.ngaynhan ? dayjs(chungtu?.ngaynhan).format('DD/MM/YYYY') : '-'}</Typography.Text>}
                </Descriptions.Item>
                <Descriptions.Item label="Ngày hoàn thành CT" >
                    {<Typography.Text >{chungtu?.ngayhoanthanh ? dayjs(chungtu?.ngayhoanthanh).format('DD/MM/YYYY') : '-'}</Typography.Text>}
                </Descriptions.Item>
                <Descriptions.Item label="Nội dung" >
                    {chungtu.noidung}
                </Descriptions.Item>
                <Descriptions.Item label="Trạng thái">
                    {<Tag color={STATUS_COLOR_MAP[chungtu.trangthai!] || 'default'} variant='outlined'>
                        {STATUS_LABEL_MAP[chungtu.trangthai!] || chungtu.trangthai}
                    </Tag>}
                </Descriptions.Item>
                <Descriptions.Item label="Số tiền" >
                    {formatMoney(chungtu.sotien)}
                </Descriptions.Item>
                <Descriptions.Item label="Số tiền bằng chữ">
                    {chungtu.tienbangchu}
                </Descriptions.Item>
                <Descriptions.Item label="Người tạo">
                    {chungtu.user?.name ?? '-'}
                </Descriptions.Item>
                <Descriptions.Item label="Người cập nhật">
                    {chungtu.updatedBy?.name ?? '-'}
                </Descriptions.Item>
                <Descriptions.Item label="Nhà cung cấp">
                    {chungtu.ncc?.name ?? '-'}
                </Descriptions.Item>
                <Descriptions.Item label="Ghi chú">
                    {chungtu?.ghichu ?? '-'}
                </Descriptions.Item>
            </Descriptions>
        </div>

    );
};

export default ChungtuDetail;