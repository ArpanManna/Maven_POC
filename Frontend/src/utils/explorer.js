const baseUrl = "https://mumbai.polygonscan.com/"

export const getAccountUrl = (address) => {
    return `${baseUrl}address/${address}`;
};

export const getTransactionUrl = (txHash) => {
    return `${baseUrl}tx/${txHash}`;
}

