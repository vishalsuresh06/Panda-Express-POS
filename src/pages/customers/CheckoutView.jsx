function OrderItems({ItemList, remove_Item}) {
    return(
        <ul>
        {ItemList.map((item) => (
            <li key={item.array_id}>
                {item.name}
                <div className="Cust_killOrderButton">
                <button onClick={() => remove_Item(item.array_id)}> kill Item</button>
                </div>
            </li>
        ))}
        </ul>
    );
}

function Subtotal(items){
    const total = Object.values(items).flat().reduce((sum, item) => {
        return sum + Number(item.price)
        
    }, 0)
    return(
        // {items.map((item) => (
        //     <li key={item.array_id}>{item.name}</li>
        // ))}
        <>
            {total.toFixed(2)}
        </>
    );
}

export default function CheckoutView({ItemList, removeAll, remove_Item, checkout}) {
return (
    <div className="cshr_checkoutContainer">
    <div className="cshr_itemListContainer">
        <OrderItems ItemList = {ItemList}  remove_Item = {remove_Item}/>
    </div>
    <div className="cshr_totalContainer">
        <h1 className="cshr_taxAmt">Subtotal: <Subtotal items = {ItemList}/></h1>
        
        <h1 className="cshr_totAmt">Total: {getTotal(ItemList)}</h1>
        <div className="cshr_btnContainer">
        <button className="cshr_checkoutBtn" onClick = {checkout}>Checkout</button>
        <button className="cshr_clearBtn" onClick = {removeAll}>Clear</button>
        </div>
    </div>
    </div>
);
}



function getTotal(items={ItemList}){
    // console.log(Object.values(items).flat())
    const total = Object.values(items).flat().reduce((sum, item) => {
        return sum + Number(item.price)
        
    }, 0)
    
    return(
        // {items.map((item) => (
        //     <li key={item.array_id}>{item.name}</li>
        // ))}
        <>
            {(total * 1.08).toFixed(2)}
        </>
    );
}



