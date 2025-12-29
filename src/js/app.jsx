// This event triggers when the waiter clicks "Pay" on the tablet
poster.on('beforeOrderClose', (result) => {
    return new Promise((resolve, reject) => {
        // 1. Create a prompt for the scan (or show a custom modal)
        const token = prompt("Scan Customer Card/QR Token:");

        if (!token) {
            poster.interface.showAlert('Cancelled', 'No token scanned.');
            return reject();
        }

        // 2. Send the scan data to your Make.com Webhook
        fetch('https://hook.us2.make.com/m9ql0nw5yn8qk1x7lsm29n9psabtqgep', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                token: token,
                amount: result.order.payed_sum,
                transaction_id: result.order.id,
                spot_id: result.order.spot_id
            })
        })
        .then(res => res.json())
        .then(data => {
            if (data.status === 'success') {
                poster.interface.showAlert('Success', 'Payment accepted by Payme');
                // 3. This tells Poster it's safe to close the order
                resolve(); 
            } else {
                poster.interface.showAlert('Error', data.message || 'Payment failed');
                reject();
            }
        })
        .catch(() => {
            poster.interface.showAlert('Connection Error', 'Check internet/Make.com');
            reject();
        });
    });
});
