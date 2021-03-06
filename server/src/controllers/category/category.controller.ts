import express from 'express';
import logger from '../../helpers/logger';
import CategoryService from '../../services/category.service';
import { ICreateCategoryModel } from '../../domain/interfaces';
import { CategoryValidator } from './category.validation';
import { ErrorMessage, SuccessMessage } from '../../constants';
import { IExtendedRequest } from '../../custom';

export default class CategoryController {
  private categoryService: CategoryService;

  constructor() {
    this.categoryService = new CategoryService();
  }

  // Find all categories
  public list =  async (req: express.Request, res: express.Response) => {
    try {

      // list all categories
      const categories = await this.categoryService.list();

      return res.status(200).json(categories);

    } catch (error) {
      const message = error.message || error;
      logger.error(`<<<CategoryController.list>>> ${ErrorMessage.LIST_CATEGORY}: ${message}`);
      res.send({ error: message });
    }
  }

  public create =  async (req: express.Request, res: express.Response) => {
    try {
      const createCategoryModel: ICreateCategoryModel = {
        ...req.body
      };

      // validate request
      const validity = CategoryValidator.create(createCategoryModel);
      if (validity.error) {
        const { message } = validity.error;

        return res.status(400).json({error: message});
      }

      // register user to database
      const category = await this.categoryService.create(createCategoryModel);

      res.status(200).json(category);

    } catch (error) {
      const message = error.message || error;
      logger.error(`<<<CategoryController.create>>> ${ErrorMessage.CREATE_CATEGORY}: ${message}`);
      res.send({ error: message });
    }
  }

  /**
   * Return category details stored in req.category
   */
  public read = (req: IExtendedRequest, res: express.Response) => {
    // return category details stored in req.category
    return res.status(200).json(req.category);
  }

  /**
   * Remove category details stored in req.category
   */
  public remove = (req: IExtendedRequest, res: express.Response) => {
    if (req.category) {
      const category = req.category;

      category.remove((error: Error, deletedCategory: ICreateCategoryModel) => {
        if (error) {
          logger.error(`<<<CategoryController.remove>>> ${ErrorMessage.REMOVE_CATEGORY_BY_ID}: ${error}`);

          return res.status(400).json({error: ErrorMessage.REMOVE_CATEGORY_BY_ID});
        }

        const message = `${SuccessMessage.DELETED_CATEGORY}`;

        return res.status(200).json({message});
      });
    }
  }


  /**
   * Update category details in database using req.category
   */
  public update =  async (req: IExtendedRequest, res: express.Response) => {
    try {
      const updateCategoryModel: ICreateCategoryModel = {
        ...req.body
      };

      // validate request
      const validity = CategoryValidator.create(updateCategoryModel);
      if (validity.error) {
        const { message } = validity.error;

        return res.status(400).json({error: message});
      }

      // register user to database
      const category = await this.categoryService.update(req.category, updateCategoryModel);

      res.send({ category });

    } catch (error) {
      const message = error.message || error;
      logger.error(`<<<CategoryController.update>>> ${ErrorMessage.UPDATE_CATEGORY}: ${message}`);
      res.send({ error: message });
    }
  }

  /**
   * Find category by ID and store details in req.category
   */
  public findById = async (req: IExtendedRequest, res: express.Response, next: express.NextFunction, id: string) => {
    try {

      // find category by Id
      const category = await this.categoryService.findById(id);
      if (!category) {
        logger.error(`<<<CategoryController.findById>>> ${ErrorMessage.FIND_CATEGORY_BY_ID}`);

        return res.status(400).json({error: ErrorMessage.FIND_CATEGORY_BY_ID});
      }

      // add category details to request object
      req.category = category;

      next();
    } catch (error) {
      const message = error.message || error;
      logger.error(`<<<CategoryController.findById>>>: ${message}`);
      res.status(400).send({ error: message });
    }
  }

}
