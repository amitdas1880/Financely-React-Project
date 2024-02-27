import React from 'react'
import { Line, Pie } from '@ant-design/charts';

function ChartComponent({sortedTransactions}) {
    
      //Line Chart
      const data =sortedTransactions.map((item)=>{
          return {
            Date: item.date,
            Value: item.amount,
          }
        })
    
      const config = {
        data,
        height: 400,
        xField: 'Date',
        yField: 'Value',
        autofit:true,
        point: {
          size: 5,
          shape: 'diamond',
        }};

      // Pie Chart
      let spendingData = sortedTransactions.filter((item)=>{
        if(item.type == "expense"){
          return {tag:item.tag, amount:item.amount};
        }
      });

      let finalSpendings = spendingData.reduce((acc, obj)=>{
        let key = obj.tag;
        if(!acc[key]){
          acc[key] = {tag:obj.tag, amount:obj.amount};
        }else{
          acc[key].amount += obj.amount;
        }
        return acc;
      },{});
      


        const spendingconfig = {
          data:Object.values(finalSpendings),
          height: 400,
          angleField: "amount",
          colorField: "tag",
          autofit:true,
          };
     

        return (
         <>
            <div className='chart-component'>
                  <div>
                      <h2>Your Analytics</h2>
                          <div className='charts-wrapper'>
                              <Line {...config}  />
                          </div>
                      </div>
                      
                      <div>
                      <h2>Your Spendings</h2>
                          <div className='charts-wrapper'>
                              <Pie  {...spendingconfig}  />
                          </div>
                      </div>
            </div>  
        </>
  )
}

export default ChartComponent