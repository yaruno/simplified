import { program } from 'commander';
import 'dotenv/config';
import { createStreamCommand } from './createStreamCommand';

program
  .addCommand(createStreamCommand)
  .parse(process.argv);
