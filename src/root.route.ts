import { internalRouter } from "./modules/auth/internal";
import { authRouter } from "./modules/auth/routes";
import { Router } from "express";
import { inviteRouter } from "./modules/invite/routers/invite.route";
import { authenticateJWT } from "./middlewares/auth.middleware";

const router = Router();

const moduleRoutes = [
  {
    protected: false,
    path: "/auth",
    module: authRouter,
  },
  {
    protected: false,
    path: "/auth/internal",
    module: internalRouter,
  },
  {
    protected: false,
    path: "/invite",
    module: inviteRouter,
  },
];

moduleRoutes.forEach((route) => {
  if (route.protected) {
    router.use(route.path, authenticateJWT, route.module);
  } else {
    router.use(route.path, route.module);
  }
});

export default router;
