import React from 'react'
import Layout from '../../components/Layout'
import { getCategories } from '../../api/category'
import Checkbox from '../../components/Checkbox'
import Radio from '../../components/Radio'
import prices from '../../domain/prices'
import { searchProducts } from '../../api/product'
import Card from '../../components/Card'

const Shop: React.FunctionComponent = () => {
  const [initialFilters, setInitialFilters] = React.useState<any>({
    filters: { category: [], price: [] }
  })
  const [categories, setCategories] = React.useState<any>([])
  const [error, setError] = React.useState<any>(false)
  const [limit, setLimit] = React.useState<any>(6)
  const [skip, setSkip] = React.useState<any>(0)
  const [size, setSize] = React.useState<any>(0)
  const [filteredResults, setFilteredResults] = React.useState<any>([])

  const init = async() => {
    try {
      const response = await getCategories ()

      // check for errors
      if (response.error) {
        return setError(response.statusText);
      }

      setCategories(response)

    } catch (error) {
      console.log(`init=>>> Failed to load products by sell: ${error}`)
    }
  }


  const loadFilteredResults = async (filters: any) => {
    try {
      const response = await searchProducts(skip, limit, filters)

      // check for errors
      if (response.error) {
        return setError(response.statusText)
      }
  
      setFilteredResults(response.products)
      // set size for results
      setSize(response.size)
      
      // set skip to zero
      setSkip(0)

    } catch (error) {
      console.log(`loadFilteredResults=>>> Failed to load filtered products: ${error}`)
    }
  }

  const loadMoreProducts = async () => {
    try {
      const productsToSkip = skip + limit

      const response = await searchProducts(productsToSkip, limit, initialFilters.filters)

      // check for errors
      if (response.error) {
        return setError(response.statusText)
      }
  
      setFilteredResults([...filteredResults, ...response.products])
      // set size for results
      setSize(response.size)
      
      // set skip to zero
      setSkip(0)

    } catch (error) {
      console.log(`loadFilteredResults=>>> Failed to load filtered products: ${error}`)
    }
  }

  // lifecycle method to run everytime the component mounts
  React.useEffect(() => {
    // run functions to get products
    init()
    loadFilteredResults(initialFilters)
  },[])

  const handleFilters = (filters: Array<string>, filterBy: string) => {
    const newFilters = {...initialFilters}
    newFilters.filters[filterBy] = filters

    // check if filterBy is price
    if (filterBy === 'price') {
      let priceValues = handlePrice(filters)
      newFilters.filters[filterBy] = priceValues
    }

    // call backend to retrive filtered products
    loadFilteredResults(initialFilters.filters)

    setInitialFilters(newFilters)
  }

  const handlePrice = (value: any) => {
    const data = prices
    let array: Array<any> = []

    for (let key in data) {
      if ( data[key]._id === parseInt(value)) {
        array = data[key].array
      }
    }

    return array
  }

  return (
    <Layout title="Shop page" description="Search and find books of your choice">
      <div className="row">
        <div className="col-2">
          <h4>Filter by categories</h4>
          <ul>
            <Checkbox categories={categories} handleFilters={ (filters: Array<string>) => handleFilters(filters, 'category')}/>
          </ul>

          <h4>Filter by prices</h4>
          <Radio prices={prices} handleFilters={ (filters: any) => handleFilters(filters, 'price')}/>
        </div>
        <div className="col-10">
          <h2 className="mb-4">Products</h2>
          <div className="row">
            {
              filteredResults.map((product: any, index: number) => (
                <div key={`filtered-product-card--${index}`} className="col-3 mb-3">
                  <Card product={product} />
                </div>
              ))
            }
          </div>
          <hr/>
          {
            (size > 0 && size >= limit) ? <button onClick={loadMoreProducts} className="btn btn-secondary btn-lg btn-block mb-5">Load more</button> : null
          }
        </div>
      </div>
    </Layout>
  )
}

export default Shop