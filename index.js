// Import CSS
// =====================================
// 2. SAMPLE ACCOUNTS
// =====================================
var currentAccount = {
    accountNumber: "CUR001",
    holderName: "Morgan",
    balancePaise: 5000000,
    type: "Current",
    overdraftLimitPaise: 1000000,
    overdraftInterestRate: 8,
    monthlyMaintenanceFeePaise: 5000,
    minimumDailyBalancePaise: 100000,
    companyRegistrationNumber: "COMP001"
};
var savingAccount = {
    accountNumber: "SAV001",
    holderName: "Alex",
    balancePaise: 1000000,
    type: "Saving",
    interestRate: 4,
    interestPayoutFrequency: "monthly",
    monthlyWithdrawalLimit: 5,
    excessTransactionFeePaise: 1000,
    minimumBalancePaise: 100000
};
var studentAccount = {
    accountNumber: "STU001",
    holderName: "Sam",
    balancePaise: 300000,
    type: "Student",
    institutionName: "ABC College",
    studentCardNumber: "STU-CARD-001",
    graduationDate: "2027-06-30",
    dailyWithdrawalCapPaise: 500000,
    withdrawnTodayPaise: 0,
    perksFlag: true
};
// =====================================
// 3. ACCOUNT STORAGE
// =====================================
var accounts = [];
function addAccount(account) {
    var accountExists = accounts.some(function (acc) { return acc.accountNumber === account.accountNumber; });
    if (accountExists) {
        console.log("Account already exists!");
        return;
    }
    accounts.push(account);
    console.log("Account created successfully!");
}
function findAccount(accountNumber) {
    return accounts.find(function (acc) { return acc.accountNumber === accountNumber; });
}
// =====================================
// 4. DEPOSIT FUNCTION
// =====================================
function deposit(accountNumber, amountPaise) {
    var account = findAccount(accountNumber);
    if (!account) {
        console.log("Account not found!");
        return;
    }
    if (!Number.isSafeInteger(amountPaise) || amountPaise <= 0) {
        console.log("Invalid deposit amount!");
        return;
    }
    account.balancePaise += amountPaise;
    console.log("Deposit successful!");
    console.log("Updated balance: ₹", account.balancePaise / 100);
}
// =====================================
// 5. WITHDRAW FUNCTION
// =====================================
function withdraw(accountNumber, amountPaise) {
    var account = findAccount(accountNumber);
    if (!account) {
        console.log("Account not found!");
        return;
    }
    if (!Number.isSafeInteger(amountPaise) || amountPaise <= 0) {
        console.log("Invalid withdrawal amount!");
        return;
    }
    switch (account.type) {
        // SAVING ACCOUNT
        case "Saving": {
            var remainingBalance = account.balancePaise - amountPaise;
            if (remainingBalance < account.minimumBalancePaise) {
                console.log("Minimum balance requirement violated!");
                return;
            }
            account.balancePaise = remainingBalance;
            console.log("Saving withdrawal successful!");
            break;
        }
        // CURRENT ACCOUNT
        case "Current": {
            var availableBalance = account.balancePaise + account.overdraftLimitPaise;
            if (amountPaise > availableBalance) {
                console.log("Overdraft limit exceeded!");
                return;
            }
            account.balancePaise -= amountPaise;
            console.log("Current withdrawal successful!");
            break;
        }
        // STUDENT ACCOUNT
        case "Student": {
            var remainingDailyLimit = account.dailyWithdrawalCapPaise -
                account.withdrawnTodayPaise;
            if (amountPaise > account.balancePaise) {
                console.log("Insufficient balance!");
                return;
            }
            if (amountPaise > remainingDailyLimit) {
                console.log("Daily withdrawal limit exceeded!");
                return;
            }
            account.balancePaise -= amountPaise;
            account.withdrawnTodayPaise += amountPaise;
            console.log("Student withdrawal successful!");
            break;
        }
    }
    console.log("Updated balance: ₹", account.balancePaise / 100);
}
// =====================================
// 6. DISPLAY BALANCE
// =====================================
function getBalance(accountNumber) {
    var account = findAccount(accountNumber);
    if (!account) {
        console.log("Account not found!");
        return;
    }
    console.log("Account holder:", account.holderName);
    console.log("Account type:", account.type);
    console.log("Balance: ₹", account.balancePaise / 100);
}
// =====================================
// PHASE 4 — MONEY TRANSFER
// =====================================
function transfer(senderAccountNumber, receiverAccountNumber, amountPaise) {
    // 1. Find sender and receiver
    var sender = findAccount(senderAccountNumber);
    var receiver = findAccount(receiverAccountNumber);
    if (!sender || !receiver) {
        console.log("Sender or receiver account not found!");
        return;
    }
    // 2. Prevent transfer to the same account
    if (sender.accountNumber === receiver.accountNumber) {
        console.log("Cannot transfer to the same account!");
        return;
    }
    // 3. Validate transfer amount
    if (!Number.isSafeInteger(amountPaise) || amountPaise <= 0) {
        console.log("Invalid transfer amount!");
        return;
    }
    // 4. Validate receiver's resulting balance
    var receiverNewBalance = receiver.balancePaise + amountPaise;
    if (!Number.isSafeInteger(receiverNewBalance)) {
        console.log("Receiver balance would exceed the safe limit!");
        return;
    }
    // 5. Check sender's withdrawal rules
    switch (sender.type) {
        case "Saving": {
            var remainingBalance = sender.balancePaise - amountPaise;
            if (remainingBalance < sender.minimumBalancePaise) {
                console.log("Savings minimum balance violation!");
                return;
            }
            break;
        }
        case "Current": {
            var availableBalance = sender.balancePaise + sender.overdraftLimitPaise;
            if (amountPaise > availableBalance) {
                console.log("Current account overdraft limit exceeded!");
                return;
            }
            break;
        }
        case "Student": {
            var remainingDailyLimit = sender.dailyWithdrawalCapPaise -
                sender.withdrawnTodayPaise;
            if (amountPaise > sender.balancePaise) {
                console.log("Insufficient student account balance!");
                return;
            }
            if (amountPaise > remainingDailyLimit) {
                console.log("Student daily transfer limit exceeded!");
                return;
            }
            break;
        }
    }
    // 6. All validations passed.
    // Now update BOTH accounts.
    sender.balancePaise -= amountPaise;
    receiver.balancePaise = receiverNewBalance;
    // 7. Update student's daily withdrawal tracker
    if (sender.type === "Student") {
        sender.withdrawnTodayPaise += amountPaise;
    }
    console.log("Transfer successful!");
    console.log("Amount transferred: ₹", amountPaise / 100);
    console.log("Sender new balance: ₹", sender.balancePaise / 100);
    console.log("Receiver new balance: ₹", receiver.balancePaise / 100);
}
// =====================================
// TESTING
// =====================================
transfer("SAV001", "CUR001", 200000);
transfer("CUR001", "STU001", 500000);
transfer("STU001", "SAV001", 600000);
// Check balances after transfers
getBalance("SAV001");
getBalance("CUR001");
getBalance("STU001");
// =====================================
// 7. TESTING
// =====================================
addAccount(currentAccount);
addAccount(savingAccount);
addAccount(studentAccount);
// Deposits
deposit("SAV001", 200000);
deposit("UNKNOWN", 50000);
// Withdrawals
withdraw("SAV001", 950000);
withdraw("CUR001", 5500000);
withdraw("STU001", 400000);
withdraw("STU001", 200000);
// Check balances
getBalance("CUR001");
getBalance("SAV001");
getBalance("STU001");
var depositBtn = document.querySelector("#depositBtn");
var withdrawBtn = document.querySelector("#withdrawBtn");
var transferBtn = document.querySelector("#transferBtn");
var message = document.querySelector("#message");
var accountList = document.querySelector("#accountList");
// Convert rupees into paise
function toPaise(amount) {
    return Math.round(amount * 100);
}
// Render account details
function renderAccounts() {
    accountList.replaceChildren();
    accounts.forEach(function (account) {
        var item = document.createElement("p");
        item.textContent =
            "".concat(account.holderName, " | ").concat(account.accountNumber, " | ") +
                "\u20B9".concat((account.balancePaise / 100).toFixed(2), " | ").concat(account.type);
        accountList.appendChild(item);
    });
}
// Deposit button
depositBtn.addEventListener("click", function () {
    var accountNumber = document.querySelector("#depositAccount").value;
    var amount = Number(document.querySelector("#depositAmount").value);
    if (!Number.isFinite(amount) || amount <= 0) {
        message.textContent = "Enter a valid deposit amount.";
        return;
    }
    deposit(accountNumber, toPaise(amount));
    message.textContent = "Deposit request processed. Check console for validation details.";
    renderAccounts();
});
// Withdraw button
withdrawBtn.addEventListener("click", function () {
    var accountNumber = document.querySelector("#withdrawAccount").value;
    var amount = Number(document.querySelector("#withdrawAmount").value);
    if (!Number.isFinite(amount) || amount <= 0) {
        message.textContent = "Enter a valid withdrawal amount.";
        return;
    }
    withdraw(accountNumber, toPaise(amount));
    message.textContent = "Withdrawal request processed. Check console for validation details.";
    renderAccounts();
});
// Transfer button
transferBtn.addEventListener("click", function () {
    var sender = document.querySelector("#senderAccount").value;
    var receiver = document.querySelector("#receiverAccount").value;
    var amount = Number(document.querySelector("#transferAmount").value);
    if (!Number.isFinite(amount) || amount <= 0) {
        message.textContent = "Enter a valid transfer amount.";
        return;
    }
    transfer(sender, receiver, toPaise(amount));
    message.textContent = "Transfer request processed. Check console for validation details.";
    renderAccounts();
});
// Add sample accounts once
// Initial display
renderAccounts();
