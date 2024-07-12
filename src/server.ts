import { app } from "./app";
import swaggerUi from 'swagger-ui-express';
import * as swaggerDocument from '../dist/swagger.json';
import { expressAuthentication } from "./middlwares/authentication";
import { errorHandler } from "./middlwares/errorHandler";

const port = process.env.PORT || 3000;
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use(expressAuthentication);
app.use(errorHandler)
app.listen(port, () =>
  console.log(`http://localhost:${port}`)
);