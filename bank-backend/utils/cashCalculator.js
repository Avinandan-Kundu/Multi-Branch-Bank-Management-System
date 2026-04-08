function calculateCash(employeeCount, transactions){ 

    const baseReserve = 50000; 
    const employeeFactor = 5000; 
    const transactionFactor = 10; 


    return ( 
        baseReserve + (employeeCount * employeeFactor) + (transactions * transactionFactor) 
    
    );
} 

module.exports = calculateCash;