import { Router } from 'express';
import { Authenticate, RequireAdmin } from '../middleware/auth.middleware';
import recordController from '../controllers/record.controller';
import { validate } from '../middleware/validation.middleware';
import { CreateRecordDto, UpdateRecordDto } from '../dto/record.dto';

const router = Router();

router.use(Authenticate);

router.get("/", recordController.getRecords.bind(recordController));
router.get('/all', RequireAdmin, recordController.getAllRecords.bind(recordController));
router.post('/', RequireAdmin, validate(CreateRecordDto), recordController.createRecord.bind(recordController));
router.put('/:id', RequireAdmin, validate(UpdateRecordDto), recordController.updateRecord.bind(recordController));
router.delete('/:id', RequireAdmin, recordController.deleteRecord.bind(recordController));


export default router;