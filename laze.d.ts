import * as mongoose from "mongoose";
import * as cors from "cors";

declare namespace Laze {

  export interface DBOptions {
    url?: string,
    options?: mongoose.ConnectionOptions,
    models?: string | Function,
  }

  export interface AppOptions {
    cors?: cors.CorsOptions,
    db?: DBOptions,
  }
}

declare namespace express {
  export interface Request {
    user?: mongoose.Model<any>;
  }
}