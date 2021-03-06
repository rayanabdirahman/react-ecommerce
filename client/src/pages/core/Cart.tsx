import React from 'react';
import { getCartItems } from '../../api/cart';
import Card from '../../components/Card';
import { Link } from 'react-router-dom';
import Layout from '../../components/Layout';
import Checkout from '../../components/Checkout';

const CartPage: React.FunctionComponent = () => {
  const [items, setItems] = React.useState<any>([])
  const [run, setRun] = React.useState<any>(false);

  // lifecycle method to run everytime the component mounts
  React.useEffect(() => {
    // run functions to get cart items
    setItems(getCartItems())
  },[run])

  const showItems = (items: any) => (
    <div>
      <h2>Your cart has {`${items.length}`} items </h2>
      <hr/>
      {
        items.map((item: any, index: number) => (
          <Card 
            key={`cart-item--${index}`}
            product={item}
            showAddToCartButton={false}
            showRemoveFromCartButton={true}
            cartUpdate={true}
            setRun={setRun}
            run={run} 
          />)
        )
      }
    </div>
  )

  const noItemsMessage = () => (
    <div>
      <h2>Your cart empty </h2>
      <Link to="/shop">Continue shopping</Link>
    </div>
  )
  
  return (
    <Layout title="Shopping cart" description="Manage your cart items">
      <div className="row">
        <div className="col-6">
          { (items.length > 0) ?  showItems(items) : noItemsMessage()}
        </div>
        <div className="col-6">
          <h2 className="mb-4">Your cart summary</h2>
          <Checkout products={items} />
        </div>
      </div>
    </Layout>
  )
}

export default CartPage