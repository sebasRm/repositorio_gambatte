const socket =io();
const deposits = document.querySelector('#deposits')

deposits.addEventListener('submit', e=>{
    e.preventDefault()
    console.log("enviando...")
})

let data = {
    data:
        {
            cardInfo:{
                cardNumber:"4894 4542 2316",
                ccv:"343",
                expYear:"28",
                month:"05",
                termAndConditions:true
            },
            deposit:{
                amount:600,
                depositDate:"2023-06-06",
                ecommerce:"",
                state:1
            },
            user:{
                email:"yirleison@bancolombia.com.co",
                fullName:"Yirleison Palomeque Moreno",
                id:1
            }
        }
}
socket.emit('newDeposit', data)