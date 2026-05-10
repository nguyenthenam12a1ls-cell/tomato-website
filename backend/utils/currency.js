const toStripeAmount = (amount) => {
    const cent = amount * 100;
    return Math.round(cent);
}

const formatVND = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
    }).format(amount);
};

export { toStripeAmount, formatVND };