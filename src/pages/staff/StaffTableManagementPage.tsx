import React, { useEffect, useState } from 'react';
import { Table, Tag, Card, message, Typography } from 'antd';
import { CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
import * as tableService from '../../services/restaurant-table.service';
import type { RestaurantTable, TableStatus } from '../../types/RestaurantTable';

const { Title } = Typography;

const StaffTableManagementPage: React.FC = () => {
    const [tables, setTables] = useState<RestaurantTable[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchTables();
    }, []);

    const fetchTables = async () => {
        setLoading(true);
        try {
            const data = await tableService.getAllTables();
            // Sort by table number
            const sortedData = data.sort((a, b) => a.tableNumber - b.tableNumber);
            setTables(sortedData);
        } catch {
            message.error('Không thể tải danh sách bàn');
        } finally {
            setLoading(false);
        }
    };

    const getStatusColor = (status: TableStatus): string => {
        const colors: Record<TableStatus, string> = {
            Available: 'green',
            Occupied: 'red',
            Reserved: 'orange',
        };
        return colors[status] || 'default';
    };

    const getStatusText = (status: TableStatus): string => {
        const texts: Record<TableStatus, string> = {
            Available: 'Trống',
            Occupied: 'Đang sử dụng',
            Reserved: 'Đã đặt',
        };
        return texts[status] || status;
    };

    const columns = [
        {
            title: 'Số bàn',
            dataIndex: 'tableNumber',
            key: 'tableNumber',
            width: 100,
            render: (tableNumber: number) => (
                <div className="text-center">
                    <div
                        style={{
                            fontSize: '24px',
                            fontWeight: 'bold',
                            color: '#1890ff',
                        }}
                    >
                        {tableNumber}
                    </div>
                </div>
            ),
        },
        {
            title: 'Sức chứa',
            dataIndex: 'seats',
            key: 'seats',
            width: 120,
            render: (seats: number) => (
                <span>
                    {seats} người
                </span>
            ),
        },
        {
            title: 'Vị trí',
            dataIndex: 'location',
            key: 'location',
            render: (location: string) => location || 'N/A',
        },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            key: 'status',
            width: 150,
            render: (status: TableStatus) => (
                <Tag
                    color={getStatusColor(status)}
                    icon={status === 'Available' ? <CheckCircleOutlined /> : <CloseCircleOutlined />}
                    style={{ fontSize: '14px', padding: '4px 12px' }}
                >
                    {getStatusText(status)}
                </Tag>
            ),
            filters: [
                { text: 'Trống', value: 'Available' },
                { text: 'Đang sử dụng', value: 'Occupied' },
                { text: 'Đã đặt', value: 'Reserved' },
            ],
            onFilter: (value: React.Key | boolean, record: RestaurantTable) => record.status === value,
        },
    ];

    // Summary statistics
    const availableCount = tables.filter((t) => t.status === 'Available').length;
    const occupiedCount = tables.filter((t) => t.status === 'Occupied').length;
    const totalCapacity = tables.reduce((sum, t) => sum + t.seats, 0);

    return (
        <div className="p-6">
            <Title level={2}>Quản Lý Bàn</Title>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <Card>
                    <div className="text-center">
                        <div className="text-3xl font-bold text-blue-600">{tables.length}</div>
                        <div className="text-gray-600 mt-1">Tổng số bàn</div>
                    </div>
                </Card>
                <Card>
                    <div className="text-center">
                        <div className="text-3xl font-bold text-green-600">{availableCount}</div>
                        <div className="text-gray-600 mt-1">Bàn trống</div>
                    </div>
                </Card>
                <Card>
                    <div className="text-center">
                        <div className="text-3xl font-bold text-red-600">{occupiedCount}</div>
                        <div className="text-gray-600 mt-1">Đang sử dụng</div>
                    </div>
                </Card>
                <Card>
                    <div className="text-center">
                        <div className="text-3xl font-bold text-purple-600">{totalCapacity}</div>
                        <div className="text-gray-600 mt-1">Tổng sức chứa</div>
                    </div>
                </Card>
            </div>

            {/* Table List */}
            <Card>
                <Table
                    columns={columns}
                    dataSource={tables}
                    rowKey="id"
                    loading={loading}
                    pagination={{
                        pageSize: 10,
                        showSizeChanger: true,
                        showTotal: (total) => `Tổng ${total} bàn`,
                    }}
                    rowClassName={(record) => (record.status === 'Occupied' ? 'bg-red-50' : '')}
                />
            </Card>
        </div>
    );
};

export default StaffTableManagementPage;
