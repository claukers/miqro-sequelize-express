import { IAPIRequest, Route } from "miqro-express";

export interface IModelRoute {
  getInstance(req: IAPIRequest, res): Promise<void>;
  postInstance(req: IAPIRequest, res): Promise<void>;
  deleteInstance(req: IAPIRequest, res): Promise<void>;
  patchInstance(req: IAPIRequest, res): Promise<void>;
  putInstance(req: IAPIRequest, res): Promise<void>;
}

export const setupModelRouter = (router: Route, handler: IModelRoute) => {
  // Get All
  router.get("/", async (req: IAPIRequest, res) => {
    return handler.getInstance(req, res);
  });
  // Get by Id
  router.get("/:id", async (req: IAPIRequest, res) => {
    return handler.getInstance(req, res);
  });
  // Post
  router.post("/", async (req: IAPIRequest, res) => {
    return handler.postInstance(req, res);
  });
  // Delete by id
  router.delete("/:id", async (req: IAPIRequest, res) => {
    return handler.deleteInstance(req, res);
  });
  // Patch by id
  router.patch("/:id", async (req: IAPIRequest, res) => {
    return handler.patchInstance(req, res);
  });
  // Patch by id
  router.put("/", async (req: IAPIRequest, res) => {
    return handler.putInstance(req, res);
  });
};
