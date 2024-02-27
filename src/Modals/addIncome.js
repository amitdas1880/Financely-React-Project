import React from 'react'
import {Button, Modal,Form,Input,DatePicker,Select} from "antd";

function AddIncomeModal({isIncomeModalVisible, handleIncomeCancel, onFinish}) {
    const [form] = Form.useForm();
  return (
    <>
    <Modal style={{fontWeight:900}} title="Add Income" visible={isIncomeModalVisible} onCancel={handleIncomeCancel} footer={null}>

      <Form form={form} layout='vertical' onFinish={(values)=>{onFinish(values,"income"); form.resetFields();}}>
            
            <Form.Item style={{fontWeight:500}} label="Name" name="name" 
                rules={[{ required:true, message:"Please write the name of the transaction!"}]}>
                        <Input type='text' className='custom-input'/>
            </Form.Item>

            <Form.Item style={{fontWeight:500}} label="Amount" name="amount" 
                rules={[{ required:true, message:"Please write the income amount!"}]}>
                        <Input type='number' className='custom-input'/>
            </Form.Item>

            <Form.Item style={{fontWeight:500}} label="Date" name="date" 
                rules={[{ required:true, message:"Please Select the income date!"}]}>
                        <DatePicker format="DD-MM-YYYY" className='custom-input'/>
            </Form.Item>

            <Form.Item style={{fontWeight:500}} label="Tag" name="tag" 
                rules={[{ required:true, message:"Please select a tag!"}]}>
                <Select className='select-input-2'>
                    <Select.Option value="Salary">Salary</Select.Option>
                    <Select.Option value="Freelancer">Freelancer</Select.Option>
                    <Select.Option value="Investment">Investment</Select.Option>
                    <Select.Option value="Income from Property">Income from Property</Select.Option>
                    <Select.Option value="Miscellaneous Income">Miscellaneous Income</Select.Option>
                </Select>
            </Form.Item>

            <Form.Item>
              <Button className='btn btn-blue' type="primary" htmlType="submit">
                Add Income
              </Button>
            </Form.Item>      

      </Form>
    </Modal>
    </>
    
)}

export default AddIncomeModal