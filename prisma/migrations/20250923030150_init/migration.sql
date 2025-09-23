-- CreateTable
CREATE TABLE "ClearingTransaction" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "acceptorAddress" TEXT NOT NULL,
    "acceptorCity" TEXT NOT NULL,
    "acceptorCountryCode" TEXT NOT NULL,
    "mcc" TEXT NOT NULL,
    "transactionType" TEXT NOT NULL,
    "cardPresent" BOOLEAN NOT NULL,
    "panLast4" TEXT NOT NULL,
    "expiryMonth" INTEGER NOT NULL,
    "expiryYear" INTEGER NOT NULL,
    "acquirerAmount" INTEGER NOT NULL,
    "acquirerCurrency" TEXT NOT NULL,
    "billingAmount" INTEGER NOT NULL,
    "billingCurrency" TEXT NOT NULL,
    "originalMsgRequest" JSONB NOT NULL,
    "originalMsgResponse" JSONB NOT NULL,
    "responseData" JSONB NOT NULL,
    "statusCode" INTEGER NOT NULL,
    "errorMessage" TEXT
);
