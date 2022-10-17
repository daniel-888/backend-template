import { Request, Response, NextFunction } from "express";

/*
 * Validate if the given ip address is type of IPv4
  * URL : v1/history
  * METHOD : POST
  * REQUEST : { body: { ip: string } }
  * RESPONSE : { status: true/false }
*/
const DoValidate = (req: Request, res: Response, next: NextFunction) => {
  try {
    const { ip } = req.body;
    if (typeof ip == "undefined") {
      res.status(400).json({ message: "The ip to validate is required."});
    }
    else {
      const pattern_IPv4 =
        /^(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)(?:\.(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)){3}$/gm; // RegEx for validating IPv4 address
      if (ip.match(pattern_IPv4)) {
        res.json({ status: true })
      }
      else {
        res.json({ status: false })
      }
    }
    
  } catch (err) {
    next(err);
  }
};

export { DoValidate };
