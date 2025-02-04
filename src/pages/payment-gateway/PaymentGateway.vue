<template>
    <div class="App" style="">
        <div style="">PayHQ Hosted Payment Page Demo</div>
        <table class="Table">
            <tbody>
                <tr>
                    <td class="Cell">
                        <h2>About this demo page</h2>
                        <p>
                            This demo page mimics a shopping cart and payment experience on a real
                            merchant website. You as an end user are looking at a dummy shopping
                            cart and are ready to make a payment. You will be redirected to the
                            hosted payment page to complete the payment.
                        </p>
                    </td>
                </tr>
            </tbody>
        </table>
        <br />
        <div style="">Shopping Cart</div>
        <table class="Table">
            <thead>
                <tr>
                    <th class="HeaderCell">Item</th>
                    <th class="HeaderCell">Quantity</th>
                    <th class="HeaderCell">Price</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td class="Cell">Gaming headsets</td>
                    <td class="Cell">1</td>
                    <td class="Cell">114.99 CAD</td>
                </tr>
                <tr>
                    <td class="Cell">SanDisk 128GB MicroSD card</td>
                    <td class="Cell">1</td>
                    <td class="Cell">25.50 CAD</td>
                </tr>
                <tr>
                    <td class="" />
                    <td class="FooterCell">
                        <b>Total</b>
                    </td>
                    <td class="FooterCell">140.49 CAD</td>
                </tr>
            </tbody>
        </table>
        <div :style="`clear: both, margin-top: 40px`" />
        <div style="">
            <div style="">
                <div>Amount:</div>
                <div>Tax:</div>
                <div>Shipping Charge:</div>
                <div style="">Total Amount:</div>
            </div>
            <div style="">
                <div>CAD 140.49</div>
                <div>CAD 5.44</div>
                <div>CAD 10.00</div>
                <div style="">CAD 155.93</div>
            </div>
        </div>
        <table class="Table">
            <tbody>
                <tr>
                    <td class="Cell">
                        <h2>Steps to test</h2>
                        <ul>
                            <li>
                                Click on the checkout button below to be redirected to the hosted
                                payment page
                            </li>
                            <li>
                                Fill in the payment details on the hosted pay page and complete the
                                transaction
                            </li>
                            <li>
                                On completing the transaction, you will be redirected back to this
                                website with transaction confirmation and lookup id
                            </li>
                            <li>
                                This lookup id can be used to query transaction details from the
                                PayHQ backing using your merchant account credentials
                            </li>
                        </ul>
                    </td>
                </tr>
            </tbody>
        </table>

        <table class="Table">
            <thead>
                <tr>
                    <td class="Cell" colSpan="2">
                        <h2>Test card details</h2>
                    </td>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td class="Cell">Card number :</td>
                    <td class="Cell">4111 1111 1111 1111</td>
                </tr>
                <tr>
                    <td class="Cell">CVV</td>
                    <td class="Cell">Any 3 digits</td>
                </tr>
                <tr>
                    <td class="Cell">Expiry date</td>
                    <td class="Cell">Any future date</td>
                </tr>
            </tbody>
        </table>
        <table class="Table">
            <tbody>
                <tr>
                    <td class="Cell">
                        <h2>Contact info</h2>
                        <p>
                            Make sure to put in your correct email address in order to receive the
                            transaction receipt
                        </p>
                    </td>
                </tr>
            </tbody>
        </table>

        <button style="" @click="checkout">CHECKOUT</button>
    </div>
</template>

<script>
import axios from "axios"
export default {
    methods: {
        checkout() {
            const ENDPOINT = "https://apigateway.payfirma.com/merchant-service/hpp/init"
            const DOMAIN = "https://google.com"
            const TOKEN =
                "eyJhbGciOiJIUzI1NiJ9.eyJhY2Nlc3NfdG9rZW4iOiIyMTNhMGU4Ni05M2M5LTRlMTUtOGUzNi0zYjA0YjgwNjMxYjgiLCJzY29wZSI6WyJtZXJjaGFudCIsInRyYW5zYWN0aW9uIl0sIm1lcmNoYW50X2lkIjoiZjQ5ZDhlOTc1OCIsImV4cCI6MjAyNTM4NDcwNX0.KeGbSenv8jRkALeWcDRZnBx4cYDVODUzsITrBcgXQ7Q"

            const requestBody = {
                // Amount to be charged
                amount: 140.49,
                // CAD or USD
                currency: "CAD",
                // Domain registered in PayHQ - Settings - Hosted Pay Page when you setup
                // ex) https://payfirma-hpp-demo.web.app
                domain: DOMAIN,
                tax: 5.44,
                shipping_charge: 10.0,
                // State that needs to be contained with redirect URL when the transaction is done
                state: "stateIWantToKeep",
                // Field used to keep track of transactions and for future accounting reconciliation
                custom_id: "23424",

                // Extra optional fields can be sent below

                // first_name: 'firstName',
                // last_name: 'lastName',
                // email: 'email',
                // telephone: 'telephone',
                // shipping_address: '{"address1":"","address2":"","city":"","province":"","country":"","postalCode":""}',
                // billing_address: '{"address1":"","address2":"","city":"","province":"","country":"","postalCode":""}',
            }
            const header = {
                headers: {
                    // HPP Token generated through the PayHQ Settings page
                    Authorization: `Bearer ${TOKEN}`,
                    "Content-Type": "application/json",
                },
            }
            // ********************************************************
            // Send a post request to initialize HPP Transaction
            axios.post(ENDPOINT, requestBody, header).then((response) => {
                // If Success
                if (response.status === 200) {
                    // Users are linked to Payfirma Hosted Pay Page
                    window.location.href = response.data.url
                }
            })
        },
    },
}
</script>

<style></style>
