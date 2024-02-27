import React, { useEffect, useState } from 'react'
import Header from '../components/Header';
import Cards from "../Cards";
import AddExpenseModal from '../Modals/addExpense';
import AddIncomeModal from '../Modals/addIncome';
import TransactionsTable from '../components/TransactionsTable';

import { addDoc,collection } from 'firebase/firestore';
import {auth,db} from '../firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { toast } from 'react-toastify';
import moment from 'moment';
import { query, getDocs } from "firebase/firestore";

import ChartComponent from '../components/Charts';

function Dashboard() {
  const [user] = useAuthState(auth);
  const [transactions,setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isExpenseModalVisible, setIsExpenseModalVisible] = useState(false);
  const [isIncomeModalVisible, setIsIncomeModalVisible] = useState(false);

  const [income,setIncome]=useState();
  const [expense,setExpense]=useState();
  const [totalBalance,setTotalBalance]=useState();

  const showExpenseModal = () => {
    setIsExpenseModalVisible(true);
  };
  const showIncomeModal = () => {
    setIsIncomeModalVisible(true);
  }

  const handleExpenseCancel = () => {
    setIsExpenseModalVisible(false);
  }

  const handleIncomeCancel = () => {
    setIsIncomeModalVisible(false);
  }

  function onFinish(values,type){
      console.log("OnFinish", values , type);

      const newTransaction ={
        type: type,
        date:values.date.format("DD-MM-YYYY"),
        amount : parseFloat(values.amount),
        tag: values.tag,
        name: values.name
      };
      addTransaction(newTransaction);
  };

   async function addTransaction(transaction) {
    try{
      const docRef = await addDoc(
        collection(db, `users/${user.uid}/transactions`),
        transaction
      );
      console.log("Document written with ID: ", docRef.id);
      toast.success("Transactions added!");
      let newArr=transactions;
      newArr.push(transaction);
      setTransactions(newArr);
      calculateBalance();
    }catch(err){
      console.error("Error adding document: ", err);
      toast.error("Can't add transaction");
    }
   }

   useEffect(()=>{
    fetchTransactions();
    },[user]);

   async function fetchTransactions(){
    if(user){
      const q = query(collection(db, `users/${user.uid}/transactions`));
      const querySnapshot = await getDocs(q);
      let transactionsArray = [];
      querySnapshot.forEach((doc) => {
      transactionsArray.push(doc.data());
    });
      setTransactions(transactionsArray);
      console.log("Tranction Array : ",transactionsArray);
      toast.success("Transactions Fetched!");
    }
    setLoading(false);
   }

   useEffect(()=>{
    calculateBalance();
    },[transactions]);

   const calculateBalance = () =>{
    let incomeTotal = 0;
    let expenseTotal = 0;

    transactions.forEach((transaction) => {
      if(transaction.type === "income"){
        incomeTotal += transaction.amount;
      }else{
        expenseTotal += transaction.amount;
      }
    });
    setIncome(incomeTotal);
    setExpense(expenseTotal);
    setTotalBalance(incomeTotal-expenseTotal);
    console.log("Income Total : ",incomeTotal);
    console.log("Expense Total : ",expenseTotal);
    console.log("Total : ",totalBalance);
   }

   let sortedTransactions = transactions.sort((a,b)=>{
    return new Date(a.date)-new Date(b.date);
   })

  return (
    <div>
    <Header/>
    {loading?(<h5>Loading...</h5>):(
      <>
    <Cards
    income={income}
    expense={expense}
    totalBalance={totalBalance}
    showExpenseModal={showExpenseModal}
    showIncomeModal={showIncomeModal}
    />
    {transactions.length !== 0 ? (<ChartComponent sortedTransactions={sortedTransactions}/>) :( <></>) }
    
    
    <AddIncomeModal  isIncomeModalVisible={isIncomeModalVisible} handleIncomeCancel={handleIncomeCancel} onFinish={onFinish} />
    <AddExpenseModal isExpenseModalVisible={isExpenseModalVisible} handleExpenseCancel={handleExpenseCancel} onFinish={onFinish} />
    
    <TransactionsTable transactions={transactions} addTransaction={addTransaction} fetchTransactions={fetchTransactions}/>
    </>
    )}
    </div>
  )
}

export default Dashboard