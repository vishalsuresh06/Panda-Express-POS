import "./checkoutView.css"

function OrderItems({ItemList, remove_Item}) {
    return(
        <ul>
        {ItemList.map((item) => (
            <li key={item.array_id}>
                {item.name}  ---  ${item.price.toFixed(2)}
                <ul>
                    {item.items.map((i,index) => (
                        <li key={index}>
                            {i.name}
                        </li>
                    ))}
                </ul>
                <div className="CK_killOrderButton">
                <button onClick={() => remove_Item(item.array_id)}> Delete Item</button>
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
            ${total.toFixed(2)}
        </>
    );
}

export default function CheckoutView({ItemList, removeAll, remove_Item, checkout}) {
return (
    <div className="CK_checkoutContainer">
    <div className="CK_itemListContainer">
        <OrderItems ItemList = {ItemList}  remove_Item = {remove_Item}/>
    </div>
    <div className="CK_totalContainer">
        <h1 className="CK_taxAmt">Subtotal: <Subtotal items = {ItemList}/></h1>
        
        <h1 className="CK_totAmt">Total: {getTotal(ItemList)}</h1>
        <div className="CK_btnContainer">
        <button className="CK_checkoutBtn" onClick = {checkout}>Checkout</button>
        <button className="CK_clearBtn" onClick = {removeAll}>Clear</button>
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
            ${(total * 1.08).toFixed(2)}
        </>
    );
}



