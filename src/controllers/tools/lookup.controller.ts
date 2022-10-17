import { Request, Response, NextFunction } from "express";
import dns2 from "dns2";
import Query, { IQuery } from "../../models/Query.model";
import isValidDomain from "is-valid-domain";
/*
 * List of IPv4 addresses available with given domain
 * URL : v1/tools/lookup
 * METHOD : GET
 * REQUEST : { query: { domain: string } }
 * RESPONSE :
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
 */
const IPv4List = (req: Request, res: Response, next: NextFunction) => {
  try {
    const domain: string = req.query.domain as string;
    if (typeof domain == "undefined") {
      res.status(400).json({ message: "The query 'domain' is required." });
    } else {
      if (!isValidDomain(domain)) {
        return res.status(400).json({ message: "The domain is invalid" });
      }
      const dns = new dns2();
      dns
        .resolveA(domain)
        .then((result) => {
          if (result.answers.length === 0)
            return res
              .status(404)
              .json({ message: "The domain is not found." });
          new Query({
            addresses: result.answers.map((answer: dns2.DnsAnswer) => {
              return {
                ip: answer.address,
              };
            }),
            client_ip: req.headers["x-forwarded-for"] as string,
            domain,
          })
            .save()
            .then((query: IQuery) => {
              const { addresses, client_ip, created_at, domain } = query;
              res.json({
                addresses: addresses.map((address) => {
                  return {
                    ip: address.ip,
                  };
                }),
                client_ip,
                created_at,
                domain,
              });
            })
            .catch(next);
        })
        .catch(next);
    }
  } catch (err) {
    next(err);
  }
};

export { IPv4List };
