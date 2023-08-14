import { CreateClientOptions, createClient } from '@simplified/shared';
import { Logger } from '@streamr/utils';
import { Command } from 'commander';
import { Validator } from '../Validator';
import { devNetworkOption, privateKeyOption, streamIdOption } from './options';

const logger = new Logger(module);

interface Options {
	devNetwork: boolean;
	privateKey: string;
	streamId: string;
}

export const startCommand = new Command('start')
	.description('Start Broker')
	.addOption(devNetworkOption)
	.addOption(privateKeyOption)
	.addOption(streamIdOption)
	.action(async (options: Options) => {
		logger.info('Starting Validator...');

		const createClientOptions: CreateClientOptions = {
			devNetwork: options.devNetwork
		}

		const client = await createClient(options.privateKey, createClientOptions);
		const stream = await client.getStream(options.streamId);

		const validator = new Validator(client, stream);
		await validator.start();
	});
