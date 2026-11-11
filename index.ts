
// Import CSS
// Get HTML elements

// =====================================
// 1. ACCOUNT TYPES
// =====================================

type BaseAccount = {
    accountNumber: string;
    holderName: string;
    balancePaise: number;
};

type Current = BaseAccount & {
    type: "Current";
    overdraftLimitPaise: number;
    overdraftInterestRate: number;
    monthlyMaintenanceFeePaise: number;
    minimumDailyBalancePaise: number;
    companyRegistrationNumber: string;
};

type Saving = BaseAccount & {
    type: "Saving";
    interestRate: number;
    interestPayoutFrequency: "monthly" | "quarterly" | "annually";
    monthlyWithdrawalLimit: number;
    excessTransactionFeePaise: number;
    minimumBalancePaise: number;
};

type Student = BaseAccount & {
    type: "Student";
    institutionName: string;
    studentCardNumber: string;
    graduationDate: string;
    dailyWithdrawalCapPaise: number;
    withdrawnTodayPaise: number;
    perksFlag: boolean;
};

type AccountType = Current | Saving | Student;


// =====================================
// 2. SAMPLE ACCOUNTS
// =====================================

const currentAccount: Current = {
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

const savingAccount: Saving = {
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

const studentAccount: Student = {
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

let accounts: AccountType[] = [];

function addAccount(account: AccountType): void {
    const accountExists = accounts.some(
        acc => acc.accountNumber === account.accountNumber
    );

    if (accountExists) {
        console.log("Account already exists!");
        return;
    }

    accounts.push(account);
    console.log("Account created successfully!");
}

function findAccount(accountNumber: string): AccountType | undefined {
    return accounts.find(
        acc => acc.accountNumber === accountNumber
    );
}


// =====================================
// 4. DEPOSIT FUNCTION
// =====================================

function deposit(
    accountNumber: string,
    amountPaise: number
): void {

    const account = findAccount(accountNumber);

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

function withdraw(
    accountNumber: string,
    amountPaise: number
): void {

    const account = findAccount(accountNumber);

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

            const remainingBalance =
                account.balancePaise - amountPaise;

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

            const availableBalance =
                account.balancePaise + account.overdraftLimitPaise;

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

            const remainingDailyLimit =
                account.dailyWithdrawalCapPaise -
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

function getBalance(accountNumber: string): void {

    const account = findAccount(accountNumber);

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

function transfer(
    senderAccountNumber: string,
    receiverAccountNumber: string,
    amountPaise: number
): void {

    // 1. Find sender and receiver
    const sender = findAccount(senderAccountNumber);
    const receiver = findAccount(receiverAccountNumber);

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
    const receiverNewBalance = receiver.balancePaise + amountPaise;

    if (!Number.isSafeInteger(receiverNewBalance)) {
        console.log("Receiver balance would exceed the safe limit!");
        return;
    }

    // 5. Check sender's withdrawal rules
    switch (sender.type) {

        case "Saving": {
            const remainingBalance =
                sender.balancePaise - amountPaise;

            if (remainingBalance < sender.minimumBalancePaise) {
                console.log("Savings minimum balance violation!");
                return;
            }
            break;
        }

        case "Current": {
            const availableBalance =
                sender.balancePaise + sender.overdraftLimitPaise;

            if (amountPaise > availableBalance) {
                console.log("Current account overdraft limit exceeded!");
                return;
            }
            break;
        }

        case "Student": {
            const remainingDailyLimit =
                sender.dailyWithdrawalCapPaise -
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

const depositBtn = document.querySelector<HTMLButtonElement>("#depositBtn")!;
const withdrawBtn = document.querySelector<HTMLButtonElement>("#withdrawBtn")!;
const transferBtn = document.querySelector<HTMLButtonElement>("#transferBtn")!;

const message = document.querySelector<HTMLParagraphElement>("#message")!;
const accountList = document.querySelector<HTMLDivElement>("#accountList")!;

// Convert rupees into paise
function toPaise(amount: number): number {
    return Math.round(amount * 100);
}

// Render account details
function renderAccounts(): void {
    accountList.replaceChildren();

    accounts.forEach(account => {
        const item = document.createElement("p");

        item.textContent =
            `${account.holderName} | ${account.accountNumber} | ` +
            `₹${(account.balancePaise / 100).toFixed(2)} | ${account.type}`;

        accountList.appendChild(item);
    });
}

// Deposit button
depositBtn.addEventListener("click", () => {

    const accountNumber =
        document.querySelector<HTMLInputElement>("#depositAccount")!.value;

    const amount =
        Number(document.querySelector<HTMLInputElement>("#depositAmount")!.value);

    if (!Number.isFinite(amount) || amount <= 0) {
        message.textContent = "Enter a valid deposit amount.";
        return;
    }

    deposit(accountNumber, toPaise(amount));

    message.textContent = "Deposit request processed. Check console for validation details.";

    renderAccounts();
});

// Withdraw button
withdrawBtn.addEventListener("click", () => {

    const accountNumber =
        document.querySelector<HTMLInputElement>("#withdrawAccount")!.value;

    const amount =
        Number(document.querySelector<HTMLInputElement>("#withdrawAmount")!.value);

    if (!Number.isFinite(amount) || amount <= 0) {
        message.textContent = "Enter a valid withdrawal amount.";
        return;
    }

    withdraw(accountNumber, toPaise(amount));

    message.textContent = "Withdrawal request processed. Check console for validation details.";

    renderAccounts();
});

// Transfer button
transferBtn.addEventListener("click", () => {

    const sender =
        document.querySelector<HTMLInputElement>("#senderAccount")!.value;

    const receiver =
        document.querySelector<HTMLInputElement>("#receiverAccount")!.value;

    const amount =
        Number(document.querySelector<HTMLInputElement>("#transferAmount")!.value);

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
