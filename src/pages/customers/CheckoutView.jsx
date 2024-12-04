import "./checkoutView.css"

/**
 * 
 * @module Kiosk
 */

/**
 * 
 * @param {JSON, function} param0 
 * @returns HTML list of order items with removal functionality
 */
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
                <div >
                <button className="CK_killOrderButton" onClick={() => remove_Item(item.array_id)}> Delete Item</button>
                </div>
            </li>
        ))}
        </ul>
    );
}

/**
 * 
 * @param {JSON} items 
 * @returns An HTML float of the subtotal
 */
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

/**
 * links all needed helper functions to the buttons made here, creates the left checkout sidebar
 * @param {JSON, function, function, function} param0 
 * @returns HTML for the left current order sidebar
 */
export default function CheckoutView({ItemList, removeAll, remove_Item, checkout}) {
    // console.log(ItemList)
return (
    <div className="CK_checkoutContainer">
    <div className="CK_itemListContainer">
        <OrderItems ItemList = {ItemList}  remove_Item = {remove_Item}/>
    </div>
    <div className="CK_totalContainer">
    <div>Name on Order: <input type="text" id="username" name="username"/></div>
    <div>To-Go <input type="checkbox" id="togo" name="togo"/></div>
        <h1 className="CK_taxAmt">Subtotal: <Subtotal items = {ItemList}/></h1>
        
        <h1 className="CK_totAmt">Total: {getTotal(ItemList)}</h1>
        <div className="CK_btnContainer">
        <button className="CK_checkoutBtn" onClick = {() => checkout(document.getElementById("username").value,document.getElementById("togo").checked)}>Checkout</button>
        <button className="CK_clearBtn" onClick = {removeAll}>Clear</button>
        </div>
    </div>
    </div>
);
}


/**
 * 
 * @param {JSON} items 
 * @returns HTML float of the final total
 */
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



