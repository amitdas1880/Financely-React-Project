import React, { useState } from 'react'
import { Table , Select , Radio} from 'antd';
import { parse , unparse } from "papaparse";
import { toast } from 'react-toastify';
import { HiMagnifyingGlass } from "react-icons/hi2";
const { Option } = Select;

function TransactionsTable({transactions, addTransaction, fetchTransactions}) {

  const [typeFilter, setTypeFilter]=useState("");
  const [search, setSearch]=useState("");
  const [sortKey, setSortKey]=useState("");
  const columns = [
        {
          title: 'Name',
          dataIndex: 'name',
          key: 'name',
        },
        {
            title: 'Type',
            dataIndex: 'type',
            key: 'type',
        },
        {
          title: 'Amount',
          dataIndex: 'amount',
          key: 'amount',
        },
        {
          title: 'Tag',
          dataIndex: 'tag',
          key: 'tag',
        },
        {
            title: 'Date',
            dataIndex: 'date',
            key: 'date',
        },
      ];
      
      let filteredTranslations = transactions.filter((Item)=>Item.name.toLowerCase().includes(search.toLowerCase()) && Item.type.includes(typeFilter));

      let sortedTranslations = filteredTranslations.sort((a,b)=>{
        if(sortKey === "date"){
          return new Date(a.date)-new Date(b.date);
        }else if (sortKey === "amount"){
          return a.amount-b.amount;
        }else{
          return 0;
        }
      });

      function export_csv(){
        var csv = unparse({
      	"fields": ["name", "type", "tag", "date", "amount"],
        transactions,
        });
        const blob = new Blob([csv], {type: 'text/csv;charset=utf8;'});
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'transactions.csv';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    function importFromCsv(event){
      event.preventDefault();
      try{
        parse(event.target.files[0],{
          header: true,
          complete: async function(results) {
            console.log(results);
            for(const transaction of results.data){
              console.log(transaction);
              const newTransaction ={
                ...transaction,
                amount:parseFloat(transaction.amount),
              };
              await addTransaction(newTransaction)
            }
          },
        })
        toast.success("All transaction added successfully");
        fetchTransactions();
        event.target.files = null;
      }catch(e){
          toast.error(e.message)
      }
      
    }

    return (
    <>
    <div className='search-Item'>
    <div className='input-flex'>
      {/* <img src={1} width="16"/> */}
      <HiMagnifyingGlass />
      <input value={search} onChange={(e)=>setSearch(e.target.value)} placeholder='Search By Name'/>
    </div>

    <Select
      className="select-input"
      onChange={(value)=>setTypeFilter(value)}
      value={typeFilter}
      placeholder="Filter"
      allowClear
    >
      <Option value="">All</Option>
      <Option value="income">Income</Option>
      <Option value="expense">Expenses</Option>
    </Select>
    </div>

    <div style={{display:"flex", alignItems:"center", justifyContent:"space-between", padding:"0px 20px"}}>
      <div><h2>My All Transactions</h2></div>
      <div>
      <Radio.Group 
        className='input-radio'
        value={sortKey}
        onChange={(e)=> setSortKey(e.target.value)} 
        >
          <Radio.Button value="">No Sort</Radio.Button>
          <Radio.Button value="date">Sort by Date</Radio.Button>
          <Radio.Button value="amount">Sort by Amount</Radio.Button>
        </Radio.Group>
      </div>

      <div style={{display:"flex", alignItems:"center", gap:"10px"}}>
        <button className='btn' onClick={export_csv}>Export to CSV</button>
        <label for="file-csv" className='btn btn-blue'>Import from CSV</label>
        <input id="file-csv" type="file" accept='.csv' required style={{display:"none"}} onChange={importFromCsv}/>
      </div>
      </div>
    <Table dataSource={sortedTranslations} columns={columns} />;
    </>);
      

}

export default TransactionsTable