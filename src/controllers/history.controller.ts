import { Request, Response, NextFunction } from "express";
import Query, { IQuery } from "../models/Query.model";

/*
 * Get 20 of the latest queries stored in Query table
  * URL : v1/history
  * METHOD : GET
  * REQUEST : {}
  * RESPONSE : Array(
  *   {
  *     addresses: Array(
  *        {
  *          ip: string
  *        }
  *      ),
  *      client_ip: string,
  *      created_at: number,
  *      domain: string
  *   }
  * )
*/

const list = (req: Request, res: Response, next: NextFunction) => {
  Query.find()
    .sort({ created_at: -1 })
    .limit(20)
    .then((queries: IQuery[]) => {
      res.json(queries.map((query: IQuery) => {
        return {
          addresses: query.addresses.map((address) => {
            return {
              ip: address.ip
            }
          }),
          client_ip: query.client_ip,
          created_at: query.created_at,
          domain: query.domain
        }
      }));
    })
    .catch(next);
};

export { list };
