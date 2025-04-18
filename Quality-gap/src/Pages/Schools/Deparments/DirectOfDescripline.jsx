import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, Input, Button, Modal, Form, Select, message, Tag, Descriptions } from 'antd';
import { SearchOutlined, ExclamationCircleOutlined, HistoryOutlined } from '@ant-design/icons';
import moment from 'moment';

const { Option } = Select;
const { confirm } = Modal;

const DirectorOfDiscipline = () => {
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [form] = Form.useForm();
  const [visible, setVisible] = useState(false);
  const [schoolName, setSchoolName] = useState('');
  const [disciplineHistory, setDisciplineHistory] = useState([]);
  const [historyModalVisible, setHistoryModalVisible] = useState(false);
  const [historyLoading, setHistoryLoading] = useState(false);
  
  const token = localStorage.getItem('token');
  
  const [reasons, setReasons] = useState([
    'Late coming',
    'Improper uniform',
    'Disruptive behavior',
    'Bullying',
    'Cheating',
    'Other'
  ]);

  useEffect(() => {
    const storedSchoolData = JSON.parse(localStorage.getItem('schoolData'));
    if (storedSchoolData && storedSchoolData.name) {
      setSchoolName(storedSchoolData.name);
    }
  }, []);

  useEffect(() => {
    if (schoolName) {
      fetchStudents();
    }
  }, [schoolName]);

  const fetchStudents = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `http://127.0.0.1:8000/api/schools/${schoolName}/students/`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      let rawStudents = [];
      if (Array.isArray(response.data.students)) {
        rawStudents = response.data.students;
      } else if (Array.isArray(response.data)) {
        rawStudents = response.data;
      }

      const data = rawStudents.map((student) => ({
        id: student.id,
        studentNumber: student.studentNumber,
        name: `${student.firstName} ${student.lastName}`,
        class: student.class_name?.name || 'N/A',
        disciplineMarks: student.disciplineMarks ?? 40,
      }));

      setStudents(data);
      setFilteredStudents(data);
    } catch (error) {
      console.error("Failed to fetch students", error);
      message.error('Failed to fetch students');
      setStudents([]);
      setFilteredStudents([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchDisciplineHistory = async (studentId) => {
    setHistoryLoading(true);
    try {
      const { data } = await axios.get(
        `http://127.0.0.1:8000/api/schools/${encodeURIComponent(schoolName)}/students/${studentId}/deduct-history/`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
  
      // data is already an array of records
      setDisciplineHistory(data);
    } catch (error) {
      console.error("Failed to fetch discipline history", error);
      message.error('Failed to load discipline history');
    } finally {
      setHistoryLoading(false);
    }
  };
  

  const handleSearch = (value) => {
    setSearchText(value);
    if (value === '') {
      setFilteredStudents(students);
    } else {
      const filtered = students.filter(student =>
        student.name.toLowerCase().includes(value.toLowerCase()) ||
        student.id.toString().includes(value) ||
        student.class.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredStudents(filtered);
    }
  };

  const showDeductionModal = (student) => {
    setSelectedStudent(student);
    form.resetFields();
    setVisible(true);
  };

  const showConfirm = (student) => {
    confirm({
      title: 'Confirm Mark Deduction',
      icon: <ExclamationCircleOutlined />,
      content: `Are you sure you want to deduct marks from ${student.name}?`,
      onOk() {
        showDeductionModal(student);
      },
    });
  };

  const handleDeduction = async (values) => {
    try {
      const response = await axios.post(
        `http://127.0.0.1:8000/api/schools/${encodeURIComponent(schoolName)}/students/${selectedStudent.id}/deduct-marks/`,
        {
          deductionAmount: values.deductionAmount,
          reason: values.reason,
          remarks: values.remarks,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
  
      message.success(response.data.success);
  
      // Update the student marks
      setStudents(students.map(s =>
        s.id === selectedStudent.id
          ? { ...s, disciplineMarks: response.data.remainingMarks }
          : s
      ));
  
      setFilteredStudents(filteredStudents.map(s =>
        s.id === selectedStudent.id
          ? { ...s, disciplineMarks: response.data.remainingMarks }
          : s
      ));
  
      setVisible(false);
    } catch (err) {
      console.error('Deduction error:', err);
      const errorMsg = err.response?.data?.error ||
        err.message ||
        'Failed to deduct marks';
      message.error(errorMsg);
    }
  };
  

  const showHistory = (student) => {
    setSelectedStudent(student);
    fetchDisciplineHistory(student.id);
    setHistoryModalVisible(true);
  };

  const columns = [
    {
      title: 'Student ID',
      dataIndex: 'id',
      key: 'id',
      sorter: (a, b) => a.id - b.id,
    },
    {
      title: 'Student Number',
      dataIndex: 'studentNumber',
      key: 'studentNumber',
      sorter: (a, b) => a.studentNumber - b.studentNumber,
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: 'Class',
      dataIndex: 'class',
      key: 'class',
      sorter: (a, b) => a.class.localeCompare(b.class),
    },
    {
      title: 'Current Marks',
      dataIndex: 'disciplineMarks',
      key: 'disciplineMarks',
      render: marks => (
        <Tag color={
          marks < 50 ? 'red' : 
          marks < 70 ? 'orange' : 
          'green'
        }>
          {marks}
        </Tag>
      ),
      sorter: (a, b) => a.disciplineMarks - b.disciplineMarks,
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <div className="flex gap-2">
          <Button 
            type="primary" 
            danger 
            onClick={() => showConfirm(record)}
            size="small"
          >
            Remove Marks
          </Button>
          <Button 
            icon={<HistoryOutlined />} 
            onClick={() => showHistory(record)}
            size="small"
          >
            History
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="p-6">
      <div className="mb-5">
        <h1 className="text-2xl font-semibold mb-1">Discipline Marks Management</h1>
        <p className="text-gray-600">Manage student discipline marks and deductions</p>
      </div>

      <div className="mb-5">
        <Input
          placeholder="Search students by name, ID or class"
          prefix={<SearchOutlined />}
          value={searchText}
          onChange={(e) => handleSearch(e.target.value)}
          allowClear
          className="w-full max-w-xl"
        />
      </div>

      <div className="bg-white p-6 rounded-xl shadow">
        <Table
          columns={columns}
          dataSource={filteredStudents}
          loading={loading}
          rowKey="id"
          pagination={{ pageSize: 10, showSizeChanger: true }}
          scroll={{ x: true }}
        />
      </div>

      {/* Deduction Modal */}
      <Modal
        title={`Deduct Marks - ${selectedStudent?.name || ''}`}
        open={visible}
        onCancel={() => setVisible(false)}
        footer={null}
        destroyOnClose
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleDeduction}
          initialValues={{
            deductionAmount: 1,
            reason: reasons[0],
          }}
        >
          <Descriptions bordered size="small" column={1}>
            <Descriptions.Item label="Current Marks">
              <Tag color={
                selectedStudent?.disciplineMarks < 50 ? 'red' : 
                selectedStudent?.disciplineMarks < 70 ? 'orange' : 
                'green'
              }>
                {selectedStudent?.disciplineMarks || 100}
              </Tag>
            </Descriptions.Item>
          </Descriptions>

          <Form.Item
  name="deductionAmount"
  label="Marks to Deduct"
  rules={[
    { required: true, message: 'Please enter deduction amount' },
    {
      validator: (_, value) => {
        const numericValue = Number(value);
        if (!value || isNaN(numericValue)) {
          return Promise.reject('Please enter a valid number');
        }
        if (numericValue < 1 || numericValue > selectedStudent?.disciplineMarks) {
          return Promise.reject(`Value must be between 1 and ${selectedStudent?.disciplineMarks}`);
        }
        return Promise.resolve();
      }
    }
  ]}
>
  <Input
    type="number"
    min={1}
    max={selectedStudent?.disciplineMarks || 100}
  />
</Form.Item>



          <Form.Item
            name="reason"
            label="Reason for Deduction"
            rules={[{ required: true, message: 'Please select a reason' }]}
          >
            <Select placeholder="Select reason">
              {reasons.map(reason => (
                <Option key={reason} value={reason}>{reason}</Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item 
            name="remarks" 
            label="Additional Remarks"
            rules={[{ max: 500, message: 'Remarks should not exceed 500 characters' }]}
          >
            <Input.TextArea rows={3} placeholder="Optional details about the incident" />
          </Form.Item>

          <Form.Item>
            <div className="flex justify-end gap-4">
              <Button onClick={() => setVisible(false)}>
                Cancel
              </Button>
              <Button type="primary" htmlType="submit">
                Confirm Deduction
              </Button>
            </div>
          </Form.Item>
        </Form>
      </Modal>

      {/* History Modal */}
      <Modal
        title={`Discipline History - ${selectedStudent?.name || ''}`}
        open={historyModalVisible}
        onCancel={() => setHistoryModalVisible(false)}
        footer={null}
        width={800}
      >
        <Table
          columns={[
            {
              title: 'Date',
              dataIndex: 'date',
              key: 'date',
              render: date => moment(date).format('LLL'),
              sorter: (a, b) => new Date(a.date) - new Date(b.date),
              defaultSortOrder: 'descend',
            },
            {
              title: 'Deduction',
              dataIndex: 'deduction_amount',
              key: 'deduction',
              render: amount => <Tag color="red">-{amount}</Tag>,
              sorter: (a, b) => a.deduction_amount - b.deduction_amount,
            },
            {
              title: 'Reason',
              dataIndex: 'reason',
              key: 'reason',
              filters: reasons.map(r => ({ text: r, value: r })),
              onFilter: (value, record) => record.reason === value,
            },
            {
              title: 'Remarks',
              dataIndex: 'remarks',
              key: 'remarks',
              ellipsis: true,
            },
            {
              title: 'recorded_by',
              dataIndex: 'recorded_by',
              key: 'recorded_by',
            },
          ]}
          dataSource={disciplineHistory}
          rowKey="id"
          loading={historyLoading}
          pagination={{ pageSize: 5 }}
          scroll={{ x: true }}
        />
      </Modal>
    </div>
  );
};

export default DirectorOfDiscipline;