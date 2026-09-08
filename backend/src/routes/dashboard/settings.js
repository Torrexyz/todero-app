import { Router } from "express";

//====================//

const router = Router();

//====================//

router.get("/test", (req, res) => {
  res.send(`Se consulto con éxito la ruta: ${req.baseUrl}${req.url}`);
});

//====================//

export default router;
