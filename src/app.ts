import express, {ErrorRequestHandler} from "express";
import morgan from "morgan";
import cors from "cors";
import { policiesRoutes } from './routes/policyRoutes';
import { authRoutes } from "./routes/authRoutes";



const app = express();

//Middleware
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());


//Routes
app.use('/policies', policiesRoutes);
app.use('/auth', authRoutes);

// Error Handler
const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
    res.status(500).json({ error: err.message });
  };
  app.use(errorHandler);

export default app;
