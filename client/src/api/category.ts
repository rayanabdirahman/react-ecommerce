import { API_BASE_URL } from "../config";
import { ICreateCategoryModel } from "../domain/interfaces";

const API_CREATE_CATEGORY = `${API_BASE_URL}/category/create/`

/**
 * Create category
 * @param { string } userId - stores logged in user id
 * @param { string } token - stores user bearer token
 * @param { ICreateCategoryModel } category - stores required category details for creating a new category
 */
export const createCategory = async(userId: string, token: string, category:  ICreateCategoryModel) => {
  try {
    const createCategoryModel: ICreateCategoryModel = {
      ...category
    }

    let response = await fetch(`${API_CREATE_CATEGORY}${userId}`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(createCategoryModel)
    })

    return await response.json();

  } catch(error) {
    console.log(error)
    console.error(`API CALL:createCategory=>>>>>> Error when creating a category: ${error}`)
  }
}