function Item({ type, side, entrees, price }) {
  return (
    <div className="cshr_itemContainer">
      <h1 className="cshr_typeLbl">{type}</h1>
      <h2 className="cshr_priceLbl">{price}</h2>
      <h3 className="cshr_sideLbl">{side}</h3>
      <ul className="cshr_entreeList">
        {entrees.map((entree) => (
          <li key={entree}>{entree}</li>
        ))}
      </ul>
    </div>
  );
}

export default Item;
